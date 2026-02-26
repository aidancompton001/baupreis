#!/bin/bash
# BauPreis AI — Daily PostgreSQL Backup
# Add to crontab: 0 3 * * * /root/baupreis/scripts/backup-db.sh
# Keeps last 7 days of backups

set -euo pipefail

BACKUP_DIR="/root/baupreis/backups"
CONTAINER="baupreis-postgres-1"
DB_NAME="baupreis"
DB_USER="baupreis"
RETENTION_DAYS=7

mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="baupreis_${TIMESTAMP}.sql.gz"

echo "[$(date)] Starting backup..."

docker exec "$CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_DIR/$FILENAME"

SIZE=$(du -h "$BACKUP_DIR/$FILENAME" | cut -f1)
echo "[$(date)] Backup created: $FILENAME ($SIZE)"

# Remove backups older than RETENTION_DAYS
find "$BACKUP_DIR" -name "baupreis_*.sql.gz" -mtime +"$RETENTION_DAYS" -delete
echo "[$(date)] Old backups cleaned (>${RETENTION_DAYS} days)"

REMAINING=$(ls -1 "$BACKUP_DIR"/baupreis_*.sql.gz 2>/dev/null | wc -l)
echo "[$(date)] Backups on disk: $REMAINING"
