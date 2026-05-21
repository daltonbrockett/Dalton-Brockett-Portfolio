package com.dalton.analytics.dto;

import java.util.UUID;

/**
 * Response body for POST /api/analytics/sessions.
 *
 * @param sessionId the generated UUID for the new session
 */
public record CreateSessionResponse(UUID sessionId) {}
