package com.dalton.analytics.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * JPA entity mapping to the "events" database table.
 *
 * Each event represents a single user interaction within a session.
 * The eventData field uses JSONB, allowing different event types to
 * carry different payload shapes without schema changes.
 */
@Entity
@Table(name = "events")
public class Event {

    /** Auto-incrementing primary key. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /** The session this event belongs to (many events → one session). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    /** The type of interaction (e.g., "node_click", "enter_click", "link_click"). */
    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType;

    /** Flexible event payload stored as JSONB. */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "event_data", columnDefinition = "jsonb")
    private Map<String, Object> eventData = new HashMap<>();

    /** When this event occurred. Set automatically by the database DEFAULT. */
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    // ==================== CONSTRUCTORS ====================

    /** Required by JPA for entity instantiation. */
    protected Event() {}

    /**
     * Create a new event for a session.
     *
     * @param session   the session this event belongs to (sets the foreign key)
     * @param eventType the interaction type
     * @param eventData flexible payload (stored as JSONB)
     */
    public Event(Session session, String eventType, Map<String, Object> eventData) {
        this.session = session;
        this.eventType = eventType;
        this.eventData = eventData != null ? eventData : new HashMap<>();
    }

    // ==================== GETTERS ====================

    public Integer getId() { return id; }
    public Session getSession() { return session; }
    public String getEventType() { return eventType; }
    public Map<String, Object> getEventData() { return eventData; }
    public Instant getCreatedAt() { return createdAt; }
}
