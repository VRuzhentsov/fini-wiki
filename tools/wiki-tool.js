#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PAGES = path.join(ROOT, "pages");
const SKILLS = path.join(ROOT, ".agents", "skills");
const CONTROL_FILES = ["_hot.md", "_index.md", "AGENTS.md"].map((file) => path.join(ROOT, file));
const ALLOWED_EDGES = new Set([
  "uses",
  "depends_on",
  "supersedes",
  "contradicts",
  "derived_from",
  "updates",
  "blocks",
  "validates",
]);
const LINK_RE = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
const EDGE_RE = /^([A-Za-z_][A-Za-z0-9_]*)::\s*\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/gm;
const TOKEN_RE = /[A-Za-z0-9_/-]+/g;

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join("/");
}

function exists(file) {
  return fs.existsSync(file);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function walk(dir) {
  if (!exists(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(full));
    if (entry.isFile() && entry.name.endsWith(".md")) results.push(full);
  }
  return results.sort();
}

function pageFiles() {
  return walk(PAGES);
}

function skillFiles() {
  return walk(SKILLS).filter((file) => path.basename(file) === "SKILL.md");
}

function searchableFiles() {
  return CONTROL_FILES.filter(exists).concat(skillFiles(), pageFiles());
}

function withoutMd(value) {
  return value.endsWith(".md") ? value.slice(0, -3) : value;
}

function stripAnchor(target) {
  return target.split("#", 1)[0];
}

function frontmatter(text) {
  if (!text.startsWith("---\n")) return { data: {}, ok: false };
  const end = text.indexOf("\n---", 4);
  if (end === -1) return { data: {}, ok: false };
  const data = {};
  for (const line of text.slice(4, end).split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    data[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { data, ok: true };
}

function pageIndex() {
  const index = new Map();
  for (const file of searchableFiles()) {
    const candidates = new Set([withoutMd(rel(file)), path.basename(file, ".md")]);
    if (file.startsWith(PAGES + path.sep)) {
      const pageRel = withoutMd(path.relative(PAGES, file).split(path.sep).join("/"));
      candidates.add(pageRel);
      if (pageRel.startsWith("sources/")) candidates.add(pageRel.slice("sources/".length));
    }
    for (const candidate of candidates) {
      if (!index.has(candidate)) index.set(candidate, []);
      index.get(candidate).push(file);
    }
  }
  return index;
}

function resolveTarget(target, index) {
  let clean = withoutMd(stripAnchor(target).trim());
  if (!clean) return null;
  if (index.has(clean)) return index.get(clean)[0];
  if (clean.startsWith("pages/")) {
    const exact = path.join(ROOT, `${clean}.md`);
    return exists(exact) ? exact : null;
  }
  const source = path.join(PAGES, "sources", `${clean}.md`);
  return exists(source) ? source : null;
}

function findPage(pageOrSlug) {
  const direct = path.join(ROOT, pageOrSlug);
  if (exists(direct) && fs.statSync(direct).isFile()) return direct;
  return resolveTarget(withoutMd(pageOrSlug), pageIndex());
}

function allRegexMatches(regex, text) {
  regex.lastIndex = 0;
  return Array.from(text.matchAll(regex));
}

function checkFrontmatter(file, text) {
  const issues = [];
  const { data, ok } = frontmatter(text);
  if (!ok) {
    issues.push(`${rel(file)}: missing or malformed YAML frontmatter`);
    return issues;
  }
  for (const key of ["title", "type", "created", "updated", "sources", "tags"]) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) {
      issues.push(`${rel(file)}: frontmatter missing \`${key}\``);
    }
  }
  if (data.claim_status && !["locked", "provisional", "superseded", "contradicted", "historical"].includes(data.claim_status)) {
    issues.push(`${rel(file)}: unknown claim_status \`${data.claim_status}\``);
  }
  if (data.evidence && !["source-backed", "repo-inspected", "user-locked", "inferred"].includes(data.evidence)) {
    issues.push(`${rel(file)}: unknown evidence \`${data.evidence}\``);
  }
  if (data.claim_status === "provisional" && !text.includes("[!question]") && !text.includes("Open questions")) {
    issues.push(`${rel(file)}: provisional claim_status lacks nearby question/open questions`);
  }
  return issues;
}

function commandCheck() {
  const issues = [];
  const index = pageIndex();
  const pages = pageFiles();
  const pageSet = new Set(pages);
  const inbound = new Map(pages.map((file) => [file, 0]));

  for (const file of pages) {
    const text = read(file);
    issues.push(...checkFrontmatter(file, text));
  }

  for (const file of searchableFiles()) {
    const text = read(file);
    for (const match of allRegexMatches(LINK_RE, text)) {
      const target = match[1];
      if (target.startsWith("#")) continue;
      const resolved = resolveTarget(target, index);
      if (!resolved && pageSet.has(file)) issues.push(`${rel(file)}: broken wikilink \`[[${target}]]\``);
      else if (inbound.has(resolved)) inbound.set(resolved, inbound.get(resolved) + 1);
    }
    if (!pageSet.has(file)) continue;
    for (const match of allRegexMatches(EDGE_RE, text)) {
      const edge = match[1];
      const target = match[2];
      if (!ALLOWED_EDGES.has(edge)) issues.push(`${rel(file)}: unknown typed edge \`${edge}::\``);
      if (!resolveTarget(target, index)) issues.push(`${rel(file)}: broken typed edge \`${edge}:: [[${target}]]\``);
    }
  }

  for (const [file, count] of inbound) {
    if (count === 0 && !rel(file).includes("/sources/")) {
      issues.push(`${rel(file)}: no inbound wikilinks from checked files`);
    }
  }

  const hot = path.join(ROOT, "_hot.md");
  if (exists(hot)) {
    const match = read(hot).match(/^Updated:\s*(\d{4}-\d{2}-\d{2})/m);
    if (match) {
      const updated = new Date(`${match[1]}T00:00:00Z`);
      const now = new Date();
      const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      const age = Math.floor((today - updated) / 86400000);
      if (age > 14) issues.push(`_hot.md: Updated date is ${age} days old`);
    } else {
      issues.push("_hot.md: missing `Updated: YYYY-MM-DD` line");
    }
  }

  if (issues.length === 0) {
    console.log("wiki-check: no issues found");
    return 0;
  }
  console.log(`wiki-check: ${issues.length} issue(s)`);
  for (const issue of issues) console.log(`- ${issue}`);
  return 1;
}

function commandSearch(args) {
  const limitIndex = args.indexOf("--limit");
  let limit = 10;
  if (limitIndex !== -1) {
    limit = Number(args[limitIndex + 1] || 10);
    args.splice(limitIndex, 2);
  }
  const tokens = (args.join(" ").match(TOKEN_RE) || []).map((token) => token.toLowerCase());
  if (tokens.length === 0) {
    console.error("wiki-search: provide a query");
    return 2;
  }
  const scored = [];
  for (const file of searchableFiles()) {
    const text = read(file);
    const haystack = text.toLowerCase();
    const fileText = rel(file).toLowerCase();
    let score = 0;
    for (const token of tokens) {
      score += haystack.split(token).length - 1;
      if (fileText.includes(token)) score += 5;
    }
    if (score <= 0) continue;
    const snippets = [];
    const lines = text.split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const lower = lines[index].toLowerCase();
      if (tokens.some((token) => lower.includes(token))) {
        snippets.push(`${index + 1}: ${lines[index].trim().slice(0, 180)}`);
      }
      if (snippets.length === 3) break;
    }
    scored.push({ score, file, snippets });
  }
  scored.sort((a, b) => b.score - a.score || rel(a.file).localeCompare(rel(b.file)));
  for (const item of scored.slice(0, limit)) {
    console.log(`${rel(item.file)}  score=${item.score}`);
    for (const snippet of item.snippets) console.log(`  ${snippet}`);
  }
  if (scored.length === 0) console.log("wiki-search: no matches");
  return 0;
}

