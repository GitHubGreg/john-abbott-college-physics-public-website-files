export const config = {
  sourceRoot:
    "/Users/Greg/Library/CloudStorage/OneDrive-SharedLibraries-JohnAbbottCollege/Physics Dept - Documents/Website Files - Auto Synced To PUBLIC Website",
  outputRoot: "docs",
  filesOutputSubfolder: "files",
  siteTitle: "Physics Department Shared Files",
  siteIntro:
    "This page provides publicly shared Physics Department documents for John Abbott College students.",
  /** Public URL shown in links and logs. Use custom domain when configured. */
  publicSiteUrl: "https://department-files.ephysics.ca/",
  /** GitHub Pages custom domain (also written to docs/CNAME on each build). */
  customDomain: "department-files.ephysics.ca",
  departmentSiteUrl: "https://departments.johnabbott.qc.ca/departments/physics/",
  departmentSiteLabel: "Physics Department website",
  /** Top-level source subfolders that are never published (e.g. drafts). */
  ignoredTopLevelFolders: ["Draft"],
  /** Category display order on the public index (matches WordPress tabs). */
  categoryOrder: [
    "Textbook",
    "Equations",
    "Problem Set Solutions",
    "Sample Final Exams",
    "Links",
  ],
  /** Course subfolder order within each category section. */
  courseOrder: ["SN1", "SN2", "SN3", "NYB", "NYC", "SF2"],
  /** Top-level folders that use course subfolders on the public index. */
  categoriesWithCourseSubfolders: [
    "Textbook",
    "Equations",
    "Problem Set Solutions",
    "Sample Final Exams",
  ],
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
