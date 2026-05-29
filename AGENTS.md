# Agent Workspace Context: id_skills 🤖

This document provides context, architecture details, and operational rules for AI agents and LLMs working in the `id_skills` codebase.

---

## 🏗️ Repository Architecture

The project consists of a single repository containing a local dashboard to manage and run AI agent skills.

```
id_skills/
├── skill-dashboard/          # Core Dashboard Workspace
│   ├── frontend/             # Vite + React Frontend
│   │   ├── src/
│   │   │   ├── App.tsx       # Main workspace dashboard layout
│   │   │   ├── api.ts        # Client API definitions
│   │   │   ├── style.css     # Tailwind CSS v4 variables and custom styles
│   │   │   └── components/   # Modals, Cards, and Headers
│   │   └── package.json
│   ├── backend/              # Node.js Express Backend
│   │   ├── src/
│   │   │   ├── api.js        # REST endpoints and Agent execution controller
│   │   │   ├── server.js     # Server bootstrap and SSE connection hub
│   │   │   ├── config.js     # Path configuration for skills and agents
│   │   │   ├── agent-scanner.js # Local agent detector
│   │   │   └── skills-sh-scanner.js # Offline/online skill installer & resolver
│   │   └── package.json
│   ├── .agents/              # Locally loaded agents list
│   └── start.ps1             # PowerShell script to run both dev servers
└── README.md                 # User-facing project guide
```

---

## 🔌 API Endpoints Reference

### 1. Agent Execution Stream
*   **Path**: `POST /api/agents/:name/run`
*   **Body**: `{ prompt: string }`
*   **Output**: Server-Sent Events (SSE) stream (`text/event-stream`).
*   **Implementation Note**: Streams chunks formatted as `data: {"chunk": "..."}` or `data: {"done": true}`. The backend uses the native `opencode` CLI or standard execution binaries.

### 2. Skill Installer
*   **Path**: `POST /api/skills-sh/install`
*   **Body**: `{ source: string, slug: string }`
*   **Flow**:
    1. Prefer CLI-based installation: Runs `npx -y skills add <source> --skill <slug> --yes`.
    2. Fallback to GitHub Tree Resolution: Queries the GitHub Git Trees API to find the exact relative path of the `SKILL.md` file if folder names do not match the skill slug, downloading it directly to the local skills directory.

---

## 🎨 Visual Design Tokens (brandkit Guide)

The workspace frontend uses **Tailwind CSS v4** with a custom obsidian dark theme. When modifying elements, strictly use the following variables:

### 1. Colors
*   `--color-surface-975` (`#05070b`): Canvas background.
*   `--color-surface-950` (`#080c14`): Main container background.
*   `--color-surface-900` (`#0d1321`): Cards and dropdown panels.
*   `--color-surface-800` (`#1e293b`): Element borders (use low opacity: e.g., `border-surface-800/60`).
*   `--color-brand-600` (`#7c3aed`): Violet brand accent color.
*   `--color-brand-500` (`#8b5cf6`): Focus glow/active indicator.

### 2. Micro-interactions
*   Transitions: Use `transition-all duration-200` on hovers.
*   Borders: Avoid thick borders. Prefer `border border-surface-700/50` or `border border-white/5`.

---

## ⚙️ Development Guidelines

### Local Path Setup
*   Skills download directory: `C:\Users\EaTsAngels\Documents\curso-opencode\.opencode\skills`
*   Workspace workspace root: `C:\ID_Skills`

### Language Preference Sync
Modals share a global reading language selection via `localStorage` key `"agent-modal-lang"`. When adding modal components, always synchronize state with this key:
```typescript
const [lang, setLang] = useState<"en" | "es">(() => {
  const saved = localStorage.getItem("agent-modal-lang");
  return (saved === "en" || saved === "es") ? saved : "es";
});
```

---

## ⚠️ Common Gotchas for Agents

1.  **Windows Process Spawning**:
    *   On Windows, commands spawned via Node.js `child_process.spawn` must be handled carefully. Always resolve the exact path of the executables (e.g. `opencode.exe` or `powershell.exe`) and configure the `shell` option appropriately.
2.  **SSE Connections**:
    *   Do not close the SSE response stream on `req.on('close')` immediately if the child process is still booting. Use `res.on('close')` to clean up active children to prevent premature process termination.
