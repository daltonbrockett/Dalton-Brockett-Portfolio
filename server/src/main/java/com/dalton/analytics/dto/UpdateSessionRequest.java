package com.dalton.analytics.dto;

/**
 * Request body for PATCH /api/analytics/sessions/{id}.
 *
 * @param enteredSite set to true when the visitor enters the portfolio
 * @param ended       set to true when the visitor leaves the page
 */
public record UpdateSessionRequest(
    Boolean enteredSite,
    Boolean ended
) {}
