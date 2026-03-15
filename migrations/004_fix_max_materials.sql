-- Fix magic number 99 for max_materials
-- Trial/Pro/Team should use 999 (unlimited) instead of confusing 99
UPDATE organizations SET max_materials = 999 WHERE plan IN ('trial', 'pro', 'team') AND max_materials = 99;
UPDATE plans SET max_materials = 999 WHERE id IN ('trial', 'pro', 'team') AND max_materials = 99;
