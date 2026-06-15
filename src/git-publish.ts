import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { logEvent, formatTimestamp } from "./logger.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function runGit(args: string[]): string {
  return execFileSync("git", args, {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function currentBranch(): string {
  return runGit(["rev-parse", "--abbrev-ref", "HEAD"]);
}

export function publishDocsToGitHub(): boolean {
  const changes = runGit(["status", "--porcelain", "docs"]);
  if (!changes) {
    logEvent("No changes in docs/ — website already up to date.");
    return false;
  }

  const branch = currentBranch();
  const timestamp = formatTimestamp();

  logEvent(`Committing docs/ changes and pushing to origin/${branch}...`);

  execFileSync("git", ["add", "docs"], { cwd: projectRoot, stdio: "inherit" });
  execFileSync(
    "git",
    ["commit", "-m", `Update public files (${timestamp})`],
    { cwd: projectRoot, stdio: "inherit" },
  );
  execFileSync("git", ["push", "origin", branch], {
    cwd: projectRoot,
    stdio: "inherit",
  });

  logEvent(`Published to GitHub Pages (origin/${branch}).`);
  return true;
}

export function getProjectRoot(): string {
  return projectRoot;
}

export function getDocsPath(): string {
  return path.join(projectRoot, "docs");
}
