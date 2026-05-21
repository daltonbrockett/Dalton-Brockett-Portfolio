package com.dalton.analytics.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * JPA entity mapping to the "sessions" database table.
 *
 * Each instance represents a single visitor session, capturing metadata
 * about the visitor's device, location, referrer, and engagement.
 */
@Entity
@Table(name = "sessions")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /** When the session started. Immutable after creation. */
    @Column(name = "started_at", nullable = false, updatable = false)
    private Instant startedAt = Instant.now();

    /** When the session ended. NULL until the visitor leaves the page. */
    @Column(name = "ended_at")
    private Instant endedAt;

    /** SHA-256 hash of the visitor's IP address (privacy-friendly). */
    @Column(name = "ip_hash", length = 64)
    private String ipHash;

    /** Raw User-Agent string from the HTTP request. */
    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;

    /** Where the visitor came from (e.g., "https://linkedin.com/jobs/12345"). */
    @Column(columnDefinition = "TEXT")
    private String referrer;

    /** Parsed browser name (e.g., "Chrome", "Safari"). */
    @Column(length = 50)
    private String browser;

    /** Parsed operating system (e.g., "Mac OS X", "Windows"). */
    @Column(length = 50)
    private String os;

    /** Device category: "desktop", "mobile", or "tablet". */
    @Column(name = "device_type", length = 20)
    private String deviceType;

    /** Visitor's country from IP geolocation. */
    @Column(length = 100)
    private String country;

    /** Visitor's city from IP geolocation. */
    @Column(length = 100)
    private String city;

    /** Visitor's region/state from IP geolocation. */
    @Column(length = 100)
    private String region;

    /** Visitor's timezone (e.g., "America/Los_Angeles"). */
    @Column(length = 50)
    private String timezone;

    /** Visitor's browser language (e.g., "en-US"). */
    @Column(length = 20)
    private String language;

    /** Screen width in pixels. */
    @Column(name = "screen_width")
    private Integer screenWidth;

    /** Screen height in pixels. */
    @Column(name = "screen_height")
    private Integer screenHeight;

    /**
     * Whether the visitor clicked "Enter" on the landing page.
     * FALSE = bounced (saw landing page but didn't enter).
     * TRUE = engaged (entered the 3D portfolio experience).
     */
    @Column(name = "entered_site")
    private boolean enteredSite = false;

    // ==================== CONSTRUCTORS ====================

    /** Required by JPA for entity instantiation. */
    protected Session() {}

    /**
     * Create a new Session with all visitor metadata.
     * Called by AnalyticsService when a visitor first loads the portfolio.
     */
    public Session(String ipHash, String userAgent, String referrer,
                   String browser, String os, String deviceType,
                   String country, String city, String region,
                   String timezone, String language,
                   Integer screenWidth, Integer screenHeight) {
        this.ipHash = ipHash;
        this.userAgent = userAgent;
        this.referrer = referrer;
        this.browser = browser;
        this.os = os;
        this.deviceType = deviceType;
        this.country = country;
        this.city = city;
        this.region = region;
        this.timezone = timezone;
        this.language = language;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
    }

    // ==================== GETTERS & SETTERS ====================

    public UUID getId() { return id; }

    public Instant getStartedAt() { return startedAt; }

    public Instant getEndedAt() { return endedAt; }
    public void setEndedAt(Instant endedAt) { this.endedAt = endedAt; }

    public String getIpHash() { return ipHash; }
    public String getUserAgent() { return userAgent; }
    public String getReferrer() { return referrer; }
    public String getBrowser() { return browser; }
    public String getOs() { return os; }
    public String getDeviceType() { return deviceType; }
    public String getCountry() { return country; }
    public String getCity() { return city; }
    public String getRegion() { return region; }
    public String getTimezone() { return timezone; }
    public String getLanguage() { return language; }
    public Integer getScreenWidth() { return screenWidth; }
    public Integer getScreenHeight() { return screenHeight; }

    public boolean isEnteredSite() { return enteredSite; }
    public void setEnteredSite(boolean enteredSite) { this.enteredSite = enteredSite; }
}
