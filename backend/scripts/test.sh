#!/bin/bash

# test

# use set -x for debug purpose only.

set -euo pipefail

ROOT_DIR=$(dirname $(dirname $(realpath $0)))

echo "$ROOT_DIR"

# load env var
if [ -f "$ROOT_DIR/.dev.env" ]; then
    set -a
    source "$ROOT_DIR/.dev.env"
    set +a
else
    echo "❌ Env file not found."
    exit 1
fi

if [ -z "${MY_NUM_CONST:-}" ] || [ -z "${MY_STR_CONST:-}" ]; then
  echo "❌ Error, env variable missing."
  exit 1
else
  echo "✅ Env variables successfully retrieved."
fi

echo "MY_NUM_CONST = $MY_NUM_CONST"
echo "MY_STR_CONST = $MY_STR_CONST"

# chmod 740 backend/scripts/test.sh
# ./backend/scripts/test.sh
