# WordPress Physics page — baseline documentation

This folder version-controls the **current live content** of the John Abbott College Physics department WordPress pages (English and French), before migrating file downloads to GitHub Pages.

Captured: **2026-06-15**

## Bilingual site

The department page exists in **two WordPress versions** (typically separate pages or Polylang/WPML translations). File PDFs are the same on both; prose, tab titles, and some external links differ.

| Language | Baseline file | Shared Files tab snippet |
|----------|---------------|--------------------------|
| English | `physics-page.baseline.en.html` | `shared-files-tab.snippet.en.html` |
| French | `physics-page.baseline.fr.html` | `shared-files-tab.snippet.fr.html` |

When editing WordPress, update **both** language versions unless the change is language-specific (e.g. prose only).

The GitHub Pages file index (`docs/`) is **English only** for now. Both WordPress versions can link to the same URL; consider a French intro on the FR page pointing to that index.

## Files

| File | Purpose |
|------|---------|
| `physics-page.baseline.en.html` | English page content (baseline before migration) |
| `physics-page.baseline.fr.html` | French page content (baseline before migration) |
| `shared-files-tab.snippet.en.html` | Planned English tab linking to GitHub Pages |
| `shared-files-tab.snippet.fr.html` | Planned French tab linking to GitHub Pages |
| `link-inventory.md` | Dropbox → OneDrive sync folder mapping and gaps |

When you change the live WordPress page, update the tracked copy here (or add a dated snapshot) so future edits can be diffed.

## WordPress setup

- **Wrapper:** `<div class="tab2">` … `</div>`
- **Tabs plugin:** Tabby Tabs — `[tabby title="…" icon="…"]` … `[tabbyending]`
- **Staff list:** `[simple-staff-list group="physics"]` on the Department / Département tab
- **List styling:** many lists use `class="list-lien"`

## Tab inventory (baseline)

| EN tab | FR tab | Icon | Content type | Migration notes |
|--------|--------|------|--------------|-----------------|
| Welcome | Accueil | scroll | Static prose + JAC link | Stays in WordPress |
| Department | Département | user-tie | Staff list shortcode | Stays in WordPress |
| Courses | Cours | graduation-cap | Static prose + JAC / Program Planner link | Stays in WordPress |
| Textbook | Manuels | book-open | Intro + OpenStax links + 4 textbook PDFs | PDF links → GitHub Pages |
| Equations | Équations | square-root-alt | Intro + equation sheet PDFs | PDF links → GitHub Pages; see EN/FR diff below |
| Solutions | Solutions | calculator | Problem set / supplementary PDFs | PDF links → GitHub Pages |
| Exams | Examens | book | Sample final exam PDFs | PDF links → GitHub Pages |
| Links | Liens | link | External URLs + department PDFs | Mixed |

**Planned addition:** **Shared Files** / **Fichiers partagés** tab (see snippet files) pointing to GitHub Pages. After migration, file tabs can be simplified on both language versions.

## EN vs FR differences (baseline)

Same Dropbox PDF targets on both versions, except:

| Item | English | French |
|------|---------|--------|
| Équations / Equations tab | 6 sheets (includes SN3) | **5 sheets — SN3 equation sheet missing** |
| Courses tab link | Program Planner (Science 200) | General JAC French homepage |
| JAC links | `johnabbott.qc.ca/` (EN paths) | `johnabbott.qc.ca/fr/` |
| PDF link labels | Mostly English | Mix of French headings, English link text on many PDFs |
| Links footnote | `<p>` after list | `<h5>` nested inside last `<li>` (markup quirk) |
| Physique et Science links | Plain links | Wrapped in `<em>` |

When migrating, fix the missing SN3 equation sheet on the French page (or rely on GitHub Pages index which includes it).

## Relationship to this repo

```text
WordPress EN + FR (department pages)     GitHub Pages (this repo)
────────────────────────────────         ─────────────────────────
Welcome / Accueil, Department, Courses   (unchanged in WordPress)
Textbook … Links / Manuels … Liens       Auto-published from OneDrive sync folder
                                         https://githubgreg.github.io/john-abbott-college-physics-public-website-files/
```

Department staff add/update files in the OneDrive folder documented in the root `README.md`. Running `npm run build` (or `npm run publish`) updates `docs/` and deploys via GitHub Pages.

## Planned WordPress change

After the first successful GitHub Pages build:

1. Add **Shared Files** tab to the English page (`shared-files-tab.snippet.en.html`)
2. Add **Fichiers partagés** tab to the French page (`shared-files-tab.snippet.fr.html`)
3. Optionally replace long Dropbox lists with short prose pointing to the shared index

The build script also prints the English snippet:

```bash
npm run build
```

## Editing workflow

1. Propose changes using the appropriate `.en.html` / `.fr.html` baseline as source of truth in git.
2. Apply the same edits in both WordPress language versions (where applicable).
3. Commit updates to this folder so the repo reflects what is live.

For file-only updates (new PDF, revised equation sheet), staff can usually **only** update the OneDrive sync folder and run `npm run build` — no WordPress edit required once migration is complete.
