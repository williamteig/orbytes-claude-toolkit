#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [[ ! -f .dev.vars ]]; then
	echo "Missing .dev.vars — copy .dev.vars.example and fill values first." >&2
	exit 1
fi

push_one() {
	local key="$1"
	local val
	val=$(grep -E "^${key}=" .dev.vars | head -1 | cut -d= -f2-)
	if [[ -z "${val}" ]]; then
		echo "Skip ${key}: not set in .dev.vars" >&2
		return
	fi
	echo "Setting ${key} on Cloudflare…"
	printf '%s' "${val}" | npx wrangler secret put "${key}"
}

for k in WEBHOOK_SECRET DEVICE_TOKEN NOTION_API_KEY ANTHROPIC_API_KEY; do
	push_one "${k}"
done
echo "Done."
