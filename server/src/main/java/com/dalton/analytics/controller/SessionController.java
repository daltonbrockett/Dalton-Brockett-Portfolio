package com.dalton.analytics.controller;

import com.dalton.analytics.dto.CreateSessionRequest;
import com.dalton.analytics.dto.CreateSessionResponse;
import com.dalton.analytics.dto.UpdateSessionRequest;
import com.dalton.analytics.service.AnalyticsService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Handles session creation and updates.
 *
 * POST /api/analytics/sessions  → Create a new session
 * PATCH /api/analytics/sessions/{id} → Update session (entered, ended)
 */
@RestController
@RequestMapping("/api/analytics")
public class SessionController {

    private final AnalyticsService service;

    /**
     * @param service the analytics service handling session operations
     */
    public SessionController(AnalyticsService service) {
        this.service = service;
    }

    /**
     * Create a new analytics session when a visitor loads the portfolio.
     *
     * Server-side metadata (IP, User-Agent, Referer) is extracted from the HTTP request.
     * Client-side metadata (screen size, timezone, language) comes from the JSON body.
     *
     * @param request     client-side visitor metadata
     * @param httpRequest the raw HTTP request for server-side metadata extraction
     * @return 201 Created with the generated session UUID
     */
    @PostMapping("/sessions")
    public ResponseEntity<CreateSessionResponse> createSession(
            @RequestBody CreateSessionRequest request,
            HttpServletRequest httpRequest) {

        UUID sessionId = service.createSession(request, httpRequest);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(new CreateSessionResponse(sessionId));
    }

    /**
     * Partially update an existing session.
     *
     * Two use cases:
     * - Visitor clicks "Enter" on the landing page: {enteredSite: true}
     * - Visitor leaves the page: {ended: true}
     *
     * @param id      the session UUID from the URL path
     * @param request fields to update (enteredSite and/or ended)
     * @return 200 OK with no body
     */
    @PatchMapping("/sessions/{id}")
    public ResponseEntity<Void> updateSession(
            @PathVariable UUID id,
            @RequestBody UpdateSessionRequest request) {

        service.updateSession(id, request);
        return ResponseEntity.ok().build();
    }
}
