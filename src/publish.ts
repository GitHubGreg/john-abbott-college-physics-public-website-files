import fs from "node:fs";
import path from "node:path";
import { spawn, type ChildProcess } from "node:child_process";
import { fileURLToPath } from "node:url";
import chokidar from "chokidar";
import fse from "fs-extra";
import { buildIndexHtml } from "./build-index-html.js";
import { config } from "./config.js";
import { publishDocsToGitHub } from "./git-publish.js";
import { getLogFilePath, logEvent } from "./logger.js";
import { scanSourceFolder } from "./scan-source.js";
import { resolveUniqueSlugPath, slugifyFilename, slugifySegment } from "./slug.js";
import type { ManifestEntry, PublishSummary, ResolvedFile } from "./types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const DEV_SERVER_PORT = 8080;

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function resolveSourceRoot(): string {
  return config.sourceRoot;
}

function resolveOutputRoot(): string {
  return path.resolve(projectRoot, config.outputRoot);
}

function resolveFilesOutputRoot(): string {
  return path.join(resolveOutputRoot(), config.filesOutputSubfolder);
}

function resolvePublicPaths(files: PublishSummary["published"]): ResolvedFile[] {
  const usedPaths = new Set<string>();

  return files.map((file) => {
    const parts = file.relativeSourcePath.split("/");
    const filename = parts.pop()!;
    const dirParts = parts.map(slugifySegment);
    const folderPath = dirParts.length > 0 ? dirParts.join("/") : "general";
    const sluggedFilename = slugifyFilename(filename);
    const desiredRelativePath = `${folderPath}/${sluggedFilename}`;
    const uniqueRelativePath = resolveUniqueSlugPath(desiredRelativePath, usedPaths);
    const publicPath = `${config.filesOutputSubfolder}/${uniqueRelativePath}`;

    return {
      ...file,
      publicPath,
      url: publicPath,
    };
  });
}

function toManifestEntry(file: ResolvedFile): ManifestEntry {
  return {
    title: file.title,
    category: file.category,
    course: file.course,
    subsection: file.subsection,
    sourcePath: file.relativeSourcePath,
    publicPath: file.publicPath,
    url: file.url,
    extension: file.extension,
    sizeBytes: file.sizeBytes,
    modified: formatDate(file.modified),
  };
}

function printWordPressSnippet(): void {
  console.log("\nWordPress snippet:\n");
  console.log(`[tabby title="Shared Files" icon="folder-open"]

<p>
Department documents, sample final exams, equation sheets, textbook resources,
and other shared Physics files are available here:
</p>

<p>
<a href="${config.publicSiteUrl}" target="_blank" rel="noopener noreferrer">
Open Physics Department shared files
</a>
</p>`);
}

function printSummary(
  summary: PublishSummary,
  options: { dryRun: boolean; sourceRoot: string; outputRoot: string },
): void {
  console.log("Physics Department Public File Publisher\n");
  console.log("Source:");
  console.log(`  ${options.sourceRoot}`);
  console.log("\nOutput:");
  console.log(`  ${options.outputRoot}`);

  if (options.dryRun) {
    console.log("\n(Dry run — no files were written)\n");
  }

  console.log(`\nPublished:`);
  console.log(`  ${summary.published.length} files`);

  if (summary.published.length > 0) {
    for (const file of summary.published) {
      console.log(
        `  - ${file.relativeSourcePath} -> ${file.publicPath}`,
      );
    }
  }

  console.log(`\nSkipped:`);
  console.log(`  ${summary.skippedIgnored.length} ignored system or unsupported files`);
  console.log(`  ${summary.skippedBlocked.length} blocked safety files`);

  if (summary.skippedBlocked.length > 0) {
    for (const blocked of summary.skippedBlocked) {
      console.log(`  - blocked: ${blocked}`);
    }
  }

  console.log(`\nPublic URL:`);
  console.log(`  ${config.publicSiteUrl}`);

  if (!options.dryRun) {
    printWordPressSnippet();
  }
}

async function prepareOutputDirectory(dryRun: boolean): Promise<void> {
  const outputRoot = resolveOutputRoot();
  const filesOutputRoot = resolveFilesOutputRoot();

  if (dryRun) {
    return;
  }

  await fse.ensureDir(outputRoot);
  await fse.remove(filesOutputRoot);
  await fse.ensureDir(filesOutputRoot);
}

async function copyPublishedFiles(
  files: ResolvedFile[],
  dryRun: boolean,
): Promise<void> {
  if (dryRun) {
    return;
  }

  const outputRoot = resolveOutputRoot();

  for (const file of files) {
    const destination = path.join(outputRoot, file.publicPath);
    await fse.ensureDir(path.dirname(destination));
    await fse.copy(file.absolutePath, destination);
  }
}

async function writeGeneratedAssets(
  manifest: ManifestEntry[],
  dryRun: boolean,
): Promise<void> {
  if (dryRun) {
    return;
  }

  const outputRoot = resolveOutputRoot();
  const templateCss = path.join(projectRoot, "public-template", "styles.css");

  await fse.writeJson(path.join(outputRoot, "manifest.json"), manifest, {
    spaces: 2,
  });
  await fse.writeFile(path.join(outputRoot, "index.html"), buildIndexHtml(manifest), "utf8");
  await fse.copy(templateCss, path.join(outputRoot, "styles.css"));
  await fse.copy(
    path.join(projectRoot, "public-template", "anchors.js"),
    path.join(outputRoot, "anchors.js"),
  );

  if (config.customDomain) {
    await fse.writeFile(
      path.join(outputRoot, "CNAME"),
      `${config.customDomain}\n`,
      "utf8",
    );
  }
}

