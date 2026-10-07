# 🐰 (ELECTRON COMMAND EXECUTER) aka -  Namma War Builder

> A simple Windows desktop utility for running multiple commands sequentially inside a selected project directory.

Namma War Builder is an Electron-based Windows application that lets you select a project folder, enter multiple commands, and execute them one after another while displaying the command output in real time.

Built with **Electron + TypeScript + Vite**.

---

## ✨ Features

- 📁 Select a project directory using the native Windows folder picker
- ⚡ Run multiple commands sequentially
- 🖥️ Execute commands inside the selected directory
- 📡 Display command output in real time
- 🟢 Show execution status
- 🔴 Detect command failures
- ⛔ Stop execution when a command fails
- 🔄 Reset the current session
- 🪟 Windows desktop application
- 📦 Buildable as a Windows `.exe`
- 🐰 Fun developer-themed UI

---

## 🖥️ How It Works

```text
┌─────────────────────────────┐
│      Namma War Builder      │
├─────────────────────────────┤
│                             │
│ Commands                    │
│ ┌─────────────────────────┐ │
│ │ npm install             │ │
│ │ npm run build           │ │
│ │ npm run test            │ │
│ └─────────────────────────┘ │
│                             │
│ Project Directory           │
│ ┌─────────────────────────┐ │
│ │ G:\Projects\my-project  │ │
│ └─────────────────────────┘ │
│                             │
│          [ Start ]          │
│                             │
│          ● Running...       │
│                             │
│ Terminal Output             │
│ ┌─────────────────────────┐ │
│ │ > npm install           │ │
│ │                         │ │
│ │ added 245 packages      │ │
│ │                         │ │
│ │ > npm run build         │ │
│ │                         │ │
│ │ Build completed         │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
