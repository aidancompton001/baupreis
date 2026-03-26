-- Migration: PayPal → Paddle
-- Run on production: psql -U baupreis -d baupreis -f 002_paypal_to_paddle.sql

ALTER TABLE organizations RENAME COLUMN paypal_payer_id TO paddle_customer_id;
ALTER TABLE organizations RENAME COLUMN paypal_subscription_id TO paddle_subscription_id;
ALTER TABLE organizations RENAME COLUMN paypal_plan_id TO paddle_price_id;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS paddle_status VARCHAR(20) DEFAULT 'none';

DROP INDEX IF EXISTS idx_org_paypal;
CREATE INDEX IF NOT EXISTS idx_org_paddle ON organizations(paddle_subscription_id);
