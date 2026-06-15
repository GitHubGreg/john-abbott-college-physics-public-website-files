import { config } from "./config.js";
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

function groupByCategory(entries: ManifestEntry[]): Map<string, ManifestEntry[]> {
  const groups = new Map<string, ManifestEntry[]>();

  for (const entry of entries) {
    const list = groups.get(entry.category) ?? [];
    list.push(entry);
    groups.set(entry.category, list);
  }

  for (const [, list] of groups) {
    list.sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
    );
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

export function buildIndexHtml(entries: ManifestEntry[]): string {
  const grouped = groupByCategory(entries);

  const sections = [...grouped.entries()]
    .map(([category, files]) => {
      const items = files
        .map((file) => {
          const meta = `${formatFileType(file.extension)}, updated ${file.modified}, ${formatFileSize(file.sizeBytes)}`;
          return `    <li>
      <a href="${escapeHtml(file.url)}">${escapeHtml(file.title)}</a>
      <span>${escapeHtml(meta)}</span>
    </li>`;
        })
        .join("\n");

      return `<section>
  <h2>${escapeHtml(category)}</h2>
  <ul>
${items}
  </ul>
</section>`;
    })
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
</head>
<body>
  <main>
    <h1>${escapeHtml(config.siteTitle)}</h1>
    <p>${escapeHtml(config.siteIntro)}</p>
    ${emptyMessage}${sections}
  </main>
</body>
</html>
`;
}
