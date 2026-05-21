-- V1: Create the sessions table
-- Stores one row per visitor session with metadata about their device, location, and engagement.

CREATE TABLE sessions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at      TIMESTAMPTZ,

    ip_hash       VARCHAR(64),
    user_agent    TEXT,
    referrer      TEXT,

    browser       VARCHAR(50),
    os            VARCHAR(50),
    device_type   VARCHAR(20),

    country       VARCHAR(100),
    city          VARCHAR(100),
    region        VARCHAR(100),

    timezone      VARCHAR(50),
    language      VARCHAR(20),
    screen_width  INTEGER,
    screen_height INTEGER,

    entered_site  BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_sessions_started_at ON sessions(started_at);
