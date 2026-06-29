package com.dalton.analytics.service;

import com.dalton.analytics.dto.CreateEventRequest;
import com.dalton.analytics.dto.CreateSessionRequest;
import com.dalton.analytics.dto.UpdateSessionRequest;
import com.dalton.analytics.entity.Event;
import com.dalton.analytics.entity.Session;
import com.dalton.analytics.repository.DashboardRepository;
import com.dalton.analytics.repository.EventRepository;
import com.dalton.analytics.repository.SessionRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Core analytics service — orchestrates session creation, event logging,
 * and dashboard data retrieval.
 */
@Service
public class AnalyticsService {

    @Value("${analytics.ip-salt:}")
    private String ipSalt;

    private final SessionRepository sessionRepo;
    private final EventRepository eventRepo;
    private final DashboardRepository dashboardRepo;
    private final GeoLocationService geoService;
    private final UserAgentService uaService;

    /**
     * @param sessionRepo   JPA repository for session CRUD
     * @param eventRepo     JPA repository for event CRUD
     * @param dashboardRepo native SQL queries for analytics aggregation
     * @param geoService    IP geolocation service
     * @param uaService     User-Agent parsing service
     */
    public AnalyticsService(SessionRepository sessionRepo,
                            EventRepository eventRepo,
                            DashboardRepository dashboardRepo,
                            GeoLocationService geoService,
                            UserAgentService uaService) {
        this.sessionRepo = sessionRepo;
        this.eventRepo = eventRepo;
        this.dashboardRepo = dashboardRepo;
        this.geoService = geoService;
        this.uaService = uaService;
    }

    // ==================== SESSION OPERATIONS ====================

    /**
     * Create a new analytics session for a site visitor.
     *
     * Extracts visitor metadata from the HTTP request and client-provided data,
     * persists a new session, and returns the generated session identifier.
     */
    public UUID createSession(CreateSessionRequest request, HttpServletRequest httpRequest) {
        // Extract and hash the IP address for privacy
        String ip = extractClientIp(httpRequest);
        String ipHash = hashIp(ip);

        // Geolocate the IP address
        GeoLocationService.GeoResult geo = geoService.lookup(ip);

        // Parse the User-Agent string
        String userAgent = httpRequest.getHeader("User-Agent");
        UserAgentService.UserAgentResult ua = uaService.parse(userAgent);

        // Get the referrer (note: HTTP header is "Referer" — a historical typo in the spec)
        String referrer = httpRequest.getHeader("Referer");

        // Create and save the session entity
        Session session = new Session(
            ipHash, userAgent, referrer,
            ua.browser(), ua.os(), ua.deviceType(),
            geo.country(), geo.city(), geo.region(),
            request.timezone(), request.language(),
            request.screenWidth(), request.screenHeight()
        );

        Session saved = sessionRepo.save(session);
        return saved.getId();
    }

    /**
     * Update an existing session (mark as entered or ended).
     */
    public void updateSession(UUID sessionId, UpdateSessionRequest request) {
        Session session = sessionRepo.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));

        if (Boolean.TRUE.equals(request.enteredSite())) {
            session.setEnteredSite(true);
        }
        if (Boolean.TRUE.equals(request.ended())) {
            session.setEndedAt(Instant.now());
        }

        sessionRepo.save(session);
    }

    // ==================== EVENT OPERATIONS ====================

    /**
     * Log an analytics event for a session.
     */
    public void logEvent(CreateEventRequest request) {
        Session session = sessionRepo.findById(request.sessionId())
            .orElseThrow(() -> new RuntimeException("Session not found: " + request.sessionId()));

        Event event = new Event(session, request.eventType(), request.eventData());

        eventRepo.save(event);
    }

    // ==================== DASHBOARD QUERIES ====================

    /** @see DashboardRepository#getOverview() */
    public Map<String, Object> getOverview() {
        return dashboardRepo.getOverview();
    }

    /** @see DashboardRepository#getReferrers() */
    public List<Map<String, Object>> getReferrers() {
        return dashboardRepo.getReferrers();
    }

    /** @see DashboardRepository#getPopularNodes() */
    public List<Map<String, Object>> getPopularNodes() {
        return dashboardRepo.getPopularNodes();
    }

    /** @see DashboardRepository#getGeoStats() */
    public List<Map<String, Object>> getGeoStats() {
        return dashboardRepo.getGeoStats();
    }

    /** @see DashboardRepository#getDeviceStats() */
    public Map<String, Object> getDeviceStats() {
        return dashboardRepo.getDeviceStats();
    }

    /** @see DashboardRepository#getTimeline() */
    public List<Map<String, Object>> getTimeline() {
        return dashboardRepo.getTimeline();
    }

    /** @see DashboardRepository#getJourney(UUID) */
    public List<Map<String, Object>> getJourney(UUID sessionId) {
        return dashboardRepo.getJourney(sessionId);
    }

    /** @see DashboardRepository#getSessionsList(int, int) */
    public List<Map<String, Object>> getSessionsList(int page, int pageSize) {
        return dashboardRepo.getSessionsList(page, pageSize);
    }

    // ==================== UTILITIES ====================

    /**
     * Extract the real client IP, handling reverse proxies.
     */
    private String extractClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    /**
     * Hash an IP address with SHA-256 + salt for privacy.
     */
    private String hashIp(String ip) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String saltedIp = ip + (ipSalt != null ? ipSalt : "");
            byte[] hash = digest.digest(saltedIp.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }
}
