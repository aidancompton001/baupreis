-- Add preferences JSONB column to users table
-- Used for: tour_completed, UI settings, notification preferences
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';
