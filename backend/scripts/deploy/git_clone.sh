#!/bin/bash
# backend/scripts/deploy/git_clone.sh

set -euo pipefail

SCRIPT_PATH="$0"
SCRIPT_DIR="$(dirname "$SCRIPT_PATH")"
PROJECT_ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

ENV_PATH=".prod.env"

set -a
source "$PROJECT_ROOT_DIR/.prod.env"
set +a

cd $PROJECT_ROOT_DIR

if [ -d "$CLONE_DIR_PATH/.git" ]; then
    echo "🐟 Already cloned. Pulling from GitHub..."
    git -C "$CLONE_DIR_PATH" pull
else 
    echo "🎏 Cloning GitHub repo..."
    git clone "$REPO_URL" "$CLONE_DIR_PATH"
fi

# chmod 740 backend/scripts/deploy/git_clone.sh
# ./backend/scripts/deploy/git_clone.sh