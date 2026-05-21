package com.dalton.analytics.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Native SQL queries for the analytics dashboard.
 *
 * Uses JdbcTemplate for complex aggregation queries that require
 * PostgreSQL-specific features not expressible through JPA/JPQL.
 */
@Repository
public class DashboardRepository {

    private final JdbcTemplate jdbc;

    public DashboardRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // ==================== OVERVIEW ====================

    /**
     * Aggregate overview statistics for the dashboard header cards.
     */
    public Map<String, Object> getOverview() {
        return jdbc.queryForMap(
            """
            SELECT
                COUNT(*) AS total_sessions,
                COUNT(*) FILTER (WHERE entered_site = TRUE) AS entered_sessions,
                COUNT(*) FILTER (WHERE entered_site = FALSE) AS bounced_sessions,
                ROUND(
                    100.0 * COUNT(*) FILTER (WHERE entered_site = FALSE)
                    / NULLIF(COUNT(*), 0), 1
                ) AS bounce_rate,
                ROUND(
                    AVG(EXTRACT(EPOCH FROM (ended_at - started_at)))
                    FILTER (WHERE ended_at IS NOT NULL), 1
                ) AS avg_duration_seconds,
                COUNT(*) FILTER (
                    WHERE started_at >= CURRENT_DATE
                ) AS visitors_today
            FROM sessions
            """
        );
    }

    // ==================== REFERRERS ====================

    /**
     * Top traffic sources ranked by visit count.
     */
    public List<Map<String, Object>> getReferrers() {
        return jdbc.queryForList(
            """
            SELECT
                COALESCE(referrer, 'Direct') AS source,
                COUNT(*) AS visit_count
            FROM sessions
            GROUP BY referrer
            ORDER BY visit_count DESC
            LIMIT 20
            """
        );
    }

    // ==================== POPULAR NODES ====================

    /**
     * Most-clicked portfolio items, extracted from event data.
     */
    public List<Map<String, Object>> getPopularNodes() {
        return jdbc.queryForList(
            """
            SELECT
                event_data ->> 'role' AS role,
                event_data ->> 'org' AS organization,
                COUNT(*) AS click_count
            FROM events
            WHERE event_type = 'node_click'
              AND event_data ->> 'role' IS NOT NULL
            GROUP BY event_data ->> 'role', event_data ->> 'org'
            ORDER BY click_count DESC
            LIMIT 20
            """
        );
    }

    // ==================== GEOGRAPHY ====================

    /**
     * Visitor distribution by country and city.
     */
    public List<Map<String, Object>> getGeoStats() {
        return jdbc.queryForList(
            """
            SELECT
                COALESCE(country, 'Unknown') AS country,
                COALESCE(city, 'Unknown') AS city,
                COUNT(*) AS visit_count
            FROM sessions
            GROUP BY country, city
            ORDER BY visit_count DESC
            LIMIT 50
            """
        );
    }

    // ==================== DEVICES ====================

    /**
     * Browser, OS, and device type breakdown as three separate ranked lists.
     */
    public Map<String, Object> getDeviceStats() {
        List<Map<String, Object>> browsers = jdbc.queryForList(
            """
            SELECT COALESCE(browser, 'Unknown') AS name, COUNT(*) AS count
            FROM sessions GROUP BY browser ORDER BY count DESC LIMIT 10
            """
        );
        List<Map<String, Object>> operatingSystems = jdbc.queryForList(
            """
            SELECT COALESCE(os, 'Unknown') AS name, COUNT(*) AS count
            FROM sessions GROUP BY os ORDER BY count DESC LIMIT 10
            """
        );
        List<Map<String, Object>> deviceTypes = jdbc.queryForList(
            """
            SELECT COALESCE(device_type, 'Unknown') AS name, COUNT(*) AS count
            FROM sessions GROUP BY device_type ORDER BY count DESC
            """
        );
        return Map.of(
            "browsers", browsers,
            "operatingSystems", operatingSystems,
            "deviceTypes", deviceTypes
        );
    }

    // ==================== TIMELINE ====================

    /**
     * Visits per day for the last 30 days.
     */
    public List<Map<String, Object>> getTimeline() {
        return jdbc.queryForList(
            """
            SELECT
                DATE_TRUNC('day', started_at) AS day,
                COUNT(*) AS visit_count
            FROM sessions
            WHERE started_at >= NOW() - INTERVAL '30 days'
            GROUP BY DATE_TRUNC('day', started_at)
            ORDER BY day ASC
            """
        );
    }

    // ==================== JOURNEYS ====================

    /**
     * Full chronological event sequence for a specific session.
     */
    public List<Map<String, Object>> getJourney(UUID sessionId) {
        return jdbc.queryForList(
            """
            SELECT
                s.id AS session_id,
                s.started_at,
                s.referrer,
                s.country,
                s.browser,
                e.event_type,
                e.event_data,
                e.created_at AS event_time
            FROM sessions s
            JOIN events e ON e.session_id = s.id
            WHERE s.id = ?
            ORDER BY e.created_at ASC
            """,
            sessionId
        );
    }

    // ==================== SESSIONS LIST ====================

    /**
     * Paginated list of recent sessions.
     */
    public List<Map<String, Object>> getSessionsList(int page, int pageSize) {
        int offset = (page - 1) * pageSize;
        return jdbc.queryForList(
            """
            SELECT id, started_at, ended_at, referrer, country, city,
                   browser, os, device_type, entered_site
            FROM sessions
            ORDER BY started_at DESC
            LIMIT ? OFFSET ?
            """,
            pageSize, offset
        );
    }
}
