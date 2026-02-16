-- Migration: Stripe → PayPal
-- Run on existing database before deploying new code

ALTER TABLE organizations RENAME COLUMN stripe_customer_id TO paypal_payer_id;
ALTER TABLE organizations RENAME COLUMN stripe_subscription_id TO paypal_subscription_id;
ALTER TABLE organizations RENAME COLUMN stripe_price_id TO paypal_plan_id;

DROP INDEX IF EXISTS idx_org_stripe;
CREATE INDEX idx_org_paypal ON organizations(paypal_subscription_id);
