#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_FILE="${PROJECT_ROOT}/logs/publisher.log"

mkdir -p "${PROJECT_ROOT}/logs"
touch "$LOG_FILE"

echo "Monitoring Physics publisher log (Ctrl+C to stop):"
echo "$LOG_FILE"
echo

tail -n 40 -f "$LOG_FILE"
