#!/bin/bash
# scripts/scp_env_file.sh

# 2. scp env file to remote host

set -euo pipefail

SCRIPT_PATH="$0"
SCRIPT_DIR="$(dirname $SCRIPT_PATH)"
BACKEND_ROOT_DIR="$(cd $SCRIPT_DIR/../.. && pwd)"

set -a
source "$BACKEND_ROOT_DIR/.prod.env"
set +a

cd $BACKEND_ROOT_DIR

echo "📡 Starting to transfer $ENV_PATH to remote host."

ENV_DEST_DIR="$REMOTE_PATH/$(dirname $ENV_PATH)"

ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" \
  "mkdir -p $ENV_DEST_DIR"

scp -P "$REMOTE_PORT" \
    "$ENV_PATH" \
    "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/backend/$ENV_PATH"

if [ $? -eq 0 ]; then
  echo "🎉 File transferred successfully."
else
  echo "❌ File transfer failed."
fi

# Execute script:
# chmod u+x backend/scripts/deploy/scp_env_files.sh
# ./backend/scripts/deploy/scp_env_files.sh