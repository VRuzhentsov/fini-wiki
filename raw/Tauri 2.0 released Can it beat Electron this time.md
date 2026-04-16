---
title: "Tauri 2.0 released: Can it beat Electron this time?"
source: "https://medium.com/@sevenall/tauri-2-0-released-can-it-beat-electron-this-time-c748663d90ea"
author:
  - "[[Sevenall Bin]]"
published: 2024-10-14
created: 2026-04-12
description: "Tauri 2.0 released: Can it beat Electron this time? Recently, Tauri, a framework that has been widely recognized in the cross-platform development field, released version 2.0. Let’s take a closer …"
tags:
  - "clippings"
---
Recently, Tauri, a framework that has been widely recognized in the cross-platform development field, released version 2.0. Let’s take a closer look at some of the noteworthy updates.

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*UCbOegEixJDeMDJdkxgO2g.png)

Tauri 2.0

Tauri is a framework for building lightweight and fast binary files that supports all major desktop platforms (macOS, Linux, Windows) and mobile platforms (iOS, Android). Developers can combine any frontend framework (such as HTML, JavaScript, and CSS) with backend logic written in languages like Rust, Swift, and Kotlin to create applications with exceptional user experience.

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Zlw2jLGCZ-yPEy4Y7wx9mw.png)

In Tauri applications, the frontend is built using familiar web frontend technologies and runs in a WebView of the operating system, communicating with the main application core primarily written in Rust. Developers do not need to have programming skills in Rust, Swift, or Kotlin as Tauri provides rich JavaScript APIs.

### When should you use Tauri?

If you meet any of the following requirements, Tauri may be your best choice:

- Want a single UI codebase that works on all platforms?
- Want to reach as many users as possible on different platforms like Windows, macOS, Linux, Android, and iOS?
- Are you a frontend web developer and want to write native applications?
- Are you a Rust developer and want to write beautiful-looking, Rust-implementable applications?
- Have an existing web development team and want to expand into the native app market with low upfront investment?
- Have an existing Rust development team and want all code to be written in Rust?

### The popularity of Tauri.

Tauri has approximately 4,878 pull requests and 3,570 closed issues on GitHub, along with approximately 1,000 discussions. Our Discord server currently has around 17,700 members who support each other, ask questions, and discuss Tauri-related development topics. We sincerely appreciate the community’s positivity and support.

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*lz2-6-CMc-_Aftpd13z3xQ.png)

The official also maintains a curated list of Tauri related projects, applications, plugins, and guides — awesome-tauri. If you’re looking for inspiration, you can check out the content here and add your own project.

> [https://github.com/tauri-apps/awesome-tauri?tab=readme-ov-file#applications](https://github.com/tauri-apps/awesome-tauri?tab=readme-ov-file#applications)

### The journey from Tauri 1.0 to 2.0

In June 2022, Tauri 1.0 was released, greatly impacting the desktop operating system market and the way cross-platform applications are built. By the end of 2022, an initial alpha version of 2.0 was released to gather feedback and test the definition of mobile interactions. Over the next two years, the architecture of Tauri was continuously adjusted and optimized publicly, leading to the release of a beta version in February of this year, which was audited by an external security company to review decisions and architecture changes.

In August of this year, a candidate version of 2.0 was released with the aim of addressing major bugs and gathering more feedback from actual usage. After extensive fixes and documentation improvements, the stable version of Tauri 2.0 was officially released.

![](https://miro.medium.com/v2/resize:fit:1288/format:webp/1*I_rq2TAyGLpYqurGHQPgNg.jpeg)

Tauri’s success is due to the contributions of many contributors, especially Lucas, who has continuously provided code changes for many years. In addition, there are Amr, Fabian-Lars, Tony, Chip, Jason, YuWei, icb, Simon, Oliver Lemasle and many other contributors.

## Get Sevenall Bin’s stories in your inbox

Join Medium for free to get updates from this writer.

Let’s take a look at the main highlights of Tauri 2.0.

### Mobile support.

Tauri 2.0 introduces native support for iOS and Android, greatly expanding Tauri’s use cases and allowing developers to use a brand new mobile plugin system to expose application logic to the Tauri frontend. This means that developers can not only enjoy the convenience brought by Tauri on desktop platforms, but also seamlessly reuse existing logic code on mobile platforms.

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*mx0YMLVZauovC_dloKvtPA.png)

### A better onboarding experience.

Tauri 2.0 has recently launched the create-tauri-app project, enabling developers to quickly build a Tauri application from scratch and save time.

```c
# The available commands are as follows:
sh <( curl https://create.tauri.app/sh )
npm create tauri-app@latest
yarn create tauri-app
pnpm create tauri-app
bun create tauri-app
cargo install create-tauri-app --locked
cargo create-tauri-app
```

### Hot Module Replacement (HMR)

Tauri 2.0 has expanded its hot module replacement feature to support mobile devices and emulators, allowing developers to preview changes immediately without the need to rebuild the entire application.

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*wXs1an8QqW4OCT5UsOjZkA.jpeg)

