#!/bin/sh
# Run on the machine where content was entered (local development), from website/site.
# Usage: make export-content   (or ./deploy/export-content.sh)
# Produces content-export/fatihoune-content-<date>.tar.gz (database + uploaded media) for deploy/import-content.sh.
#
# A development database is kept in sync by schema push, so it records no migrations. Copied as-is, the
# server's start-up "payload migrate" would try to create existing tables. This script checks that the
# schema matches the repository migrations exactly, then marks every migration as applied in the copy.
set -eu
export COPYFILE_DISABLE=1   # macOS: no ._ resource files in the archive
command -v sqlite3 >/dev/null || { echo "sqlite3 is required"; exit 1; }
SRC="${DATABASE_FILE:-fatihoune.db}"
MEDIA="${MEDIA_DIR:-media}"
[ -f "$SRC" ] || { echo "Database not found: $SRC"; exit 1; }
[ -d "$MEDIA" ] || { echo "Media folder not found: $MEDIA"; exit 1; }

STAMP=$(date +%Y-%m-%d-%H%M)
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT
mkdir -p "$WORK/pkg" content-export

echo "1/4 Consistent copy of the database (safe while the dev server runs)"
sqlite3 "$SRC" ".backup '$WORK/pkg/fatihoune.db'"

echo "2/4 Reference schema from the repository migrations"
DATABASE_URL="file:$WORK/ref.db" PAYLOAD_SECRET=export-only NODE_ENV=production \
  pnpm -s payload migrate >/dev/null

schema() {
  for t in $(sqlite3 "$1" "select name from sqlite_master where type='table' and name not like 'sqlite_%' and name<>'payload_migrations' order by name"); do
    sqlite3 "$1" "select '$t', name, type, \"notnull\", pk from pragma_table_info('$t')"
  done | sort
  sqlite3 "$1" "select 'index', name from sqlite_master where type='index' and name not like 'sqlite_%' order by name"
}
schema "$WORK/ref.db" > "$WORK/ref.txt"
schema "$WORK/pkg/fatihoune.db" > "$WORK/local.txt"
if ! diff "$WORK/ref.txt" "$WORK/local.txt" > "$WORK/schema.diff"; then
  echo "Schema differs from the migrations (< migrations, > local database):"
  cat "$WORK/schema.diff"
  echo "Pull the latest code and start the dev server once (it syncs the schema), or create the missing migration."
  exit 1
fi

echo "3/4 Marking the $(sqlite3 "$WORK/ref.db" 'select count(*) from payload_migrations') migrations as applied in the copy"
sqlite3 "$WORK/pkg/fatihoune.db" "
  ATTACH '$WORK/ref.db' AS ref;
  DELETE FROM payload_migrations;
  INSERT INTO payload_migrations (name, batch) SELECT name, 1 FROM ref.payload_migrations ORDER BY id;"

echo "4/4 Packaging database + media"
cp -R "$MEDIA" "$WORK/pkg/media"
OUT="content-export/fatihoune-content-$STAMP.tar.gz"
tar -czf "$OUT" -C "$WORK/pkg" fatihoune.db media
echo "Done: $OUT ($(du -h "$OUT" | cut -f1)). Upload it to the server (FTP/scp) into content-import/ (in the cloned folder)."
