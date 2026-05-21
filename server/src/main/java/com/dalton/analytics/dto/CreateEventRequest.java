package com.dalton.analytics.dto;

import java.util.Map;
import java.util.UUID;

/**
 * Request body for POST /api/analytics/events.
 *
 * @param sessionId the session this event belongs to
 * @param eventType the type of interaction (e.g., "node_click", "enter_click")
 * @param eventData flexible key-value payload specific to the event type
 */
public record CreateEventRequest(
    UUID sessionId,
    String eventType,
    Map<String, Object> eventData
) {}
