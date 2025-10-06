#!/bin/bash

set -euo pipefail

ROOT_DIR=$(dirname $(dirname $(dirname $(realpath $0))))

cd "$ROOT_DIR/scripts/deploy"

./git_clone.sh
./rsync_project.sh
./scp_env_files.sh

set -a
source "$ROOT_DIR/.prod.env"
set +a

ssh $REMOTE_USER@$REMOTE_HOST -p $REMOTE_PORT << EOF
cd "$REMOTE_PATH/backend/scripts/deploy"
chmod 740 *.sh
./deploy_nginx.sh
./gen_certs.sh
cd
cd "$REMOTE_PATH"
# make up env=prod
EOF

echo "⚙️ Deployment completed."

# chmod 740 backend/scripts/deploy/full_deploy.sh
# ./backend/scripts/deploy/full_deploy.sh