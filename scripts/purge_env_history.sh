#!/usr/bin/env bash
# Purge `backend/.env` from git history using git-filter-repo (recommended)
# Usage:
# 1. Install git-filter-repo: https://github.com/newren/git-filter-repo
# 2. Run this script from a safe location (not inside an existing working clone):
#    bash scripts/purge_env_history.sh <repo-url>
#
# This script creates a mirror clone, rewrites history to remove backend/.env,
# and force-pushes the cleaned history back to the remote. WARNING: this
# rewrites history and will require all collaborators to re-clone.

set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <repo-url>"
  echo "Example: $0 git@github.com:org/repo.git"
  exit 1
fi

REPO_URL="$1"
MIRROR_DIR="repo-mirror.git"

echo "==> Creating bare mirror clone..."
git clone --mirror "$REPO_URL" "$MIRROR_DIR"
cd "$MIRROR_DIR"

echo "==> Removing backend/.env from history using git-filter-repo..."
# Remove path from history
git filter-repo --invert-paths --paths backend/.env

echo "==> Expiring reflog and running garbage collection..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo "==> Force-pushing cleaned history to remote (all branches and tags)..."
git push --force --all
git push --force --tags

echo "==> Done. IMPORTANT: Inform all collaborators to re-clone the repository."
echo "See ../docs/SECRET_ROTATION.md for recommended next steps (rotate keys, update CI)."
