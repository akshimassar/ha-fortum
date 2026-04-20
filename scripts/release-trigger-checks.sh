#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

"${ROOT_DIR}/scripts/sync-ha-frontend.sh"
uv run pytest tests/ -v
node --test "${ROOT_DIR}"/tests/frontend/*.cjs
