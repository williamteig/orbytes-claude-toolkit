#!/usr/bin/env bash
# Orbytes Stop hook — stderr checklist (does not mutate stdin/JSON).
set -euo pipefail
cat >/dev/null
echo "orbytes checkpoint: Notion task updated? PR link / preview? Strip tracking params from stored URLs (see global/rules/git.md)." >&2
exit 0
