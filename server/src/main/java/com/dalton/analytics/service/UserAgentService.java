package com.dalton.analytics.service;

import org.springframework.stereotype.Service;
import ua_parser.Client;
import ua_parser.Parser;

/**
 * Parses User-Agent strings into browser, OS, and device type.
 * Uses the ua-parser library (same regex database used by Google Analytics).
 */
@Service
public class UserAgentService {

    private final Parser parser = new Parser();

    public record UserAgentResult(String browser, String os, String deviceType) {}

    /**
     * Parse a User-Agent string into its components.
     */
    public UserAgentResult parse(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) {
            return new UserAgentResult("Unknown", "Unknown", "Unknown");
        }

        try {
            Client client = parser.parse(userAgent);

            String browser = client.userAgent != null && client.userAgent.family != null
                ? client.userAgent.family
                : "Unknown";

            String os = client.os != null && client.os.family != null
                ? client.os.family
                : "Unknown";

            String deviceType = inferDeviceType(userAgent, client);

            return new UserAgentResult(browser, os, deviceType);
        } catch (Exception e) {
            return new UserAgentResult("Unknown", "Unknown", "Unknown");
        }
    }

    /**
     * Infer device type from the User-Agent string and parsed client data.
     * ua-parser doesn't directly classify desktop/mobile/tablet,
     * so we use heuristics on the UA string.
     */
    private String inferDeviceType(String userAgent, Client client) {
        String ua = userAgent.toLowerCase();

        if (ua.contains("mobile") || ua.contains("android") && !ua.contains("tablet")) {
            return "mobile";
        }
        if (ua.contains("tablet") || ua.contains("ipad")) {
            return "tablet";
        }
        return "desktop";
    }
}