export async function runPublish(options: {
  dryRun?: boolean;
  quiet?: boolean;
} = {}): Promise<PublishSummary> {
  const dryRun = options.dryRun ?? false;
  const sourceRoot = resolveSourceRoot();
  const outputRoot = resolveOutputRoot();

  if (!fs.existsSync(sourceRoot)) {
    throw new Error(
      `Source folder not found: ${sourceRoot}\n` +
        `Ensure the OneDrive-synced source folder exists before publishing.`,
    );
  }

  const scanResult = scanSourceFolder(sourceRoot);
  const resolvedFiles = resolvePublicPaths(scanResult.publishable);

  const summary: PublishSummary = {
    published: resolvedFiles,
    skippedIgnored: scanResult.skippedIgnored,
    skippedBlocked: scanResult.skippedBlocked,
  };

  await prepareOutputDirectory(dryRun);
  await copyPublishedFiles(resolvedFiles, dryRun);
  await writeGeneratedAssets(resolvedFiles.map(toManifestEntry), dryRun);

  if (!options.quiet) {
    printSummary(summary, { dryRun, sourceRoot, outputRoot });
  }

  return summary;
}

async function rebuildAndMaybePublish(options: {
  quiet?: boolean;
  autoPublish?: boolean;
  reason: string;
}): Promise<void> {
  const note = (message: string) => {
    if (options.autoPublish) {
      logEvent(message);
    } else {
      console.log(message);
    }
  };

  note(options.reason);

  const summary = await runPublish({
    dryRun: false,
    quiet: options.quiet ?? Boolean(options.autoPublish),
  });

  note(
    `Built local site: ${summary.published.length} files in docs/ (${summary.skippedBlocked.length} blocked, ${summary.skippedIgnored.length} ignored).`,
  );

  if (!options.autoPublish) {
    return;
  }

  try {
    publishDocsToGitHub();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logEvent(`GitHub publish failed: ${message}`);
  }
}

function startDevServer(): ChildProcess {
  const outputRoot = resolveOutputRoot();
  const binName = process.platform === "win32" ? "http-server.cmd" : "http-server";
  const httpServer = path.join(projectRoot, "node_modules", ".bin", binName);
  const child = spawn(httpServer, [outputRoot, "-p", String(DEV_SERVER_PORT), "-c-1"], {
    stdio: "inherit",
    cwd: projectRoot,
  });

  child.on("error", (error) => {
    console.error(`Failed to start preview server: ${error.message}`);
  });

  return child;
}

async function runWatch(options: {
  serve?: boolean;
  autoPublish?: boolean;
} = {}): Promise<void> {
  const sourceRoot = resolveSourceRoot();
  if (!fs.existsSync(sourceRoot)) {
    throw new Error(`Source folder not found: ${sourceRoot}`);
  }

  if (options.autoPublish) {
    logEvent("Background sync daemon started.");
    logEvent(`Watching source folder: ${sourceRoot}`);
    logEvent(`Writing log file: ${getLogFilePath()}`);
    logEvent(`Public site: ${config.publicSiteUrl}`);
  } else {
    console.log(`Watching for changes in:\n  ${sourceRoot}\n`);
  }

  await rebuildAndMaybePublish({
    quiet: options.serve || options.autoPublish,
    autoPublish: options.autoPublish,
    reason: "Initial build.",
  });

  let server: ChildProcess | undefined;
  if (options.serve) {
    server = startDevServer();
    console.log(`Preview at http://localhost:${DEV_SERVER_PORT}\n`);

    const stopServer = () => {
      if (server && !server.killed) {
        server.kill();
      }
    };

    process.on("SIGINT", () => {
      stopServer();
      process.exit(0);
    });
    process.on("SIGTERM", stopServer);
  }

  let timer: NodeJS.Timeout | undefined;
  const scheduleRebuild = () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      try {
        if (!options.autoPublish) {
          console.log("\nChange detected — rebuilding...\n");
        }
        await rebuildAndMaybePublish({
          quiet: options.serve || options.autoPublish,
          autoPublish: options.autoPublish,
          reason: "Change detected in source folder — rebuilding.",
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (options.autoPublish) {
          logEvent(`Rebuild failed: ${message}`);
        } else {
          console.error(`Rebuild failed: ${message}`);
        }
      }
    }, 3000);
  };

  chokidar
    .watch(sourceRoot, {
      ignoreInitial: true,
      ignored: (watchPath) => {
        const base = path.basename(watchPath);
        return base.startsWith(".") || base.startsWith("~") || base === "Icon\r";
      },
    })
    .on("all", scheduleRebuild);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const dev = args.includes("--dev");
  const daemon = args.includes("--daemon");
  const autoPublish = args.includes("--auto-publish") || daemon;
  const watch = args.includes("--watch") || dev || daemon;

  if (watch) {
    await runWatch({ serve: dev, autoPublish });
    return;
  }

  await runPublish({ dryRun });
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
