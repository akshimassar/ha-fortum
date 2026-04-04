#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="${ROOT_DIR}/ha-frontend/home-assistant-frontend"

if [[ ! -d "${FRONTEND_DIR}/.git" ]]; then
  echo "Skipping HA frontend compatibility canary (clone not present)."
  echo "Run ./scripts/sync-ha-frontend.sh once to enable it locally."
  exit 0
fi

"${ROOT_DIR}/scripts/sync-ha-frontend.sh"
node --test "${ROOT_DIR}/tests/frontend/test_ha_frontend_compat.cjs"
