# backend/scripts/deploy/cp_statics.sh

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"
ROOT_DIR="$(dirname "$BACKEND_DIR")"

set -a
source "$BACKEND_DIR/.prod.env"
set +a

FRONT_DST="/var/www/todo/frontend"
BACK_DST="/var/www/todo/backend"

sudo mkdir -p $FRONT_DST $BACK_DST

# frontend
cd "$ROOT_DIR/frontend"
npm ci
npm run build
rsync -a --delete dist/ "$FRONT_DST/build"

# backend
cd "$ROOT_DIR/backend"
python3 manage.py collectstatic --noinput
rsync -a --delete staticfiles/ "$BACK_DST/static"

echo "📄 cp static files to dst dirs completed."