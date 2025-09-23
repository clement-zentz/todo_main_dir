#!/bin/bash
# curl --> Command line tool for sending GET or POST HTTP requests.

# ignore/api_request.sh

set -euo pipefail

ROOT_DIR=$(dirname $(dirname $(realpath $0)))

# load env var
if [ -f "$ROOT_DIR/.dev.env" ]; then
    set -a
    source "$ROOT_DIR/.dev.env"
    set +a
else
    echo "❌ Env file not found."
    exit 1
fi

if [ -z "${EMAIL:-}" ] || [ -z "${PASSWORD:-}" ]; then
  echo "❌ Error, env variable missing."
  exit 1
else
  echo "✅ Env variables successfully retrieved."
fi


# 1. Log in (get access and refresh tokens).
RESPONSE=$(curl -X POST http://127.0.0.1:8000/api/login/ \
    -H "Content-Type: application/json" \
    -d '{"email": "'"$EMAIL"'", "password": "'"$PASSWORD"'"}')

ACCESS_TOKEN=$(echo "$RESPONSE" | jq -r '.access')
REFRESH_TOKEN=$(echo "$RESPONSE" | jq -r '.refresh')

echo -e "\n"
echo -e "Access Token: $ACCESS_TOKEN\n"
echo -e "Refresh Token: $REFRESH_TOKEN\n"

# Expected response.
# {
  # Refresh token (long duration).  
  # "refresh": "xxxxx.yyyyy.zzzzz", 
  # Access token (short-lived, for use in requests).
  # "access": "aaaaa.bbbbb.ccccc"
# }


# 2. Create one todo.
curl -X POST http://127.0.0.1:8000/api/todo_list/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{"title": "learn DRF and simplejwt", "done": false}'


# 3. List todos.
curl -X GET http://127.0.0.1:8000/api/todo_list/ \
  -H "Authorization: Bearer $ACCESS_TOKEN"


# 4. Update one todo (remplace ID with an existing ID).
curl -X PUT http://127.0.0.1:8000/api/todo_list/1/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{"title": "Test API (update)", "done": true}'  


# 5. Delete a todo.
curl -X DELETE http://127.0.0.1:8000/api/todo_list/1/ \
  -H "Authorization: Bearer $ACCESS_TOKEN"


# 6. Refresh token.
    curl -X POST http://127.0.0.1:8000/api/refresh/ \
    -H "Content-Type: application/json" \
    -d "{\"refresh\": \"$REFRESH_TOKEN\"}"
# Refresh access token (⌚ after 60 minutes).


# chmod 740 backend/scripts/api_request.sh
# ./backend/scripts/api_request.sh