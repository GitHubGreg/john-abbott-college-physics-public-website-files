# Physics Department Public File Publisher

Local Mac-based publishing system for John Abbott College Physics Department website files.

The department maintains documents in a Microsoft OneDrive / SharePoint synced folder. This project scans that folder, generates a static file index, and publishes the files to GitHub Pages. The existing WordPress Physics page only needs a single link to the GitHub Pages URL.

## Architecture

```text
Local OneDrive-synced folder on Mac
        ↓
Node/TypeScript publishing script
        ↓
Static site generated into ./docs
        ↓
GitHub repository
        ↓
GitHub Pages public URL
        ↓
Existing WordPress Physics page links to the file index
```

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
├── Solutions/
│   ├── SN1/
│   ├── SN2/
│   ├── SN3/
│   ├── NYB/
│   └── NYC/
├── Exams/
├── Links/
└── Draft/          ← never published
```

| Folder | WordPress tab |
|--------|---------------|
| `Textbook/` | Textbook |
| `Equations/` | Equations |
| `Solutions/` | Solutions |
| `Exams/` | Exams |
| `Links/` | Links (department PDFs) |

Use course subfolders (`SN1`, `SN2`, etc.) inside `Textbook/` and `Solutions/` where helpful.

## Install

```bash
cd ~/Dev/john-abbott-college-physics-public-website-files
npm install
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dry-run` | Scan and list what would be published without writing files |
| `npm run build` | Generate the static site in `docs/` |
| `npm run serve` | Preview the site locally at http://localhost:8080 |
| `npm run watch` | Watch the source folder and rebuild automatically |
| `npm run publish` | Build, commit `docs/`, and push to GitHub |

Always run `npm run dry-run` before the first real publish.

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
https://githubgreg.github.io/john-abbott-college-physics-public-website-files/
```

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
- Public GitHub Pages URL

## Project structure

```text
├── src/
│   ├── config.ts
│   ├── publish.ts
│   ├── build-index-html.ts
│   ├── scan-source.ts
│   ├── slug.ts
│   └── types.ts
├── wordpress/
│   ├── physics-page.baseline.en.html
│   ├── physics-page.baseline.fr.html
│   ├── link-inventory.md
│   ├── shared-files-tab.snippet.en.html
│   ├── shared-files-tab.snippet.fr.html
│   └── README.md
├── public-template/
│   └── styles.css
├── docs/
│   ├── index.html
│   ├── manifest.json
│   ├── styles.css
│   └── files/
└── scripts/
    └── publish.sh
```
