#!/usr/bin/env bash
# Push to GitHub after setting GITHUB_TOKEN
set -euo pipefail

REPO_URL="https://github.com/madhukarbanoth14/Visual-proposal-editor.git"

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "Error: GITHUB_TOKEN is not set."
  echo "Create a token at https://github.com/settings/tokens with 'repo' scope."
  exit 1
fi

cd "$(dirname "$0")/.."

echo "$GITHUB_TOKEN" | gh auth login --with-token 2>/dev/null || true

git remote remove origin 2>/dev/null || true
git remote add origin "https://x-access-token:${GITHUB_TOKEN}@github.com/madhukarbanoth14/Visual-proposal-editor.git"

echo "Pushing main branch to $REPO_URL ..."
git push -u origin main

echo "Done! Repository: $REPO_URL"
