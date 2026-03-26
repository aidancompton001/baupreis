-- Custom alloy formulas (user-created compositions)
CREATE TABLE IF NOT EXISTS alloy_formulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  composition JSONB NOT NULL,  -- {"Cu": 0.63, "Zn": 0.37}
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alloy_formulas_org ON alloy_formulas(org_id);
