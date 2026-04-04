#!/bin/sh
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/apps/notion-task-bridge/worker/vendor-toolkit"
rm -rf "$DEST"
mkdir -p "$DEST/agents" "$DEST/rules" "$DEST/commands"
cp "$ROOT/global/agents/project-manager.md" "$DEST/agents/"
cp "$ROOT/global/rules/pipeline.md" "$ROOT/global/rules/notion.md" "$ROOT/global/rules/git.md" "$DEST/rules/"
cp "$ROOT/global/commands/task.md" "$DEST/commands/"
echo "Vendored toolkit into $DEST (version: $(git -C "$ROOT" rev-parse --short HEAD 2>/dev/null || echo unknown))"
