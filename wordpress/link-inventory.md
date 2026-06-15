# Link inventory — WordPress baseline vs OneDrive sync folder

Baseline date: **2026-06-15**

Applies to **both** English and French WordPress pages unless noted. PDF Dropbox URLs are shared across languages; link labels and surrounding prose differ.

## Bilingual page differences

| Item | English (`physics-page.baseline.en.html`) | French (`physics-page.baseline.fr.html`) |
|------|---------------------------------------------|------------------------------------------|
| SN3 equation sheet | Listed in Equations tab | **Not listed** — add when updating FR page or rely on GitHub Pages |
| Courses external link | Program Planner URL | JAC French homepage |
| Department PDFs | Same Dropbox URLs | Same Dropbox URLs |

---

Legend:

- **Synced** — file exists in the OneDrive publish folder and will appear on GitHub Pages after `npm run build`
- **WordPress only** — linked on WordPress but not in the sync folder (still needs Dropbox, WordPress-only link, or copy into sync folder)
- **External** — not a department PDF; stays as a normal URL in WordPress

Sync folder root:

```text
Website Files - Auto Synced To PUBLIC Website/
├── Textbook/
├── Equations/
├── Problem Set Solutions/
├── Sample Final Exams/
├── Links/
└── Draft/   (never published)
```

---

## Textbook tab

| Link label | Dropbox filename | Sync folder path | Status |
|------------|------------------|------------------|--------|
| Physics SN1 textbook | `Physics-Mechanics-203-SN1.pdf` | `Textbook/SN1/Physics-Mechanics-203-SN1.pdf` | Synced |
| Physics SN3 textbook | `OpenStax-Waves-203-SN3.pdf` | `Textbook/SN3/OpenStax-Waves-203-SN3.pdf` | Synced |
| Physics NYB textbook | `JAC_NYB_textbook.pdf` | `Textbook/NYB/Physics-NYB-OpenStax-University-Physics-Vol-2-Ch-5-13.pdf` | Synced (renamed in sync folder) |
| Physics NYC textbook | `Physics-NYC-OpenStax-University-Physics-Vol-1-Ch-15-17-and-Vol-3-Ch-3-7.pdf` | `Textbook/NYC/Physics-NYC-OpenStax-University-Physics-Vol-1-Ch-15-17-and-Vol-3-Ch-3-7.pdf` | Synced |
| OpenStax Volume 1/2/3 | — | — | External (openstax.org) |
| OpenStax donate | — | — | External |

---

## Equations tab

| Link label | Dropbox filename | Sync folder path | Status |
|------------|------------------|------------------|--------|
| Physics SN1 Equation Sheet | `SN1_equation_sheet-Fall-2024.pdf` | `Equations/SN1_equation_sheet Fall 2024.pdf` | Synced (spacing in filename) |
| Physics SN2 Equation Sheet | `F25_SN2_EquationSheet.pdf` | `Equations/F25_SN2_EquationSheet.pdf` | Synced |
| Physics SN3 Equation Sheet | `SN3-Equation-Sheet-wPT.pdf` | `Equations/SN3-Equation-Sheet-wPT.pdf` | Synced (EN page only — missing on FR page) |
| Physics NYB Equation Sheet | `NYB Equation Sheet and Data Sheet.pdf` | `Equations/NYB Equation Sheet and Data Sheet.pdf` | Synced |
| Physics NYC Equation Sheet | `NYC-Equation-Sheet-2022-05-28.pdf` | `Equations/NYC-Equation-Sheet-2022-05-28.pdf` | Synced |
| Physique SF2 Feuille d'équations | `F25_SF2_FeuilleEquations.pdf` | `Equations/F25_SF2_FeuilleEquations.pdf` | Synced |

---

## Solutions tab

### SN1 — all synced

| Link label | Sync folder path |
|------------|------------------|
| SN1 Problem Set 1–7 Solutions | `Solutions/SN1/SN1_ps_N_Solutions.pdf` |

### SN2 — all synced

| Link label | Sync folder path |
|------------|------------------|
| SN2 Problem Set 1–6 Solutions | `Solutions/SN2/SN2_ps_sol_N.pdf` |

### SN3 — partial sync

