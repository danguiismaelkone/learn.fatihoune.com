#!/bin/sh
# Usage: ./deploy/deploy.sh preprod|production
# Builds the image, (re)starts the stack and waits until the app answers /healthz.
set -eu
ENV="${1:?usage: deploy.sh preprod|production}"
FILE=".env.$ENV"
[ -f "$FILE" ] || { echo "Missing $FILE (copy deploy/env.$ENV.example and fill it in)"; exit 1; }
grep -q '^PAYLOAD_SECRET=[^ #]' "$FILE" || { echo "PAYLOAD_SECRET is empty in $FILE"; exit 1; }
grep -q '^APP_PORT=[0-9]' "$FILE" || grep -q '^COMPOSE_PROFILES=.*caddy' "$FILE" || {
  echo "APP_PORT is empty in $FILE (pick a free port, e.g. 3010; check with: ss -ltn | grep :3010)"; exit 1; }

docker compose --env-file "$FILE" build app
docker compose --env-file "$FILE" up -d

echo "Waiting for the app to become healthy (migrations run on start)..."
i=0
until docker compose --env-file "$FILE" exec -T app wget -qO- http://127.0.0.1:3000/healthz >/dev/null 2>&1; do
  i=$((i + 1))
  [ "$i" -le 60 ] || { echo "Not healthy after 5 minutes. Logs:"; docker compose --env-file "$FILE" logs --tail 50 app; exit 1; }
  sleep 5
done
docker compose --env-file "$FILE" ps

PORT=$(sed -n 's/^APP_PORT=\([0-9]*\).*/\1/p' "$FILE")
BIND=$(sed -n 's/^APP_BIND=\([0-9.]*\).*/\1/p' "$FILE")
[ -n "$PORT" ] && echo "OK. Nginx Proxy Manager forward target: http://${BIND:-172.17.0.1}:$PORT"
