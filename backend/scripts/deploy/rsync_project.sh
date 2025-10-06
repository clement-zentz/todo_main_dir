#!/bin/bash

# 1. rsync project folder to remote host

set -euo pipefail

SCRIPT_PATH="$0"
SCRIPT_DIR="$(dirname "$SCRIPT_PATH")"
PROJECT_ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

set -a
source "$PROJECT_ROOT_DIR/.prod.env"
set +a

cd $PROJECT_ROOT_DIR

ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" \
"mkdir -p $REMOTE_PATH"

rsync -avz \
  --exclude='.git' \
  --exclude='*.env' \
  --exclude='wsl_venv' \
  --exclude='__pycache__' \
  --exclude='*.pyc' \
  --exclude='*.log' \
  --exclude='*.sqlite3' \
  --exclude='media/' \
  --exclude='staticfiles/' \
  -e "ssh -p $REMOTE_PORT" \
  "$CLONE_DIR_PATH/" $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH

if [ $? -eq 0 ]; then
    echo "✅ Project directory sync with success."
else
    echo "❌ Project directory sync failed."
fi

# chmod u+x backend/scripts/deploy/rsync_project.sh
# ./backend/scripts/deploy/rsync_project.sh