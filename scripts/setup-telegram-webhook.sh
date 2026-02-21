#!/usr/bin/env bash
# Register the Telegram bot webhook with Telegram's API.
# Run once after deployment, or after changing the domain/secret.
#
# Usage: ./scripts/setup-telegram-webhook.sh
#
# Requires env vars: TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET
# Optional: DOMAIN (default: baupreis.ais152.com)

set -euo pipefail

# Source .env if it exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | grep -v '^\s*$' | xargs)
fi

if [ -z "${TELEGRAM_BOT_TOKEN:-}" ]; then
  echo "ERROR: TELEGRAM_BOT_TOKEN is not set"
  exit 1
fi

if [ -z "${TELEGRAM_WEBHOOK_SECRET:-}" ]; then
  echo "ERROR: TELEGRAM_WEBHOOK_SECRET is not set"
  exit 1
fi

DOMAIN="${DOMAIN:-baupreis.ais152.com}"
WEBHOOK_URL="https://${DOMAIN}/api/webhook/telegram"

echo "Registering Telegram webhook..."
echo "  URL: ${WEBHOOK_URL}"
echo ""

echo "=== setWebhook ==="
curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -d "url=${WEBHOOK_URL}" \
  -d "secret_token=${TELEGRAM_WEBHOOK_SECRET}" \
  -d "allowed_updates=[\"message\"]"

echo ""
echo ""
echo "=== getWebhookInfo ==="
curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo"
echo ""
