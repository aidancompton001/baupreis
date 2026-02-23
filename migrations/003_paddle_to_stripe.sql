-- Migration: Paddle → Stripe
-- Rename paddle_* columns to stripe_* columns in organizations table

ALTER TABLE organizations RENAME COLUMN paddle_customer_id TO stripe_customer_id;
ALTER TABLE organizations RENAME COLUMN paddle_subscription_id TO stripe_subscription_id;
ALTER TABLE organizations RENAME COLUMN paddle_price_id TO stripe_price_id;
ALTER TABLE organizations RENAME COLUMN paddle_status TO stripe_status;

DROP INDEX IF EXISTS idx_org_paddle;
CREATE INDEX idx_org_stripe ON organizations(stripe_subscription_id);
