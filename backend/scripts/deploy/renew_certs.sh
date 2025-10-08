#!/bin/bash
# backend/scripts/deploy/renew_certs.sh

set -euo pipefail

SCRIPT_DIR="$(realpath ${BASH_SOURCE[0]})"
BACKEND_DIR="$(dirname $(dirname $(dirname $SCRIPT_DIR)))"
ROOT_DIR="$(dirname $BACKEND_DIR)"

cd "$ROOT_DIR"

dc="docker compose -f \
    docker-compose.yml -f \
    docker-compose.prod.yml"

$dc run --rm certbot certbot renew --quiet

$dc exec nginx nginx -s reload || true

echo "✅ Certificates renewed and Nginx reloaded."
