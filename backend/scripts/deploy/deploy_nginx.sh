#!/bin/bash
# backend/scripts/deploy/deploy_nginx.sh

set -euo pipefail

ROOT_DIR=$(dirname $(dirname $(dirname $(realpath $0))))

set -a
source "$ROOT_DIR/.prod.env"
set +a

cd $ROOT_DIR

NGINX_CONF_SOURCE="$CONF_SRC_DIR/$DOMAIN.conf"
NGINX_CONF_TARGET="$CONF_DST_DIR/$DOMAIN.conf"
NGINX_CONF_ENABLED="$(dirname $CONF_DST_DIR)/sites-enabled/$DOMAIN"

echo "📦 Deploying Nginx conf for $DOMAIN..."

sudo cp "$NGINX_CONF_SOURCE" "$NGINX_CONF_TARGET"
sudo ln -sf "$NGINX_CONF_TARGET" "$NGINX_CONF_ENABLED"

sudo nginx -t
sudo systemctl reload nginx

echo "✅ Nginx started with HTTP for $DOMAIN."

# Execute this file:
# chmod 740 backend/scripts/deploy/deploy_nginx.sh
# ./backend/scripts/deploy/deploy_nginx.sh
