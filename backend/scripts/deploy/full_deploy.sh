#!/bin/bash
# backend/scripts/deploy/full_deploy.sh

set -euo pipefail

ROOT_DIR=$(dirname $(dirname $(dirname $(realpath $0))))

cd "$ROOT_DIR/scripts/deploy"

./git_clone.sh
./rsync_project.sh
./scp_env_files.sh

echo "⚙️ file transfer completed."

# chmod 740 backend/scripts/deploy/full_deploy.sh
# ./backend/scripts/deploy/full_deploy.sh