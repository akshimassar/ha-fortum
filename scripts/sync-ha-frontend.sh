#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CACHE_DIR="${ROOT_DIR}/ha-frontend"
FRONTEND_DIR="${CACHE_DIR}/home-assistant-frontend"
REMOTE_URL="https://github.com/home-assistant/frontend.git"

mkdir -p "${CACHE_DIR}"

if [[ ! -d "${FRONTEND_DIR}/.git" ]]; then
  git clone "${REMOTE_URL}" "${FRONTEND_DIR}"
fi

if [[ -n "$(git -C "${FRONTEND_DIR}" status --porcelain)" ]]; then
  echo "ha-frontend cache has local changes; refusing to update" >&2
  exit 1
fi

git -C "${FRONTEND_DIR}" fetch --tags --prune origin

latest_tag=""
while IFS= read -r tag; do
  if [[ "${tag}" =~ ^[0-9]{8}\.[0-9]+$ ]]; then
    latest_tag="${tag}"
    break
  fi
done < <(git -C "${FRONTEND_DIR}" for-each-ref --sort=-version:refname --format='%(refname:short)' refs/tags)

if [[ -z "${latest_tag}" ]]; then
  while IFS= read -r tag; do
    if [[ "${tag}" =~ ^[0-9]{8}\.[0-9]+[[:alnum:].-]*$ ]]; then
      latest_tag="${tag}"
      break
    fi
  done < <(git -C "${FRONTEND_DIR}" for-each-ref --sort=-version:refname --format='%(refname:short)' refs/tags)
fi

if [[ -z "${latest_tag}" ]]; then
  echo "could not determine latest Home Assistant frontend release tag" >&2
  exit 1
fi

git -C "${FRONTEND_DIR}" checkout --detach "${latest_tag}"

echo "Home Assistant frontend ready at ${FRONTEND_DIR}"
echo "Checked out release tag: ${latest_tag}"
