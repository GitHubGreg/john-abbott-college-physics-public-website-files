# Physics Department Public File Publisher

Local Mac-based publishing system for John Abbott College Physics Department website files.

The department maintains documents in a Microsoft OneDrive / SharePoint synced folder. This project scans that folder, generates a static file index, and publishes the files to GitHub Pages. The existing WordPress Physics page only needs a single link to the GitHub Pages URL.

## Architecture

```text
OneDrive sync folder (source of truth)
        ↓
Publishing script (scan, copy, generate index)
        ↓
docs/ in this git repo
        ↓
GitHub (main branch, /docs folder)
        ↓
GitHub Pages public URL
        ↓
WordPress Physics page links to the file index
```

On your Mac, a **background daemon** can keep the last three steps automatic (see [Background auto-sync](#background-auto-sync-macos) below).

## Source folder

The source of truth is the OneDrive-synced folder:

```text
/Users/Greg/Library/CloudStorage/OneDrive-SharedLibraries-JohnAbbottCollege/Physics Dept - Documents/Website Files - Auto Synced To PUBLIC Website
```

**Everything in this folder is published to the public internet**, except:

- Files inside the top-level `Draft/` folder (ignored)
- Hidden, temporary, or unsupported files (skipped automatically)
- Files matching the safety blocklist (skipped with a warning)

Organize files to match the WordPress Physics page tabs:

```text
Website Files - Auto Synced To PUBLIC Website/
├── Textbook/
│   ├── SN1/
│   ├── SN3/
│   ├── NYB/
│   └── NYC/
├── Equations/
│   ├── SN1/
│   ├── SN2/
│   ├── SN3/
│   ├── NYB/
│   ├── NYC/
│   └── SF2/
├── Problem Set Solutions/
│   ├── SN1/
│   ├── SN2/
│   ├── SN3/
│   │   └── Supplementary/
│   ├── NYB/
│   │   └── Supplementary/
│   └── NYC/
│       └── Supplementary/
├── Sample Final Exams/
│   ├── SN1/
│   ├── SN3/
│   ├── NYB/
│   └── NYC/
├── Links/
└── Draft/          ← never published
```

| Folder | WordPress tab |
|--------|---------------|
| `Textbook/` | Textbook |
| `Equations/` | Equations |
| `Problem Set Solutions/` | Solutions |
| `Sample Final Exams/` | Exams |
| `Links/` | Links (department PDFs) |

Use course subfolders (`SN1`, `SN2`, `NYB`, etc.) inside each category. Put supplementary solution PDFs in a `Supplementary/` subfolder under the course.

## Install

```bash
cd ~/Dev/john-abbott-college-physics-public-website-files
npm install
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Build, preview at http://localhost:8080, and watch the source folder (no git push) |
| `npm run sync` | Foreground watch + rebuild + auto-push to GitHub (same logic as the daemon) |
| `npm run build` | One-time build of the static site into `docs/` |
| `npm run dry-run` | Scan and list what would be published without writing files |
| `npm run serve` | Preview an existing build at http://localhost:8080 |
| `npm run watch` | Watch the source folder and rebuild `docs/` only (no git push) |
| `npm run publish` | One-time build, commit `docs/`, and push to GitHub |
| `npm run daemon:install` | Install the macOS background auto-sync daemon (survives restart) |
| `npm run daemon:uninstall` | Stop and remove the background daemon |
| `npm run daemon:status` | Show daemon state and the last log lines |
| `npm run monitor` | Live-tail the activity log (`Ctrl+C` to stop) |

Always run `npm run dry-run` before the first real publish.

### Which command should I use?

| Goal | Command |
|------|---------|
| Preview layout locally while editing | `npm run dev` |
| One-off manual publish | `npm run publish` |
| Test auto-sync in a terminal window | `npm run sync` |
| **Production: always-on sync** | `npm run daemon:install` once, then `npm run monitor` to watch |

## Background auto-sync (macOS)

The background daemon watches the OneDrive folder and keeps the **live GitHub Pages site** up to date without manual `git push`. It is installed as a **launchd Launch Agent** and starts automatically when you log in (including after a Mac restart).

### Install (one time)

```bash
npm install          # if not already done
npm run daemon:install
```

This registers `com.johnabbott.physics-publisher` in `~/Library/LaunchAgents/` and starts it immediately.

### What the daemon does

On each cycle (initial run, then whenever files change):

1. **Watch** the OneDrive sync folder using [chokidar](https://github.com/paulmillr/chokidar) (3 second debounce so bulk saves trigger one rebuild)
2. **Scan** for publishable files; skip `Draft/`, hidden files, unsupported types, and safety-blocklisted names
3. **Build** — copy files into `docs/files/`, regenerate `docs/index.html` and `manifest.json`
4. **Publish** — if `docs/` changed, `git add docs/`, commit, and push to `origin/main`
5. **Log** every step with timestamps to `logs/publisher.log`

Implementation: `src/publish.ts --daemon`, with git operations in `src/git-publish.ts` and logging in `src/logger.ts`. The launchd wrapper is `scripts/run-publisher-daemon.sh`.

```text
OneDrive folder change
        ↓  (3s debounce)
tsx src/publish.ts --daemon
        ↓
docs/ rebuilt
        ↓  if docs/ changed
git commit + git push
        ↓
GitHub Pages redeploys (~1–2 min)
```

### Monitor activity

The daemon runs in the background (no window). Monitor it in a terminal:

```bash
npm run monitor
```

Or double-click **`scripts/monitor.command`** to open Terminal with a live log tail.

Quick status and last 20 log lines:

```bash
npm run daemon:status
```

Example log output (timestamps are **Eastern Time**, `EST` or `EDT` depending on daylight saving):

```text
[2026-06-15 08:55:29 EDT] Background sync daemon started.
[2026-06-15 08:55:29 EDT] Watching source folder: …/Website Files - Auto Synced To PUBLIC Website
[2026-06-15 08:55:29 EDT] Initial build.
[2026-06-15 08:55:30 EDT] Built local site: 55 files in docs/ (0 blocked, 3 ignored).
[2026-06-15 08:55:30 EDT] Committing docs/ changes and pushing to origin/main...
[2026-06-15 08:56:00 EDT] Published to GitHub Pages (origin/main).
[2026-06-15 09:01:02 EDT] Change detected in source folder — rebuilding.
[2026-06-15 09:01:05 EDT] No changes in docs/ — website already up to date.
```

### Log files

| File | Contents |
|------|----------|
| `logs/publisher.log` | Main activity log — builds, git push results, errors |
| `logs/launchd.out.log` | launchd stdout (includes git commit output) |
| `logs/launchd.err.log` | launchd stderr |

Log files are git-ignored. The `logs/` folder is kept in the repo via `logs/.gitkeep`.

### Stop or reinstall

```bash
npm run daemon:uninstall     # stop and remove Launch Agent
npm run daemon:install       # reinstall / restart after code changes to the daemon scripts
```

### Requirements and limits

- **Node.js** must be available to launchd (Homebrew or nvm both work; the wrapper script extends `PATH` and loads nvm if present).
- **Git push must work non-interactively** — SSH key or HTTPS credential helper already configured. Test with `git push` from a normal terminal before relying on the daemon.
- **You must be logged in** — launchd runs under your user session. Sleep is fine; the Mac must boot and you must log in for the daemon to run.
- **`npm run dev` does not push** — it is for local preview only. The daemon and `npm run sync` handle auto-push.

### Troubleshooting

| Problem | What to check |
|---------|----------------|
| Daemon not running | `npm run daemon:status` — reinstall with `npm run daemon:install` |
| `GitHub publish failed` in log | Run `git push` manually; fix SSH/credentials |
| `Source folder not found` | OneDrive not synced yet; check path in `src/config.ts` |
| Changes not appearing on live site | Wait 1–2 min for GitHub Pages; check log for successful push |
| `node not found` in log | Install Node via Homebrew or ensure nvm default is set |

For local preview while editing layout, use `npm run dev` — it serves http://localhost:8080 and does **not** auto-push.

## GitHub Pages setup

1. Use the public repository: `john-abbott-college-physics-public-website-files`
2. In the repo settings, configure GitHub Pages:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/docs**
3. Update `publicSiteUrl` in `src/config.ts` if your username or repo name differs
4. Run:

```bash
npm run build
git add docs
git commit -m "Update public files"
git push
```

The public URL is:

```text
https://department-files.ephysics.ca/
```

(GitHub Pages default URL before custom domain: `https://githubgreg.github.io/john-abbott-college-physics-public-website-files/`)

### Custom domain (`department-files.ephysics.ca`)

GitHub Pages supports a custom subdomain. This repo is configured for **`department-files.ephysics.ca`** in `src/config.ts` (`customDomain` and `publicSiteUrl`). Each build writes `docs/CNAME` so the domain is not lost when files are republished.

**1. DNS** — at whoever hosts DNS for `ephysics.ca`, add:

| Type | Name / Host | Value |
|------|-------------|--------|
| `CNAME` | `department-files` | `githubgreg.github.io` |

Do **not** include the repository name in the CNAME target — only `githubgreg.github.io`. See [GitHub’s custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

**2. GitHub** — in the repo **Settings → Pages → Custom domain**, enter:

```text
department-files.ephysics.ca
```

Save, wait for the DNS check to pass (minutes to a few hours), then enable **Enforce HTTPS**.

**3. Publish** — run a build so `docs/CNAME` is on `main` (the background daemon does this automatically when `docs/` changes):

```bash
npm run build
# or let the daemon commit and push
```

**4. WordPress** — after the custom domain works, update the Shared Files tab link to `https://department-files.ephysics.ca/`.

Until DNS is live, the old `github.io` URL continues to work.

## WordPress page (version controlled)

The live Physics department WordPress pages (English and French) are tracked in `wordpress/`:

- `wordpress/physics-page.baseline.en.html` — English page as of 2026-06-15
- `wordpress/physics-page.baseline.fr.html` — French page as of 2026-06-15
- `wordpress/link-inventory.md` — Dropbox vs OneDrive sync folder mapping and gaps
- `wordpress/shared-files-tab.snippet.en.html` / `.fr.html` — planned Shared Files tabs

See `wordpress/README.md` for tab structure, bilingual notes, migration plan, and editing workflow.

## WordPress snippet

After a successful build, the script prints a snippet for the Physics page. Paste it into the existing `[tabby ...]` section:

```html
[tabby title="Shared Files" icon="folder-open"]

<p>
Department documents, sample final exams, equation sheets, textbook resources,
and other shared Physics files are available here:
</p>

<p>
<a href="https://githubgreg.github.io/john-abbott-college-physics-public-website-files/" target="_blank" rel="noopener noreferrer">
Open Physics Department shared files
</a>
</p>
```

## Safety notes

**Files placed in `Website Files - Auto Synced To PUBLIC Website/` will be published to the public internet.**

- The folder name is intentional — treat it as a public drop zone
- Use `Draft/` for anything that must not be published
- Unsupported, hidden, and temporary files are skipped automatically
- A configurable blocklist catches filenames containing sensitive terms such as `confidential`, `private`, or `answer key`
- The blocklist is a safeguard only — careful folder organization is still required
- Run `npm run dry-run` and review the output before publishing

## Configuration

Edit `src/config.ts` to change:

- Source folder path
- Ignored top-level folders (e.g. `Draft`)
- Allowed file extensions
- Safety blocklist terms
- Site title and intro text
- Public GitHub Pages URL (`publicSiteUrl`)
- Custom domain for GitHub Pages (`customDomain`, writes `docs/CNAME`)
- Link back to the department WordPress site (`departmentSiteUrl`)

## Project structure

```text
├── src/
│   ├── config.ts           # paths, categories, blocklist, URLs
│   ├── publish.ts          # build, watch, dev, and daemon entry point
│   ├── git-publish.ts      # auto-commit and push docs/
│   ├── logger.ts           # timestamped log file for the daemon
│   ├── build-index-html.ts # generates docs/index.html
│   ├── scan-source.ts      # scans OneDrive folder
│   ├── subsections.ts      # course subheadings on the public index
│   ├── slug.ts
│   └── types.ts
├── scripts/
│   ├── run-publisher-daemon.sh  # launchd entry point
│   ├── install-daemon.sh        # npm run daemon:install
│   ├── uninstall-daemon.sh
│   ├── daemon-status.sh
│   ├── monitor.sh               # npm run monitor
│   ├── monitor.command          # double-click to open log in Terminal
│   └── publish.sh               # legacy wrapper for npm run publish
├── logs/                   # daemon activity logs (git-ignored)
├── wordpress/              # version-controlled WordPress page baselines
├── public-template/
│   └── styles.css
├── docs/                   # generated site (published to GitHub Pages)
│   ├── index.html
│   ├── manifest.json
│   ├── styles.css
│   └── files/
└── package.json
```
