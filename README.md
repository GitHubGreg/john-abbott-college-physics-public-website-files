# Physics Department Public File Publisher

Local Mac-based publishing system for John Abbott College Physics Department website files.

The department maintains documents in a Microsoft OneDrive / SharePoint synced folder. This project scans the local `Public/` subfolder, generates a static file index, and publishes the files to GitHub Pages. The existing WordPress Physics page only needs a single link to the GitHub Pages URL.

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
/Users/Greg/Library/CloudStorage/OneDrive-SharedLibraries-JohnAbbottCollege/Physics Dept - Documents/Website Files/Public
```

Only files inside `Public/` are published. Everything else — including `Draft/` or other sibling folders — is ignored.

Organize files like this:

```text
Website Files/
├── Public/
│   ├── Problem Set Solutions/
│   ├── Sample Finals/
│   ├── Equation Sheets/
│   ├── Lab Documents/
│   └── Course Outlines/
└── Draft/
```

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

1. Create or use the public repository: `john-abbott-college-physics-public-website-files`
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

The public URL will be:

```text
https://githubgreg.github.io/john-abbott-college-physics-public-website-files/
```

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

**Files placed in `Website Files/Public/` will be published to the public internet.**

- Only the `Public/` subfolder is ever scanned
- Unsupported, hidden, and temporary files are skipped automatically
- A configurable blocklist catches filenames containing sensitive terms such as `confidential`, `private`, or `answer key`
- The blocklist is a safeguard only — careful folder organization is still required
- Run `npm run dry-run` and review the output before publishing

## Configuration

Edit `src/config.ts` to change:

- Source folder path
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
