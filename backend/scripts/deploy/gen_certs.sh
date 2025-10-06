#!/bin/bash
# backend/scripts/deploy/gen_certs.sh

set -euo pipefail

ROOT_DIR=$(dirname $(dirname $(dirname $(realpath $0))))

set -a
source "$ROOT_DIR/.prod.env"
set +a

echo "🔐 Generating SSL certificates with Certbot for $DOMAIN..."

# NB: certbot add an auto certs renewal cron job by default
sudo certbot --nginx \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email

echo "✅ SSL Certificates generated successfully."

# Certs renewal test
sudo certbot renew --dry-run

# Execute this file:
# chmod 740 backend/scripts/deploy/gen_certs.sh
# ./backend/scripts/deploy/gen_certs.sh