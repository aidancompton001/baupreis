-- Add multilingual explanation columns to analysis table
ALTER TABLE analysis ADD COLUMN IF NOT EXISTS explanation_en TEXT;
ALTER TABLE analysis ADD COLUMN IF NOT EXISTS explanation_ru TEXT;
