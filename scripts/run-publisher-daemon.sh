#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$PROJECT_ROOT/logs"
LOG_FILE="$LOG_DIR/publisher.log"
LOG_TZ="America/Toronto"

mkdir -p "$LOG_DIR"

timestamp() {
  TZ="$LOG_TZ" date '+%Y-%m-%d %H:%M:%S %Z'
}

# launchd runs without a login shell — extend PATH for Homebrew and common Node installs.
export PATH="/opt/homebrew/bin:/usr/local/bin:${HOME}/.local/bin:${PATH}"

if [ -s "${HOME}/.nvm/nvm.sh" ]; then
  # shellcheck disable=SC1091
  source "${HOME}/.nvm/nvm.sh"
fi

cd "$PROJECT_ROOT"

if ! command -v node >/dev/null 2>&1; then
  echo "[$(timestamp)] ERROR: node not found in PATH" >> "$LOG_FILE"
  exit 1
fi

echo "[$(timestamp)] Launching Physics publisher daemon..." >> "$LOG_FILE"
echo "[$(timestamp)] Project: $PROJECT_ROOT" >> "$LOG_FILE"
echo "[$(timestamp)] Node: $(command -v node) ($(node -v))" >> "$LOG_FILE"

exec npm run sync --silent
