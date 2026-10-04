#!/bin/sh
# Usage: ./deploy/deploy.sh preprod|production
set -eu
ENV="${1:?usage: deploy.sh preprod|production}"
FILE=".env.$ENV"
[ -f "$FILE" ] || { echo "Missing $FILE (copy deploy/env.$ENV.example and fill it in)"; exit 1; }
grep -q '^PAYLOAD_SECRET=.\+' "$FILE" || { echo "PAYLOAD_SECRET is empty in $FILE"; exit 1; }
docker compose --env-file "$FILE" build app
docker compose --env-file "$FILE" up -d
echo "Waiting for the app to become healthy..."
docker compose --env-file "$FILE" exec -T app wget -qO- http://127.0.0.1:3000/healthz && echo
docker compose --env-file "$FILE" ps
