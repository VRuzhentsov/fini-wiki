# Repo/Wiki Documentation Split

Date: 2026-04-27
Repo: `~/projects/fini`
Wiki: `~/projects/fini-wiki`

## User Goal

Keep part of the documentation in the main `fini` repo and another part in `fini-wiki`, with a clear boundary between the two.

## Final Policy

### Keep in `fini`

Documentation that is load-bearing for implementation and should evolve in the same review as code.

This includes:

- `specs/<feature>/README.md` feature specs
- companion docs next to implementation files such as `src/**/*.md`
- backend/service companion docs when needed
- repo workflow instructions in `AGENTS.md`

These docs should define:

- current feature behavior
- invariants and contracts
- acceptance criteria that can be tested
- ownership boundaries between UI, stores, and backend services

### Keep in `fini-wiki`

Documentation that is broader, historical, strategic, or synthesized across multiple implementation phases.

This includes:

- product rationale and historical intent
- architecture evolution and superseded approaches
- roadmap and planning captures
- cross-feature analysis
- long-form design and decision context

### Boundary Rule

If code can be wrong against the document, it belongs in `fini/specs`.

If the document explains why the current implementation exists, how it evolved, or what may happen later, it belongs in `fini-wiki`.

If both are useful, keep the enforceable contract in `fini/specs` and link to the wiki for rationale/history.

## Feature Spec Shape In Repo

Current feature-grouped Markdown spec structure in `fini`:

- `specs/device-connect/README.md`
- `specs/space-sync/README.md`
- `specs/space/README.md`

Each feature spec is the implementation contract for that feature.

## Repo Changes Made

- Updated `~/projects/fini/AGENTS.md` to point to `specs/`
- Added/updated `~/projects/fini/specs/README.md` with the repo/wiki boundary
- Added wiki link sections to repo feature specs
- Updated `src/views/SettingsView.md`, `src/views/AddDeviceView.md`, and `src/views/DeviceView.md` to point at concrete feature specs

## Evidence Reviewed

- `~/projects/fini/AGENTS.md`
- `~/projects/fini/specs/README.md`
- `~/projects/fini/src/README.md`
- `~/projects/fini/src/views/SettingsView.md`
- `~/projects/fini/src/views/AddDeviceView.md`
- `~/projects/fini/src/views/DeviceView.md`
- `~/projects/fini-wiki/AGENTS.md`
- `~/projects/fini-wiki/_hot.md`
- `~/projects/fini-wiki/_index.md`

## Decisions Made

- Repo specs are feature-grouped Markdown under `specs/`
- Repo docs own current implementation contracts
- Wiki owns rationale, history, strategy, and synthesized context
- Repo feature specs should link back to corresponding wiki concept pages when they exist

## Open Questions

- Whether to move more cross-cutting frontend companion docs into feature specs over time
- Whether to add a matching wiki page that summarizes the repo/wiki doc policy for direct wiki navigation

## Deferred Work

- Migrating older scattered domain docs into `specs/<feature>/README.md`
- Updating wiki concept pages to link back to repo specs
- Adding backend companion markdown docs under `src-tauri/` where appropriate
