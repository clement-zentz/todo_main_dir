# backend/scripts/deploy/ssh_cmd.sh

set -euo pipefail

ROOT_DIR=$(dirname $(dirname $(dirname $(realpath $0))))

set -a
source "$ROOT_DIR/.prod.env"
set +a

ssh $REMOTE_USER@$REMOTE_HOST -p $REMOTE_PORT

# cd backend/scripts/deploy
# chmod 740 *.sh

# cd ../../../
# make down env=prod
# make build env=prod
# make up env=prod

# logout
