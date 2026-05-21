package com.dalton.analytics.dto;

/**
 * Request body for POST /api/analytics/sessions.
 *
 * Contains client-side metadata that the browser provides.
 * Server-side data (IP, User-Agent, Referer) is extracted from HTTP headers.
 *
 * @param timezone     visitor's timezone (e.g., "America/Los_Angeles")
 * @param language     browser language (e.g., "en-US")
 * @param screenWidth  screen width in pixels
 * @param screenHeight screen height in pixels
 */
public record CreateSessionRequest(
    String timezone,
    String language,
    Integer screenWidth,
    Integer screenHeight
) {}
