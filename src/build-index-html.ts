import { config } from "./config.js";
import {
  categoryAnchorId,
  compareSubsections,
  getSubsectionTitle,
  subsectionAnchorId,
  usesCourseSubsections,
} from "./subsections.js";
import type { ManifestEntry } from "./types.js";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatFileType(extension: string): string {
  const map: Record<string, string> = {
    ".pdf": "PDF",
    ".docx": "Word",
    ".pptx": "PowerPoint",
    ".xlsx": "Excel",
    ".csv": "CSV",
    ".txt": "Text",
    ".zip": "ZIP",
  };
  return map[extension.toLowerCase()] ?? extension.slice(1).toUpperCase();
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function renderFileList(files: ManifestEntry[]): string {
  const items = files
    .map((file) => {
      const meta = `${formatFileType(file.extension)}, updated ${file.modified}, ${formatFileSize(file.sizeBytes)}`;
      return `    <li>
      <a href="${escapeHtml(file.url)}">${escapeHtml(file.title)}</a>
      <span>${escapeHtml(meta)}</span>
    </li>`;
    })
    .join("\n");

  return `<ul>
${items}
  </ul>`;
}

function groupByCategory(entries: ManifestEntry[]): Map<string, ManifestEntry[]> {
  const groups = new Map<string, ManifestEntry[]>();

  for (const entry of entries) {
    const list = groups.get(entry.category) ?? [];
    list.push(entry);
    groups.set(entry.category, list);
  }

  return new Map(
    [...groups.entries()].sort(([a], [b]) => {
      const order = config.categoryOrder as readonly string[];
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);
      const rankA = indexA === -1 ? order.length : indexA;
      const rankB = indexB === -1 ? order.length : indexB;
      if (rankA !== rankB) {
        return rankA - rankB;
      }
      return a.localeCompare(b, undefined, { sensitivity: "base" });
    }),
  );
}

function groupBySubsection(
  files: ManifestEntry[],
): Map<string, ManifestEntry[]> {
  const groups = new Map<string, ManifestEntry[]>();

  for (const file of files) {
    const key = `${file.course}\0${file.subsection}`;
    const list = groups.get(key) ?? [];
    list.push(file);
    groups.set(key, list);
  }

  for (const [, list] of groups) {
    list.sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
    );
  }

  return new Map(
    [...groups.entries()].sort(([keyA], [keyB]) => {
      const [courseA, subsectionA] = keyA.split("\0");
      const [courseB, subsectionB] = keyB.split("\0");
      return compareSubsections(
        { course: courseA, subsection: subsectionA },
        { course: courseB, subsection: subsectionB },
      );
    }),
  );
}

function renderCategorySection(
  category: string,
  files: ManifestEntry[],
): string {
  if (!usesCourseSubsections(category)) {
    return `<section id="${escapeHtml(categoryAnchorId(category))}">
  <h2>${escapeHtml(category)}</h2>
${renderFileList(files)}
</section>`;
  }

  const subsections = groupBySubsection(files);
  const blocks = [...subsections.entries()].map(([key, subsectionFiles]) => {
    const [course, subsection] = key.split("\0");
    const title = getSubsectionTitle(category, course, subsection);
    const id = subsectionAnchorId(category, course, subsection);
    return `  <div class="subsection" id="${escapeHtml(id)}">
    <h3>${escapeHtml(title)}</h3>
${renderFileList(subsectionFiles)}
  </div>`;
  });

  return `<section id="${escapeHtml(categoryAnchorId(category))}">
  <h2>${escapeHtml(category)}</h2>
${blocks.join("\n\n")}
</section>`;
}

export function buildIndexHtml(entries: ManifestEntry[]): string {
  const grouped = groupByCategory(entries);

  const sections = [...grouped.entries()]
    .map(([category, files]) => renderCategorySection(category, files))
    .join("\n\n");

  const emptyMessage =
    entries.length === 0
      ? `<p class="empty-state">No files are published yet. Add documents to the synced source folder and run the publisher.</p>\n\n`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(config.siteTitle)}</title>
  <link rel="stylesheet" href="styles.css">
  <script src="anchors.js" defer></script>
</head>
<body>
  <main>
    <header class="page-header">
      <p class="department-link">
        <a href="${escapeHtml(config.departmentSiteUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(config.departmentSiteLabel)}</a>
      </p>
      <h1>${escapeHtml(config.siteTitle)}</h1>
      <p>${escapeHtml(config.siteIntro)}</p>
    </header>
    ${emptyMessage}${sections}
  </main>
</body>
</html>
`;
}
