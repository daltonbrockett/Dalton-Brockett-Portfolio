-- V2: Create the events table
-- Stores every user interaction within a session.
-- The event_data JSONB column allows different event types to carry different payloads.

CREATE TABLE events (
    id            SERIAL PRIMARY KEY,
    session_id    UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    event_type    VARCHAR(50) NOT NULL,
    event_data    JSONB DEFAULT '{}',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_session_id ON events(session_id);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_created_at ON events(created_at);
