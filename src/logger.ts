import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logDir = path.join(projectRoot, "logs");
const logFile = path.join(logDir, "publisher.log");

/** John Abbott College — Eastern Time (EST/EDT via America/Toronto). */
export const LOG_TIME_ZONE = "America/Toronto";

export function formatTimestamp(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: LOG_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")} ${get("timeZoneName")}`;
}

export function logEvent(message: string): void {
  const line = `[${formatTimestamp()}] ${message}`;
  console.log(line);
  fs.mkdirSync(logDir, { recursive: true });
  fs.appendFileSync(logFile, `${line}\n`, "utf8");
}

export function getLogFilePath(): string {
  return logFile;
}
