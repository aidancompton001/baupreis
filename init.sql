-- ============================================================
-- BauPreis AI SaaS — Multi-tenant Database Schema
-- PostgreSQL 16
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============ ORGANIZATIONS (TENANTS) ============
CREATE TABLE organizations (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                    VARCHAR(200) NOT NULL,
    slug                    VARCHAR(100) UNIQUE NOT NULL,
    plan                    VARCHAR(20) DEFAULT 'trial',
    -- plan: 'trial', 'basis', 'pro', 'team', 'cancelled'
    paypal_payer_id         VARCHAR(100),
    paypal_subscription_id  VARCHAR(100),
    paypal_plan_id          VARCHAR(100),
    max_materials           INTEGER DEFAULT 5,
    max_users               INTEGER DEFAULT 1,
    max_alerts              INTEGER DEFAULT 3,
    features_telegram       BOOLEAN DEFAULT false,
    features_forecast       BOOLEAN DEFAULT false,
    features_api            BOOLEAN DEFAULT false,
    features_pdf_reports    BOOLEAN DEFAULT false,
    telegram_chat_id        VARCHAR(100),
    vat_id                  VARCHAR(50),
    billing_street          VARCHAR(200),
    billing_city            VARCHAR(100),
    billing_zip             VARCHAR(20),
    billing_country         VARCHAR(100),
    is_active               BOOLEAN DEFAULT true,
    trial_ends_at           TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_org_slug ON organizations(slug);
CREATE INDEX idx_org_paypal ON organizations(paypal_subscription_id);

-- ============ USERS ============
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    clerk_user_id   VARCHAR(100) UNIQUE NOT NULL,
    email           VARCHAR(200) NOT NULL,
    name            VARCHAR(200),
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    phone           VARCHAR(50),
    position_title  VARCHAR(100),
    role            VARCHAR(20) DEFAULT 'owner',
    -- role: 'owner', 'admin', 'member'
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_org ON users(org_id);
CREATE INDEX idx_users_clerk ON users(clerk_user_id);

-- ============ MATERIALS (SHARED) ============
CREATE TABLE materials (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code            VARCHAR(50) UNIQUE NOT NULL,
    name_de         VARCHAR(200) NOT NULL,
    name_ru         VARCHAR(200),
    category        VARCHAR(50) NOT NULL,
    unit            VARCHAR(20) NOT NULL,
    lme_symbol      VARCHAR(20),
    destatis_code   VARCHAR(20),
    metals_dev_key  VARCHAR(50),
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============ PRICES (SHARED) ============
CREATE TABLE prices (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id     UUID NOT NULL REFERENCES materials(id),
    timestamp       TIMESTAMPTZ NOT NULL,
    price_eur       DECIMAL(12,2) NOT NULL,
    price_usd       DECIMAL(12,2),
    source          VARCHAR(50) NOT NULL,
    raw_json        JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_prices_material_time ON prices(material_id, timestamp DESC);
CREATE INDEX idx_prices_source ON prices(source);

-- ============ ANALYSIS (SHARED) ============
CREATE TABLE analysis (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id     UUID REFERENCES materials(id),
    timestamp       TIMESTAMPTZ NOT NULL,
    trend           VARCHAR(20),
    change_pct_7d   DECIMAL(6,2),
    change_pct_30d  DECIMAL(6,2),
    forecast_json   JSONB NOT NULL,
    explanation_de  TEXT,
    recommendation  VARCHAR(50),
    confidence      INTEGER CHECK (confidence BETWEEN 0 AND 100),
    model_version   VARCHAR(50),
    prompt_tokens   INTEGER,
    completion_tokens INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analysis_material_time ON analysis(material_id, timestamp DESC);

-- ============ ALERT RULES (PER-ORG) ============
CREATE TABLE alert_rules (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    material_id     UUID REFERENCES materials(id),
    rule_type       VARCHAR(30) NOT NULL,
    threshold_pct   DECIMAL(6,2),
    time_window     VARCHAR(20),
    channel         VARCHAR(20) NOT NULL,
    priority        VARCHAR(10) DEFAULT 'medium',
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alert_rules_org ON alert_rules(org_id);

-- ============ ALERTS SENT (PER-ORG) ============
CREATE TABLE alerts_sent (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    rule_id         UUID REFERENCES alert_rules(id),
    material_id     UUID REFERENCES materials(id),
    message_text    TEXT NOT NULL,
    channel         VARCHAR(20) NOT NULL,
    sent_at         TIMESTAMPTZ DEFAULT NOW(),
    delivery_status VARCHAR(20) DEFAULT 'sent'
);

CREATE INDEX idx_alerts_sent_org ON alerts_sent(org_id);

-- ============ REPORTS (PER-ORG) ============
CREATE TABLE reports (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    report_type     VARCHAR(20) NOT NULL,
    period_start    DATE NOT NULL,
    period_end      DATE NOT NULL,
    content_json    JSONB NOT NULL,
    content_html    TEXT,
    sent_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_org ON reports(org_id);

-- ============ ORG MATERIALS (PER-ORG) ============
CREATE TABLE org_materials (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    material_id     UUID NOT NULL REFERENCES materials(id),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(org_id, material_id)
);

CREATE INDEX idx_org_materials ON org_materials(org_id);

-- ============ TELEGRAM PENDING CONNECTIONS ============
CREATE TABLE telegram_pending_connections (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code            VARCHAR(20) UNIQUE NOT NULL,
    org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '5 minutes'),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_telegram_pending_code ON telegram_pending_connections(code);

-- ============ SEED DATA: MATERIALS ============
INSERT INTO materials (code, name_de, name_ru, category, unit, lme_symbol, metals_dev_key) VALUES
    ('steel_rebar',   'Bewehrungsstahl BSt 500',   'Арматура BSt 500',      'steel',      'EUR/t',   NULL, NULL),
    ('steel_beam',    'Stahlträger HEB/IPE',       'Стальные балки HEB/IPE', 'steel',      'EUR/t',   NULL, NULL),
    ('copper_lme',    'Kupfer (LME 3-Monats)',     'Медь (LME 3 мес.)',     'metal',      'EUR/t',   'LME-XCU', 'copper'),
    ('aluminum_lme',  'Aluminium (LME 3-Monats)',  'Алюминий (LME 3 мес.)', 'metal',      'EUR/t',   'LME-XAL', 'aluminum'),
    ('zinc_lme',      'Zink (LME 3-Monats)',       'Цинк (LME 3 мес.)',    'metal',      'EUR/t',   'LME-XZN', 'zinc'),
    ('nickel_lme',    'Nickel (LME 3-Monats)',     'Никель (LME 3 мес.)',   'metal',      'EUR/t',   'LME-XNI', 'nickel'),
    ('concrete_c25',  'Transportbeton C25/30',     'Товарный бетон C25/30', 'concrete',   'EUR/m³',  NULL, NULL),
    ('cement_cem2',   'Zement CEM II/B-LL',        'Цемент CEM II/B-LL',   'concrete',   'EUR/t',   NULL, NULL),
    ('wood_kvh',      'Konstruktionsvollholz C24', 'KVH C24',               'wood',       'EUR/m³',  NULL, NULL),
    ('wood_bsh',      'Brettschichtholz GL24h',    'BSH GL24h',             'wood',       'EUR/m³',  NULL, NULL),
    ('wood_osb',      'OSB/3 Platten 18mm',        'OSB/3 плиты 18мм',     'wood',       'EUR/m²',  NULL, NULL),
    ('insulation_eps','EPS WLG 035',               'EPS WLG 035',           'insulation', 'EUR/m³',  NULL, NULL),
    ('insulation_xps','XPS 300kPa',                'XPS 300кПа',            'insulation', 'EUR/m³',  NULL, NULL),
    ('insulation_mw', 'Mineralwolle WLG 035',      'Минвата WLG 035',      'insulation', 'EUR/m³',  NULL, NULL),
    ('diesel',        'Diesel (Großhandel)',        'Дизель (опт)',          'energy',     'EUR/l',   NULL, NULL),
    ('electricity',   'Industriestrom',             'Электроэнергия (пром.)', 'energy',    'EUR/MWh', NULL, NULL);

-- ============ PLAN DEFINITIONS ============
CREATE TABLE plans (
    id          VARCHAR(20) PRIMARY KEY,
    name_de     VARCHAR(50) NOT NULL,
    price_monthly DECIMAL(8,2) NOT NULL,
    price_yearly DECIMAL(8,2) NOT NULL,
    max_materials INTEGER NOT NULL,
    max_users   INTEGER NOT NULL,
    max_alerts  INTEGER NOT NULL,
    features    JSONB NOT NULL
);

INSERT INTO plans (id, name_de, price_monthly, price_yearly, max_materials, max_users, max_alerts, features) VALUES
('basis', 'Basis',  49,   470,  5,  1,  3,  '{"telegram": false, "forecast": false, "api": false, "pdf_reports": false, "update_frequency": 2}'),
('pro',   'Pro',    149,  1430, 99, 1,  999,'{"telegram": true, "forecast": true, "api": false, "pdf_reports": false, "update_frequency": 4}'),
('team',  'Team',   299,  2870, 99, 5,  999,'{"telegram": true, "forecast": true, "api": true, "pdf_reports": true, "update_frequency": 4}');

-- ============ API KEYS (PER-ORG) ============
CREATE TABLE api_keys (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    key_hash        VARCHAR(64) NOT NULL,
    key_prefix      VARCHAR(20) NOT NULL,
    last_used_at    TIMESTAMPTZ,
    expires_at      TIMESTAMPTZ,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_org ON api_keys(org_id);

-- ============ TEAM INVITES (PER-ORG) ============
CREATE TABLE invites (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email           VARCHAR(200) NOT NULL,
    role            VARCHAR(20) DEFAULT 'member',
    token           VARCHAR(64) UNIQUE NOT NULL,
    invited_by      UUID REFERENCES users(id),
    status          VARCHAR(20) DEFAULT 'pending',
    expires_at      TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_invites_token ON invites(token);
CREATE INDEX idx_invites_org ON invites(org_id);

-- ============ BAUPREIS INDEX (SHARED) ============
CREATE TABLE baupreis_index (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date            DATE UNIQUE NOT NULL,
    index_value     DECIMAL(10,2) NOT NULL,
    change_pct_1d   DECIMAL(6,2),
    change_pct_7d   DECIMAL(6,2),
    change_pct_30d  DECIMAL(6,2),
    components_json JSONB NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_baupreis_index_date ON baupreis_index(date DESC);

-- ============ WHATSAPP PENDING VERIFICATIONS ============
CREATE TABLE whatsapp_pending_verifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    phone           VARCHAR(20) NOT NULL,
    code            VARCHAR(6) NOT NULL,
    expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '5 minutes'),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_whatsapp_pending_org ON whatsapp_pending_verifications(org_id);

-- Add whatsapp_phone column to organizations
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS whatsapp_phone VARCHAR(20);
