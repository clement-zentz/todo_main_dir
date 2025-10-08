#!/bin/bash
# backend/scripts/deploy/gen_certs.sh

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"
ROOT_DIR="$(dirname "$BACKEND_DIR")"

cd $ROOT_DIR

dc="docker compose -f \
  docker-compose.yml -f \
  docker-compose.prod.yml"

if [ $# -eq 0 ]; then
  echo "Usage: $0 <0|1>  (0 = staging, 1 = production)"
  exit 1
fi

echo "🔐 Generating SSL certificates with Certbot for $DOMAIN..."

if [ -z ${DOMAIN:-} ] || [ -z ${EMAIL:-} ]; then

  set -a
  source "$BACKEND_DIR/.prod.env"
  set +a
fi
  
if [ -z "${DOMAIN:-}" ] || [ -z "${EMAIL:-}" ]; then
  echo "❌ DOMAIN or EMAIL not set after loading .prod.env"
  exit 1
fi

certs_cmd="$dc run --rm certbot \
  certbot certonly --webroot \
  -w /var/www/certbot \
  -d $DOMAIN -d "www.$DOMAIN" \
  --email $EMAIL --agree-tos --no-eff-email"

if [ $1 -eq 0 ]; then
  $certs_cmd --staging
elif [ $1 -eq 1 ]; then
  $certs_cmd
else
  echo "❌ Invalid argument. Use 0 (staging) or 1 (production)."
  exit 1  
fi

$dc exec nginx sh -c "nginx -t"
$dc exec nginx nginx -s reload

echo "✅ SSL Certificates generated successfully."

# Execute this file:
# chmod 740 backend/scripts/deploy/gen_certs.sh
# ./backend/scripts/deploy/gen_certs.sh