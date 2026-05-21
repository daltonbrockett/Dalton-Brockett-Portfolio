package com.dalton.analytics.controller;

import com.dalton.analytics.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Dashboard API — all GET endpoints for the analytics dashboard.
 * Protected by a simple password check via the Authorization header.
 *
 * All endpoints require: Authorization: Bearer {analytics.dashboard-password}
 */
@RestController
@RequestMapping("/api/analytics")
public class DashboardController {

    private final AnalyticsService service;

    @Value("${analytics.dashboard-password}")
    private String dashboardPassword;

    /**
     * @param service the analytics service providing aggregated dashboard data
     */
    public DashboardController(AnalyticsService service) {
        this.service = service;
    }

    // ==================== AUTH CHECK ====================

    /**
     * Verify the Authorization header matches the dashboard password.
     * Returns null if authorized, or a 401 response if not.
     */
    private ResponseEntity<?> checkAuth(String authHeader) {
        String expected = "Bearer " + dashboardPassword;
        if (authHeader == null || !authHeader.equals(expected)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Unauthorized"));
        }
        return null; // Authorized
    }

    // ==================== ENDPOINTS ====================

    /**
     * High-level overview statistics for the dashboard header cards.
     *
     * @param auth Bearer token for dashboard access
     * @return total sessions, bounce rate, avg duration, and visitors today; or 401 if unauthorized
     */
    @GetMapping("/overview")
    public ResponseEntity<?> getOverview(@RequestHeader(value = "Authorization", required = false) String auth) {
        ResponseEntity<?> denied = checkAuth(auth);
        if (denied != null) return denied;

        return ResponseEntity.ok(service.getOverview());
    }

    /**
     * Top traffic sources ranked by visit count.
     *
     * @return JSON array of {source, visit_count}, or 401 if unauthorized
     */
    @GetMapping("/referrers")
    public ResponseEntity<?> getReferrers(@RequestHeader(value = "Authorization", required = false) String auth) {
        ResponseEntity<?> denied = checkAuth(auth);
        if (denied != null) return denied;

        return ResponseEntity.ok(service.getReferrers());
    }

    /**
     * Most-clicked portfolio items ranked by engagement.
     *
     * @return JSON array of {role, organization, click_count}, or 401 if unauthorized
     */
    @GetMapping("/popular-nodes")
    public ResponseEntity<?> getPopularNodes(@RequestHeader(value = "Authorization", required = false) String auth) {
        ResponseEntity<?> denied = checkAuth(auth);
        if (denied != null) return denied;

        return ResponseEntity.ok(service.getPopularNodes());
    }

    /**
     * Geographic distribution of visitors by country and city.
     *
     * @return JSON array of {country, city, visit_count}, or 401 if unauthorized
     */
    @GetMapping("/geo")
    public ResponseEntity<?> getGeoStats(@RequestHeader(value = "Authorization", required = false) String auth) {
        ResponseEntity<?> denied = checkAuth(auth);
        if (denied != null) return denied;

        return ResponseEntity.ok(service.getGeoStats());
    }

    /**
     * Browser, OS, and device type breakdown.
     *
     * @return JSON object with {browsers, operatingSystems, deviceTypes} lists, or 401 if unauthorized
     */
    @GetMapping("/devices")
    public ResponseEntity<?> getDeviceStats(@RequestHeader(value = "Authorization", required = false) String auth) {
        ResponseEntity<?> denied = checkAuth(auth);
        if (denied != null) return denied;

        return ResponseEntity.ok(service.getDeviceStats());
    }

    /**
     * Daily visit counts for the last 30 days.
     *
     * @return JSON array of {day, visit_count} in ascending chronological order, or 401 if unauthorized
     */
    @GetMapping("/timeline")
    public ResponseEntity<?> getTimeline(@RequestHeader(value = "Authorization", required = false) String auth) {
        ResponseEntity<?> denied = checkAuth(auth);
        if (denied != null) return denied;

        return ResponseEntity.ok(service.getTimeline());
    }

    /**
     * Full chronological event journey for a specific visitor session.
     *
     * @param sessionId the UUID of the session to retrieve
     * @return JSON array of events with session context, ordered chronologically; or 401 if unauthorized
     */
    @GetMapping("/journeys/{sessionId}")
    public ResponseEntity<?> getJourney(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable UUID sessionId) {
        ResponseEntity<?> denied = checkAuth(auth);
        if (denied != null) return denied;

        return ResponseEntity.ok(service.getJourney(sessionId));
    }

    /**
     * Paginated list of recent sessions.
     *
     * @param page     1-indexed page number (default: 1)
     * @param pageSize number of sessions per page (default: 20)
     * @return JSON array of session summaries sorted by most recent first, or 401 if unauthorized
     */
    @GetMapping("/sessions-list")
    public ResponseEntity<?> getSessionsList(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {
        ResponseEntity<?> denied = checkAuth(auth);
        if (denied != null) return denied;

        return ResponseEntity.ok(service.getSessionsList(page, pageSize));
    }
}
