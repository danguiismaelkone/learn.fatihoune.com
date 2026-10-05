#!/bin/sh
# Run on the server, from website/site.
# Usage: ./deploy/import-content.sh preprod|production content-import/fatihoune-content-<date>.tar.gz
# REPLACES the site's database and uploaded media with the archive made by deploy/export-content.sh.
# The current data is saved first in backups/pre-import-<date>.tar.gz.
set -eu
ENV="${1:?usage: import-content.sh preprod|production <archive.tar.gz>}"
ARCHIVE="${2:?usage: import-content.sh preprod|production <archive.tar.gz>}"
FILE=".env.$ENV"
[ -f "$FILE" ] || { echo "Missing $FILE"; exit 1; }
[ -f "$ARCHIVE" ] || { echo "Archive not found: $ARCHIVE"; exit 1; }
tar -tzf "$ARCHIVE" | grep -qx 'fatihoune.db' || { echo "Not a content export (fatihoune.db missing)"; exit 1; }

echo "This REPLACES the $ENV database and media with $(basename "$ARCHIVE")."
printf "Type IMPORT to continue: "
read -r answer
[ "$answer" = "IMPORT" ] || { echo "Cancelled."; exit 1; }

DIR=$(cd "$(dirname "$ARCHIVE")" && pwd)
NAME=$(basename "$ARCHIVE")
STAMP=$(date +%Y-%m-%d-%H%M)
mkdir -p backups
C="docker compose --env-file $FILE"

$C build app
$C stop app 2>/dev/null || true
# One-off container on the app's data volume: back up what is there, then unpack the archive.
$C run --rm --no-deps -T -v "$DIR:/import:ro" -v "$PWD/backups:/backups" --entrypoint sh app -c "
  set -e
  if [ -f /data/fatihoune.db ]; then tar -czf /backups/pre-import-$STAMP.tar.gz -C /data fatihoune.db media; echo 'Previous data saved: backups/pre-import-$STAMP.tar.gz'; fi
  rm -rf /data/media /data/fatihoune.db /data/fatihoune.db-wal /data/fatihoune.db-shm
  tar -xzf /import/$NAME -C /data
  echo 'Imported: database + media'
"
$C up -d
echo "Started. Check: ./deploy/deploy.sh $ENV (rebuild + health check) or $C logs -f app"
