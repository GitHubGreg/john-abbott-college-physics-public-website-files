#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_FILE="${PROJECT_ROOT}/logs/publisher.log"
LABEL="com.johnabbott.physics-publisher"

mkdir -p "${PROJECT_ROOT}/logs"
touch "$LOG_FILE"

echo "Physics publisher daemon status"
echo "==============================="
echo

if launchctl print "gui/${UID}/${LABEL}" >/dev/null 2>&1; then
  launchctl print "gui/${UID}/${LABEL}" | grep -E "state =|last exit code =|runs =|path =" || true
else
  echo "Daemon is not installed."
  echo "Install with: npm run daemon:install"
fi

echo
echo "Tail the activity log:"
echo "  npm run monitor"
echo
echo "Log file: $LOG_FILE"
echo
echo "Last 20 log lines:"
echo "------------------"
tail -n 20 "$LOG_FILE" 2>/dev/null || echo "(no log output yet)"
