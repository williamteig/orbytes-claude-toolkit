# orbytes-claude-toolkit

The standard Claude Code toolkit for all orbytes.io projects. Install once, update centrally, available everywhere. **Cursor** is supported as a parallel install target; the repo also commits a **`.cursor/`** tree for in-repo and Cloud Agent use.

## Install

### Claude Code (default)

```bash
cd ~/path/to/orbytes-claude-toolkit
chmod +x install.sh
./install.sh
```

Equivalent to `./install.sh --target claude`. Symlinks into **`~/.claude/`** only.

### Cursor

```bash
./install.sh --target cursor
```

Symlinks commands, rules (as `.mdc`), and skills into **`~/.cursor/`**. Use this if you use Cursor and want user-wide parity with the toolkit sources.

### Both harnesses

```bash
./install.sh --target all
```

Configures **`~/.claude/`** and **`~/.cursor/`**.

Everything installed by these scripts is **symlinked**, not copied. The toolkit stays in one place on your machine.

**Note:** The repository already contains **`.cursor/rules`**, **`.cursor/commands`**, **`.cursor/skills`** (symlinks into `global/`) plus **`AGENTS.md`** so Cursor Cloud Agents and clone-local work pick up rules and commands **from the repo** without relying only on home-directory symlinks. Copy **`.cursor/mcp.json.example`** to **`.cursor/mcp.json`** when you add MCP servers (see [Cursor MCP docs](https://cursor.com/docs)).

## Update

```bash
cd ~/path/to/orbytes-claude-toolkit
git pull
```

That’s it. All symlinked commands, rules, skills, agents, and hooks update across projects because they point back to this repo.

### Hooks (Claude Code)

`./install.sh` symlinks **`global/hooks/*.sh`** and **`*.py`** into **`~/.claude/hooks/`** (e.g. git safety + end-of-turn checklist). You still need to **register** those scripts in **Claude Code settings**—see **`global/hooks/README.md`** and **`global/hooks/settings.json.example`**. For sharing hook logic with Cursor, see **Future / optional** below.

## Uninstall

```bash
./uninstall.sh              # default: claude only
./uninstall.sh --target cursor
./uninstall.sh --target all
```

Removes toolkit symlinks for the chosen target(s) and restores any backed-up files.

## What's included

### Commands

`/task` uses the argument to decide what to do: a number fetches and executes an existing task; any other text creates a new one.

| Command | What it does |
|---------|-------------|
| `/task 13` | Reads task #13 from the Dev Pipeline, executes it, writes findings back to Notion, updates status |
| `/task Fix the mobile nav` | Creates a new task in the Dev Pipeline with interactive prompts for project, type, priority |
| `/new-orbytes-website` | Interactive onboarding → scaffolds an Astro + Tailwind project with orbytes defaults |
| `/new-orbytes-app` | Interactive onboarding → scaffolds a custom app project (Next.js, SvelteKit, etc.) |

### Global layer (applies to all projects)

- **CLAUDE.md** — orbytes identity, dev pipeline stages, approval gates, coding standards, git workflow
- **orbytes-context-sync** skill — keeps Notion, Figma, and Webflow in sync across client projects
- **orbytes-workflow-sync** skill — ensures the Notion Project Template and workflow docs stay matched

### Website layer (Astro + Tailwind)

- Website-specific CLAUDE.md rules (Astro conventions, Tailwind standards, SEO, performance targets)
- Starter templates: `package.json`, `astro.config.mjs`, `tsconfig.json`, `BaseLayout.astro`, `index.astro`

### App layer (Custom Builds)

- App-specific CLAUDE.md rules (architecture principles, security defaults, testing requirements)
- Flexible — stack is chosen during `/new-orbytes-app` onboarding

## How it works

**Claude Code** (`./install.sh` or `--target claude`):

```
~/.claude/
├── CLAUDE.md                      → symlink → toolkit/global/CLAUDE.md
├── commands/                      → symlinks → toolkit/global/commands/*.md
├── rules/                         → symlinks → toolkit/global/rules/*.md
├── skills/                        → symlinks → toolkit/global/skills/*/
├── agents/                        → symlinks → toolkit/global/agents/*.md
└── hooks/                         → symlinks → toolkit/global/hooks/*.{sh,py}
```

**Cursor** (`--target cursor` or `all`):

```
~/.cursor/
├── commands/                      → symlinks → toolkit/global/commands/*.md
├── rules/                         → symlinks → toolkit/global/rules/*.md (installed as *.mdc)
└── skills/                        → symlinks → toolkit/global/skills/*/
```

The **global layer** applies to every session once symlinked. When you scaffold with `/new-orbytes-website` or `/new-orbytes-app`, the **website** or **app** layer is **copied** into that project.

## Per-project overrides

After scaffolding, each project has its own `CLAUDE.md` in the project root. It sits alongside global instructions — project-level rules take priority where they overlap.

## Structure

```
orbytes-claude-toolkit/
├── AGENTS.md                  # When to spawn each agent (see global/agents/)
├── install.sh
├── uninstall.sh
├── README.md
├── global/                    # Shared across ALL projects (source of truth)
│   ├── CLAUDE.md
│   ├── agents/
│   ├── commands/              # /task, /new-orbytes-website, /new-orbytes-app
│   ├── rules/
│   ├── hooks/               # Hooks symlinked to ~/.claude/hooks/
│   └── skills/
│       ├── orbytes-context-sync/
│       ├── orbytes-workflow-sync/
│       └── task-done/
├── .cursor/                   # Symlinks into global/ for repo-pinned Cursor + Cloud Agents
│   ├── commands/
│   ├── rules/                 # *.mdc → ../global/rules/*.md
│   ├── skills/
│   └── mcp.json.example
├── website/
│   ├── CLAUDE.md
│   └── templates/
└── app/
    └── CLAUDE.md
```

## Future / optional

- **Cursor hook parity** — The [everything-claude-code](https://github.com/affaan-m/everything-claude-code) project documents a Cursor hook adapter if you want the same scripts wired to both environments beyond the Claude Code `~/.claude/hooks/` symlinks.
