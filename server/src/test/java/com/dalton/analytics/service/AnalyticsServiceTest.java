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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private SessionRepository sessionRepo;

    @Mock
    private EventRepository eventRepo;

    @Mock
    private DashboardRepository dashboardRepo;

    @Mock
    private GeoLocationService geoService;

    @Mock
    private UserAgentService uaService;

    @InjectMocks
    private AnalyticsService service;

    private final String testSalt = "secure-salt-key-12345";

    @BeforeEach
    void setUp() {
        // Inject the @Value ipSalt field manually for unit tests
        ReflectionTestUtils.setField(service, "ipSalt", testSalt);
    }

    @Test
    void testCreateSession() {
        // Mock request context
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(request.getRemoteAddr()).thenReturn("192.0.2.1");
        when(request.getHeader("X-Forwarded-For")).thenReturn(null);
        when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0 Chrome");
        when(request.getHeader("Referer")).thenReturn("https://google.com");

        // Mock DTO
        CreateSessionRequest dto = new CreateSessionRequest("America/Los_Angeles", "en-US", 1920, 1080);

        // Mock collaborators
        when(geoService.lookup("192.0.2.1")).thenReturn(new GeoLocationService.GeoResult("United States", "Los Angeles", "California"));
        when(uaService.parse("Mozilla/5.0 Chrome")).thenReturn(new UserAgentService.UserAgentResult("Chrome", "Windows", "desktop"));

        // Mock repository save
        UUID expectedUuid = UUID.randomUUID();
        Session mockSession = mock(Session.class);
        when(mockSession.getId()).thenReturn(expectedUuid);
        when(sessionRepo.save(any(Session.class))).thenReturn(mockSession);

        // Run
        UUID sessionId = service.createSession(dto, request);

        // Verify
        assertEquals(expectedUuid, sessionId);
        ArgumentCaptor<Session> sessionCaptor = ArgumentCaptor.forClass(Session.class);
        verify(sessionRepo).save(sessionCaptor.capture());

        Session savedSession = sessionCaptor.getValue();
        assertEquals("United States", savedSession.getCountry());
        assertEquals("Los Angeles", savedSession.getCity());
        assertEquals("Chrome", savedSession.getBrowser());
        assertEquals("desktop", savedSession.getDeviceType());
        assertEquals("https://google.com", savedSession.getReferrer());

        // Verify IP address was hashed with the correct salt and is not raw
        assertNotNull(savedSession.getIpHash());
        assertNotEquals("192.0.2.1", savedSession.getIpHash());
        assertEquals(64, savedSession.getIpHash().length()); // SHA-256 hex is 64 chars
    }

    @Test
    void testUpdateSessionSuccess() {
        UUID sessionId = UUID.randomUUID();
        Session existingSession = new Session(
            "hash", "ua", "ref", "browser", "os", "desktop",
            "country", "city", "region", "timezone", "en-US", 1920, 1080
        );

        when(sessionRepo.findById(sessionId)).thenReturn(Optional.of(existingSession));
        when(sessionRepo.save(any(Session.class))).thenAnswer(i -> i.getArguments()[0]);

        UpdateSessionRequest request = new UpdateSessionRequest(true, true);

        // Run
        service.updateSession(sessionId, request);

        // Verify
        verify(sessionRepo).save(existingSession);
        assertTrue(existingSession.isEnteredSite());
        assertNotNull(existingSession.getEndedAt());
    }

    @Test
    void testUpdateSessionNotFoundThrows() {
        UUID sessionId = UUID.randomUUID();
        when(sessionRepo.findById(sessionId)).thenReturn(Optional.empty());
        UpdateSessionRequest request = new UpdateSessionRequest(true, false);

        assertThrows(RuntimeException.class, () -> service.updateSession(sessionId, request));
    }

    @Test
    void testLogEventSuccess() {
        UUID sessionId = UUID.randomUUID();
        Session mockSession = mock(Session.class);
        when(sessionRepo.findById(sessionId)).thenReturn(Optional.of(mockSession));

        CreateEventRequest request = new CreateEventRequest(
            sessionId, "node_click", Map.of("role", "Engineer", "org", "Google")
        );

        // Run
        service.logEvent(request);

        // Verify
        ArgumentCaptor<Event> eventCaptor = ArgumentCaptor.forClass(Event.class);
        verify(eventRepo).save(eventCaptor.capture());

        Event savedEvent = eventCaptor.getValue();
        assertEquals(mockSession, savedEvent.getSession());
        assertEquals("node_click", savedEvent.getEventType());
        assertEquals("Engineer", savedEvent.getEventData().get("role"));
    }

    @Test
    void testLogEventSessionNotFoundThrows() {
        UUID sessionId = UUID.randomUUID();
        when(sessionRepo.findById(sessionId)).thenReturn(Optional.empty());

        CreateEventRequest request = new CreateEventRequest(
            sessionId, "node_click", Map.of()
        );

        assertThrows(RuntimeException.class, () -> service.logEvent(request));
    }
}
