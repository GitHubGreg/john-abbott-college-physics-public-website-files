#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LABEL="com.johnabbott.physics-publisher"
PLIST_DEST="${HOME}/Library/LaunchAgents/${LABEL}.plist"
DAEMON_SCRIPT="${PROJECT_ROOT}/scripts/run-publisher-daemon.sh"
LOG_DIR="${PROJECT_ROOT}/logs"

if [ ! -x "$DAEMON_SCRIPT" ]; then
  chmod +x "$DAEMON_SCRIPT"
fi

mkdir -p "$LOG_DIR"

cat > "$PLIST_DEST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>${DAEMON_SCRIPT}</string>
  </array>
  <key>WorkingDirectory</key>
  <string>${PROJECT_ROOT}</string>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>${LOG_DIR}/launchd.out.log</string>
  <key>StandardErrorPath</key>
  <string>${LOG_DIR}/launchd.err.log</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin</string>
    <key>HOME</key>
    <string>${HOME}</string>
  </dict>
</dict>
</plist>
EOF

launchctl bootout "gui/${UID}/${LABEL}" 2>/dev/null || true
launchctl bootstrap "gui/${UID}" "$PLIST_DEST"
launchctl enable "gui/${UID}/${LABEL}" 2>/dev/null || true
launchctl kickstart -k "gui/${UID}/${LABEL}"

echo "Installed and started background publisher daemon."
echo
echo "Monitor activity:"
echo "  npm run monitor"
echo
echo "Log files:"
echo "  ${LOG_DIR}/publisher.log"
echo "  ${LOG_DIR}/launchd.out.log"
echo "  ${LOG_DIR}/launchd.err.log"
echo
echo "Status:"
launchctl print "gui/${UID}/${LABEL}" 2>/dev/null | grep -E "state =|last exit code =" || true
