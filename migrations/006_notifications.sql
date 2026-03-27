-- Migration 006: In-App Notifications
-- Date: 2026-03-27
-- Task: T021 Notification Bell im Header

-- In-App notification table
CREATE TABLE IF NOT EXISTS notifications (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id      UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    type        VARCHAR(30) NOT NULL,
    title       TEXT NOT NULL,
    message     TEXT NOT NULL,
    link        VARCHAR(255),
    read_at     TIMESTAMPTZ DEFAULT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Partial index for fast unread count queries
CREATE INDEX IF NOT EXISTS idx_notifications_org_unread
    ON notifications(org_id, created_at DESC) WHERE read_at IS NULL;

-- General index for all notifications per org
CREATE INDEX IF NOT EXISTS idx_notifications_org_created
    ON notifications(org_id, created_at DESC);