### Advanced Plugin System.

The plugin system of Tauri 2.0 has been completely restructured to offer stronger extensibility and flexibility. Many original features have been transferred to official plugins, making it easier for the community to get started and accelerating the implementation of new features. The plugin system supports developers to write or reuse native code written in Swift or Kotlin, and directly expose it to the Tauri frontend through annotations. Here are some important plugin examples:

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*hw9lHQc0aqD6lmABF5K1yg.jpeg)

### New permission system.

Tauri 2.0 introduces a brand new permission system to replace the previous allowlist system. The new system uses permissions, scopes, and abilities to create a flexible and easy-to-use access control system. This covers not only Tauri’s core APIs but also supports application and plugin developers to implement their own access control.

```c
[[permission]]
identifier = 'my-identifier'
description = 'This describes the impact and more.'
commands.allow = [
    'read_file'
]

[[scope.allow]]
my-scope = '$HOME/*'

[[scope.deny]]
my-scope = '$HOME/secret'
```

### Inter-process communication (IPC)

Tauri 2.0 has completely rewritten its internal communication (IPC) layer, greatly improving data transmission efficiency.

- Raw Payloads: support large data transmission, making communication between front-end and back-end more efficient.
- Raw Requests: simplify the internal message passing mechanism and speed up data processing.
```c
// Sending raw payload in Rust.
tauri::async_runtime::spawn(async {
  let payload = vec![1, 2, 3, 4, 5];
  tauri::api::ipc::Broadcast::emit('event_name', payload).await.unwrap();
});
```

### Multi-channel distribution support.

Tauri 2.0 provides official guidance and support for multi-channel application distribution, including:

- Multi-platform builds
- Self-hosted distribution
- Package managers integration
- App stores submission
- Web deployment

This multi-channel distribution support allows developers to easily release their applications to major platforms and expand their user coverage.

### Migration tool

If you are migrating from version 1.x, you can consult the migration guide. Tauri 2.0 CLI also provides a migrate command to automate most of the migration process:

```c
npm install @tauri-apps/cli@next
npm run tauri migrate
```

> [https://v2.tauri.app/migration/](https://v2.tauri.app/migration/)

Finally

Tauri 2.0 brings new cross-platform support, enhanced developer experience, more powerful plugin system, and more secure permission management, and further improves internal communication efficiency. With these improvements, Tauri 2.0 becomes a more flexible and efficient cross-platform application development framework. Whether you are a desktop application developer or a mobile application developer, Tauri 2.0 provides you with a powerful tool to build high-performance cross-platform applications.

For more information and detailed update logs, please visit the official Tauri blog.

> [https://v2.tauri.app/blog/tauri-20/](https://v2.tauri.app/blog/tauri-20/)

(End)