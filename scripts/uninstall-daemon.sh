#!/usr/bin/env bash
set -euo pipefail

LABEL="com.johnabbott.physics-publisher"
PLIST_DEST="${HOME}/Library/LaunchAgents/${LABEL}.plist"

launchctl bootout "gui/${UID}/${LABEL}" 2>/dev/null || true

if [ -f "$PLIST_DEST" ]; then
  rm "$PLIST_DEST"
fi

echo "Background publisher daemon stopped and uninstalled."
