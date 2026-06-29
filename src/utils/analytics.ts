const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Initialize a new visitor session if one doesn't exist in the current session storage.
 */
export async function initSession(): Promise<string | null> {
    try {
        const cachedSessionId = sessionStorage.getItem('portfolio_session_id');
        if (cachedSessionId) {
            return cachedSessionId;
        }

        const payload = {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
            language: navigator.language || 'Unknown',
            screenWidth: window.innerWidth || window.screen.width,
            screenHeight: window.innerHeight || window.screen.height
        };

        const response = await fetch(`${API_BASE}/api/analytics/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Failed to create session: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.sessionId) {
            sessionStorage.setItem('portfolio_session_id', data.sessionId);
            return data.sessionId;
        }
    } catch (error) {
        console.error('Analytics session initialization failed:', error);
    }
    return null;
}

/**
 * Track when a user clicks 'Enter' on the landing page, engaging with the site.
 */
export async function trackEnterSite(): Promise<void> {
    const sessionId = sessionStorage.getItem('portfolio_session_id');
    if (!sessionId) return;

    try {
        // Update session to show they entered
        await fetch(`${API_BASE}/api/analytics/sessions/${sessionId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enteredSite: true })
        });

        // Log the enter click event
        await trackEvent('enter_click');
    } catch (error) {
        console.error('Failed to track site enter:', error);
    }
}

/**
 * Track an individual analytics event.
 */
export async function trackEvent(eventType: string, eventData: Record<string, any> = {}): Promise<void> {
    const sessionId = sessionStorage.getItem('portfolio_session_id');
    if (!sessionId) return;

    try {
        await fetch(`${API_BASE}/api/analytics/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId,
                eventType,
                eventData
            })
        });
    } catch (error) {
        console.error(`Failed to track event ${eventType}:`, error);
    }
}
