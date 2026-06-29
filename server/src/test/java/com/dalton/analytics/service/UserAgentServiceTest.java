package com.dalton.analytics.service;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class UserAgentServiceTest {

    private final UserAgentService service = new UserAgentService();

    @Test
    void testParseChromeOnWindows() {
        String chromeWindowsUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
        UserAgentService.UserAgentResult result = service.parse(chromeWindowsUA);

        assertEquals("Chrome", result.browser());
        assertEquals("Windows", result.os());
        assertEquals("desktop", result.deviceType());
    }

    @Test
    void testParseSafariOnIphone() {
        String iPhoneUA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1";
        UserAgentService.UserAgentResult result = service.parse(iPhoneUA);

        assertEquals("Mobile Safari", result.browser());
        assertEquals("iOS", result.os());
        assertEquals("mobile", result.deviceType());
    }

    @Test
    void testParseSafariOnIpad() {
        String iPadUA = "Mozilla/5.0 (iPad; CPU OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1";
        UserAgentService.UserAgentResult result = service.parse(iPadUA);

        assertEquals("Mobile Safari", result.browser());
        assertEquals("iOS", result.os());
        assertEquals("tablet", result.deviceType());
    }

    @Test
    void testParseNullOrEmptyUserAgent() {
        UserAgentService.UserAgentResult nullResult = service.parse(null);
        assertEquals("Unknown", nullResult.browser());
        assertEquals("Unknown", nullResult.os());
        assertEquals("Unknown", nullResult.deviceType());

        UserAgentService.UserAgentResult emptyResult = service.parse("   ");
        assertEquals("Unknown", emptyResult.browser());
        assertEquals("Unknown", emptyResult.os());
        assertEquals("Unknown", emptyResult.deviceType());
    }
}