| Link label | Dropbox filename | Sync folder path | Status |
|------------|------------------|------------------|--------|
| SN3 Problem Set 1 | `sn3_ps_sol_1.pdf` | `Solutions/SN3/sn3_ps_sol_1.pdf` | Synced |
| SN3 Problem Set 2 | `sn3_ps_sol_2.pdf` | — | **WordPress only** |
| SN3 Problem Set 3 | `sn3_ps_sol_3.pdf` | `Solutions/SN3/sn3_ps_sol_3.pdf` | Synced |
| SN3 Problem Set 4 | `sn3_ps_sol_4.pdf` | `Solutions/SN3/sn3_ps_sol_4.pdf` | Synced |
| SN3 Problem Set 5 | `sn3_ps_sol_5.pdf` | — | **WordPress only** |
| SN3 Problem Set 6 | `sn3_ps_sol_6.pdf` | — | **WordPress only** |
| SN3 Problem Set 7 | `sn3_ps_sol_7.pdf` | `Solutions/SN3/sn3_ps_sol_7.pdf` | Synced |
| Answers to Supplementary SN3 Problems | `SN3_SuppProblems_Answers.pdf` | `Solutions/SN3/SN3_SuppProblems_Answers.pdf` | Synced |

### NYB — partial sync

| Link label | Sync folder path | Status |
|------------|------------------|--------|
| NYB Problem Set 1–6 Solutions | `Solutions/NYB/nyb_ps_sol_N.pdf` | Synced |
| Supplementary Problems 1–3 | `Solutions/NYB/Supp1.pdf`, `Supp2.pdf`, `Supp3.pdf` | Synced |
| Additional NYB Problems Unit 1 | `Unit1_NYBproblems.pdf` | **WordPress only** |
| Additional NYB Problems Unit 2 | `Unit2_NYBproblems.pdf` | **WordPress only** |
| Additional NYB Problems Unit 3 | `Unit3_NYBproblems.pdf` | **WordPress only** |

### NYC — all synced

| Link label | Sync folder path |
|------------|------------------|
| NYC Problem Set 1–7 Solutions | `Solutions/NYC/nyc_ps_sol_N.pdf` |
| Answers to Supplementary NYC Problems | `Solutions/NYC/NYC_SuppProblems_Answers.pdf` |

---

## Exams tab — all synced

| Link label | Sync folder path |
|------------|------------------|
| Physics SN1 Exam / Answers | `Exams/Physics_SN1_sample_final_exam.pdf`, `…_answers.pdf` |
| Physics SN3 Exam / Answers | `Exams/Physics_SN3_sample_final_exam.pdf`, `…_answers.pdf` |
| Physics NYB Exam / Answers | `Exams/Physics_NYB_sample_final_exam.pdf`, `…_answers.pdf` |
| Physics NYC Exam / Answers | `Exams/Physics_NYC_sample_final_exam.pdf`, `…_answers.pdf` |

---

## Links tab

### John Abbott section

| Link label | Type | Status |
|------------|------|--------|
| John Abbott College website | External URL | Stays in WordPress |
| Rules and Guidelines for Physics Labs | External URL | Stays in WordPress |
| Science Program information | External URL | Stays in WordPress |
| Science Program Style Guide | `style_for_web.pdf` (Dropbox) | **WordPress only** — sync folder has `Links/ScienceProgramStyleGuide ForLabReports.pdf` (likely same document, different name; confirm before removing Dropbox link) |
| Physics Department Lab Skills and Requirements | `Lab_Skills.pdf` | **WordPress only** |
| My JAC Portal (Lea) | External URL | Stays in WordPress |
| Moodle | External URL | Stays in WordPress |
| Moodle student setup guide | `Moodle.Students.GettingStarted.pdf` | **WordPress only** |
| Lon-Capa | External URL | Stays in WordPress |
| Lon-Capa student setup guide | `LON-CAPA_studenthelp.pdf` | Synced → `Links/LON-CAPA_studenthelp.pdf` |
| Supplemental lab period information | `2023-08-21-Physics-Supplementary-Lab-Period.pdf` | **WordPress only** |
| Tutoring information | `2023-08-21-Physics-Tutoring.pdf` | **WordPress only** |
| Lab Safety Training | External URL (duplicate of lab rules) | Stays in WordPress |

### Physics and Science / Quebec Universities

All entries are external URLs — **stay in WordPress** regardless of GitHub Pages migration.

---

## Summary counts (2026-06-15)

| Category | In sync folder | WordPress-only PDFs |
|----------|----------------|---------------------|
| Textbook | 4 | 0 |
| Equations | 6 | 0 |
| Solutions | 38 | 6 (SN3 ps 2/5/6, NYB additional units 1–3) |
| Exams | 8 | 0 |
| Links (department PDFs) | 2 | 5 (+ 1 possible duplicate style guide) |
| **Total department PDFs** | **55** | **~11** |

---

## Action items before retiring Dropbox links

1. Copy missing SN3 solution PDFs into `Solutions/SN3/` if they should be public.
2. Decide fate of **Additional NYB Problems** (Units 1–3) — add to sync folder or keep WordPress-only.
3. Copy or reconcile Links-tab PDFs: Lab Skills, Moodle guide, supplemental lab / tutoring notices, style guide naming.
4. Run `npm run dry-run` after any sync-folder changes to verify nothing is blocked by the safety filter.
