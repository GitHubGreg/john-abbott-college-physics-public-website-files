import fs from "node:fs";
import path from "node:path";
import { config } from "./config.js";
import type { ScanResult, ScannedFile } from "./types.js";

const ONEDRIVE_PLACEHOLDER_EXTENSIONS = new Set([
  ".download",
  ".tmp",
  ".partial",
  ".crdownload",
]);

function shouldIgnoreEntry(name: string): boolean {
  if (!name || name.startsWith(".") || name.startsWith("~")) {
    return true;
  }

  if (name === ".DS_Store" || name === "Icon\r" || name === "Icon") {
    return true;
  }

  if (name.startsWith("~$")) {
    return true;
  }

  const lower = name.toLowerCase();
  if (lower.endsWith(".tmp") || lower.endsWith(".download")) {
    return true;
  }

  const ext = path.extname(name).toLowerCase();
  if (ONEDRIVE_PLACEHOLDER_EXTENSIONS.has(ext)) {
    return true;
  }

  if (name === "node_modules") {
    return true;
  }

  return false;
}

function isBlocked(relativePath: string): boolean {
  const normalized = relativePath.toLowerCase().replace(/\\/g, "/");
  return config.blockedTerms.some((term) => normalized.includes(term));
}

function titleFromFilename(filename: string): string {
  const ext = path.extname(filename);
  const base = ext ? filename.slice(0, -ext.length) : filename;
  return base.trim() || filename;
}

function categoryFromRelativePath(relativePath: string): string {
  const parts = relativePath.split(path.sep).filter(Boolean);
  if (parts.length <= 1) {
    return "General";
  }
  return parts[0];
}

function scanDirectory(
  absoluteDir: string,
  relativeDir: string,
  result: ScanResult,
): void {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(absoluteDir, { withFileTypes: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Warning: could not read directory ${absoluteDir}: ${message}`);
    return;
  }

  for (const entry of entries) {
    if (shouldIgnoreEntry(entry.name)) {
      const ignoredPath = path.join(relativeDir, entry.name).replace(/\\/g, "/");
      result.skippedIgnored.push(
        relativeDir
          ? `${config.publicSubfolder}/${ignoredPath}`
          : `${config.publicSubfolder}/${entry.name}`,
      );
      continue;
    }

    const absolutePath = path.join(absoluteDir, entry.name);
    const relativePath = path.join(relativeDir, entry.name);

    if (entry.isDirectory()) {
      scanDirectory(absolutePath, relativePath, result);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const displayPath = `${config.publicSubfolder}/${relativePath.replace(/\\/g, "/")}`;

    if (isBlocked(displayPath)) {
      result.skippedBlocked.push(displayPath);
      console.warn(`Skipped blocked file: ${displayPath}`);
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();
    if (!(config.allowedExtensions as readonly string[]).includes(extension)) {
      result.skippedIgnored.push(displayPath);
      continue;
    }

    let stats: fs.Stats;
    try {
      stats = fs.statSync(absolutePath);
    } catch {
      result.skippedIgnored.push(displayPath);
      continue;
    }

    if (!stats.isFile()) {
      continue;
    }

    result.publishable.push({
      absolutePath,
      relativeSourcePath: relativePath.replace(/\\/g, "/"),
      category: categoryFromRelativePath(relativePath),
      title: titleFromFilename(entry.name),
      extension,
      sizeBytes: stats.size,
      modified: stats.mtime,
    });
  }
}

export function scanSourceFolder(publicSourceRoot: string): ScanResult {
  const result: ScanResult = {
    publishable: [],
    skippedIgnored: [],
    skippedBlocked: [],
  };

  scanDirectory(publicSourceRoot, "", result);

  result.publishable.sort((a, b) =>
    a.relativeSourcePath.localeCompare(b.relativeSourcePath, undefined, {
      sensitivity: "base",
    }),
  );

  return result;
}
