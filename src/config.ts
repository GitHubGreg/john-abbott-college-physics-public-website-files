export const config = {
  sourceRoot:
    "/Users/Greg/Library/CloudStorage/OneDrive-SharedLibraries-JohnAbbottCollege/Physics Dept - Documents/Website Files - Auto Synced To PUBLIC Website",
  outputRoot: "docs",
  filesOutputSubfolder: "files",
  siteTitle: "Physics Department Shared Files",
  siteIntro:
    "This page provides publicly shared Physics Department documents for John Abbott College students.",
  publicSiteUrl:
    "https://githubgreg.github.io/john-abbott-college-physics-public-website-files/",
  /** Top-level source subfolders that are never published (e.g. drafts). */
  ignoredTopLevelFolders: ["Draft"],
  /** Category display order on the public index (matches WordPress tabs). */
  categoryOrder: ["Textbook", "Equations", "Solutions", "Exams", "Links"],
  allowedExtensions: [
    ".pdf",
    ".docx",
    ".pptx",
    ".xlsx",
    ".csv",
    ".txt",
    ".zip",
  ],
  blockedTerms: [
    "answer key",
    "answer-key",
    "solutions-private",
    "private",
    "grades",
    "student",
    "students",
    "accommodations",
    "exam answers",
    "marked",
    "confidential",
    "internal",
    "do not publish",
  ],
} as const;

export type Config = typeof config;
