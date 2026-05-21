package com.dalton.analytics.controller;

import com.dalton.analytics.dto.CreateEventRequest;
import com.dalton.analytics.service.AnalyticsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Handles event logging.
 *
 * POST /api/analytics/events → Log an analytics event
 */
@RestController
@RequestMapping("/api/analytics")
public class EventController {

    private final AnalyticsService service;

    /**
     * @param service the analytics service that handles event persistence
     */
    public EventController(AnalyticsService service) {
        this.service = service;
    }

    /**
     * Log a single analytics event for an active session.
     *
     * Supported event types:
     *   - "enter_click"    — clicked "Enter" on the landing page
     *   - "node_click"     — clicked a portfolio item in the 3D scene
     *   - "detail_view"    — opened the project details overlay
     *   - "link_click"     — clicked an external link
     *   - "orbit_interact" — dragged or zoomed the 3D camera
     *   - "session_end"    — visitor left the page
     *
     * @param request contains sessionId, eventType, and a flexible eventData map
     * @return 201 Created with no body
     */
    @PostMapping("/events")
    public ResponseEntity<Void> logEvent(@RequestBody CreateEventRequest request) {
        service.logEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
