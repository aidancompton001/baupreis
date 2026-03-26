-- Migration 003: Reverse Trial — upgrade existing trial orgs to full Team-level access
-- Date: 2026-02-18
-- Description: Existing trial orgs get full access (Team limits) for remaining trial period.
--              New trial default is 7 days (already updated in init.sql).

-- 1. Update existing trial orgs to Team-level limits
UPDATE organizations SET
  max_materials = 99,
  max_users = 5,
  max_alerts = 999,
  features_telegram = true,
  features_forecast = true,
  features_api = true,
  features_pdf_reports = true
WHERE plan = 'trial';

-- 2. Add ALL active materials to existing trial orgs (skip duplicates)
INSERT INTO org_materials (org_id, material_id)
SELECT o.id, m.id
FROM organizations o
CROSS JOIN materials m
WHERE o.plan = 'trial'
  AND m.is_active = true
ON CONFLICT DO NOTHING;
