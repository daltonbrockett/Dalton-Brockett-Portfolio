package com.dalton.analytics.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * Resolves an IP address to a geographic location using the free ip-api.com service.
 * Free tier: 45 requests/minute (more than enough for a portfolio site).
 */
@Service
public class GeoLocationService {

    private final RestTemplate restTemplate = new RestTemplate();

    public record GeoResult(String country, String city, String region) {}

    /**
     * Look up geographic location for an IP address.
     * Returns a result with "Unknown" values if the lookup fails.
     */
    public GeoResult lookup(String ip) {
        try {
            // Skip geolocation for localhost/private IPs
            if (ip == null || ip.equals("127.0.0.1") || ip.equals("0:0:0:0:0:0:0:1")
                    || ip.startsWith("192.168.") || ip.startsWith("10.")) {
                return new GeoResult("Local", "Local", "Local");
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(
                "http://ip-api.com/json/{ip}?fields=status,country,regionName,city",
                Map.class,
                ip
            );

            if (response != null && "success".equals(response.get("status"))) {
                return new GeoResult(
                    (String) response.get("country"),
                    (String) response.get("city"),
                    (String) response.get("regionName")
                );
            }
        } catch (Exception e) {
            // Geolocation is best-effort — don't fail the request if it's down
        }

        return new GeoResult(null, null, null);
    }
}