function commandEdges(args) {
  const page = args[0];
  if (!page) {
    console.error("wiki-edges: provide a page or slug");
    return 2;
  }
  const file = findPage(page);
  if (!file) {
    console.error(`wiki-edges: page not found: ${page}`);
    return 2;
  }
  const targetRel = withoutMd(rel(file));
  const targetStem = path.basename(file, ".md");
  console.log(`Page: ${rel(file)}`);
  const outbound = allRegexMatches(EDGE_RE, read(file)).map((match) => [match[1], match[2]]);
  console.log("Outbound typed edges:");
  if (outbound.length) for (const [edge, target] of outbound) console.log(`- ${edge}:: [[${target}]]`);
  else console.log("- none");
  console.log("Inbound typed edges:");
  let found = false;
  for (const other of pageFiles()) {
    if (other === file) continue;
    for (const match of allRegexMatches(EDGE_RE, read(other))) {
      const clean = withoutMd(stripAnchor(match[2]));
      if ([targetRel, targetStem, targetRel.replace(/^pages\//, "")].includes(clean)) {
        found = true;
        console.log(`- ${rel(other)}: ${match[1]}:: [[${match[2]}]]`);
      }
    }
  }
  if (!found) console.log("- none");
  return 0;
}

function usage() {
  console.error("usage: wiki-tool.js <check|search|edges> [...args]");
}

const [command, ...args] = process.argv.slice(2);
let code = 2;
if (command === "check") code = commandCheck(args);
else if (command === "search") code = commandSearch(args);
else if (command === "edges") code = commandEdges(args);
else usage();
process.exit(code);
