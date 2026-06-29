import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface OverviewStats {
    total_sessions: number;
    entered_sessions: number;
    bounced_sessions: number;
    bounce_rate: number | null;
    avg_duration_seconds: number | null;
    visitors_today: number;
}

interface ReferrerStat {
    source: string;
    visit_count: number;
}

interface PopularNodeStat {
    role: string;
    organization: string;
    click_count: number;
}

interface GeoStat {
    country: string;
    city: string;
    visit_count: number;
}

interface DeviceStatItem {
    name: string;
    count: number;
}

interface DeviceStats {
    browsers: DeviceStatItem[];
    operatingSystems: DeviceStatItem[];
    deviceTypes: DeviceStatItem[];
}

interface TimelineItem {
    day: string;
    visit_count: number;
}

interface SessionListItem {
    id: string;
    started_at: string;
    ended_at: string | null;
    referrer: string | null;
    country: string | null;
    city: string | null;
    browser: string | null;
    os: string | null;
    device_type: string | null;
    entered_site: boolean;
}

interface JourneyEvent {
    session_id: string;
    started_at: string;
    referrer: string | null;
    country: string | null;
    browser: string | null;
    event_type: string;
    event_data: Record<string, any>;
    event_time: string;
}

export function AnalyticsDashboard() {
    const [password, setPassword] = useState<string>(() => sessionStorage.getItem('portfolio_dashboard_password') || '');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Dashboard Data
    const [overview, setOverview] = useState<OverviewStats | null>(null);
    const [referrers, setReferrers] = useState<ReferrerStat[]>([]);
    const [popularNodes, setPopularNodes] = useState<PopularNodeStat[]>([]);
    const [geoStats, setGeoStats] = useState<GeoStat[]>([]);
    const [deviceStats, setDeviceStats] = useState<DeviceStats | null>(null);
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [sessionsList, setSessionsList] = useState<SessionListItem[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [selectedSessionJourney, setSelectedSessionJourney] = useState<JourneyEvent[]>([]);
    const [journeyLoading, setJourneyLoading] = useState<boolean>(false);

    // Temp password input
    const [tempPassword, setTempPassword] = useState('');

    const verifyAuth = async (tokenToTest: string) => {
        try {
            const res = await fetch(`${API_BASE}/api/analytics/overview`, {
                headers: { 'Authorization': `Bearer ${tokenToTest}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOverview(data);
                setIsAuthenticated(true);
                sessionStorage.setItem('portfolio_dashboard_password', tokenToTest);
                return true;
            }
        } catch (e) {
            console.error('Auth verification failed', e);
        }
        return false;
    };

    useEffect(() => {
        if (password) {
            verifyAuth(password).then(success => {
                if (!success) {
                    sessionStorage.removeItem('portfolio_dashboard_password');
                    setPassword('');
                }
            });
        }
    }, [password]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(null);
        setLoading(true);
        const success = await verifyAuth(tempPassword);
        setLoading(false);
        if (success) {
            setPassword(tempPassword);
        } else {
            setLoginError('Invalid password. Access denied.');
        }
    };

    const fetchDashboardData = async () => {
        if (!isAuthenticated || !password) return;
        setLoading(true);
        const headers = { 'Authorization': `Bearer ${password}` };
        try {
            const [
                overviewRes,
                referrersRes,
                popularNodesRes,
                geoRes,
                devicesRes,
                timelineRes,
                sessionsRes
            ] = await Promise.all([
                fetch(`${API_BASE}/api/analytics/overview`, { headers }),
                fetch(`${API_BASE}/api/analytics/referrers`, { headers }),
                fetch(`${API_BASE}/api/analytics/popular-nodes`, { headers }),
                fetch(`${API_BASE}/api/analytics/geo`, { headers }),
                fetch(`${API_BASE}/api/analytics/devices`, { headers }),
                fetch(`${API_BASE}/api/analytics/timeline`, { headers }),
                fetch(`${API_BASE}/api/analytics/sessions-list?page=1&pageSize=30`, { headers })
            ]);

            setOverview(await overviewRes.json());
            setReferrers(await referrersRes.json());
            setPopularNodes(await popularNodesRes.json());
            setGeoStats(await geoRes.json());
            setDeviceStats(await devicesRes.json());
            setTimeline(await timelineRes.json());
            setSessionsList(await sessionsRes.json());
        } catch (e) {
            console.error('Failed to fetch dashboard metrics', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchDashboardData();
        }
    }, [isAuthenticated]);

    const fetchJourney = async (sessionId: string) => {
        setSelectedSessionId(sessionId);
        setJourneyLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/analytics/journeys/${sessionId}`, {
                headers: { 'Authorization': `Bearer ${password}` }
            });
            if (res.ok) {
                setSelectedSessionJourney(await res.json());
            }
        } catch (e) {
            console.error('Failed to fetch journey logs', e);
        } finally {
            setJourneyLoading(false);
        }
    };

    // Calculate maximum visit count for timeline rendering
    const maxVisits = timeline.length > 0 ? Math.max(...timeline.map(t => t.visit_count), 5) : 5;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0d0d0f] flex items-center justify-center p-6 text-white font-sans">
                {/* Background lighting */}
                <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-8 rounded-2xl shadow-2xl relative">
                    <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent text-center">
                        Analytics Dashboard
                    </h2>
                    <p className="text-gray-400 text-sm mb-8 text-center">
                        Enter password to view visitor statistics.
                    </p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={tempPassword}
                                onChange={e => setTempPassword(e.target.value)}
                                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="••••••••"
                                required
                                autoFocus
                            />
                        </div>

                        {loginError && (
                            <p className="text-red-400 text-xs mt-1 text-center font-medium bg-red-950/20 py-2 rounded border border-red-500/20">
                                {loginError}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg shadow-purple-500/10 cursor-pointer disabled:opacity-50"
                        >
                            {loading ? 'Authenticating...' : 'Access Dashboard'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <a href="/" className="text-xs text-gray-500 hover:text-purple-400 transition-colors">
                            ← Return to Portfolio
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#070709] text-gray-200 font-sans p-6 md:p-8">
            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                        Visitor Analytics
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Real-time portfolio engagement and traffic logs</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchDashboardData}
                        disabled={loading}
                        className="px-4 py-2 text-xs font-semibold bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white rounded-lg transition-all cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                    <a
                        href="/"
                        className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg transition-all shadow-md cursor-pointer"
                    >
                        Exit Dashboard
                    </a>
                </div>
            </header>

            {/* Overview Stats Row */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { title: 'Total Sessions', value: overview?.total_sessions ?? 0, desc: 'All visitor loads' },
                    { title: 'Engaged Sessions', value: overview?.entered_sessions ?? 0, desc: 'Clicked "Enter"' },
                    { title: 'Bounce Rate', value: overview?.bounce_rate !== null && overview?.bounce_rate !== undefined ? `${overview.bounce_rate}%` : '0%', desc: 'Exited without entering' },
                    { title: 'Active Today', value: overview?.visitors_today ?? 0, desc: 'Visits since midnight' }
                ].map((card, i) => (
                    <div key={i} className="bg-white/[0.02] backdrop-blur-md border border-white/[0.06] p-5 rounded-xl">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{card.title}</p>
                        <p className="text-2xl md:text-3xl font-bold mt-2 text-white">{card.value}</p>
                        <p className="text-[10px] text-gray-600 mt-1">{card.desc}</p>
                    </div>
                ))}
            </section>

            {/* Timeline & Lists Grid */}
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* 30 Day Timeline */}
                <div className="lg:col-span-2 bg-white/[0.02] border border-white/[0.06] p-6 rounded-xl flex flex-col">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Traffic Timeline (Last 30 Days)</h3>
                    {timeline.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-xs text-gray-600 min-h-[220px]">
                            No data available
                        </div>
                    ) : (
                        <div className="flex-1 flex items-end justify-between gap-2 h-[220px] pt-4">
                            {timeline.map((item, index) => {
                                const heightPercentage = (item.visit_count / maxVisits) * 100;
                                const formattedDate = new Date(item.day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center group h-full justify-end">
                                        <div className="relative w-full flex justify-center">
                                            {/* Tooltip */}
                                            <span className="absolute bottom-full mb-2 bg-[#121214] text-[10px] font-bold text-purple-400 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-white/[0.05] shadow-xl whitespace-nowrap pointer-events-none z-10">
                                                {item.visit_count} visits ({formattedDate})
                                            </span>
                                            {/* Bar */}
                                            <div
                                                style={{ height: `${Math.max(heightPercentage, 3)}%` }}
                                                className="w-full max-w-[20px] bg-gradient-to-t from-indigo-600/40 to-purple-500 rounded-t group-hover:from-indigo-500 group-hover:to-purple-400 transition-all shadow-md shadow-purple-500/5"
                                            />
                                        </div>
                                        {/* Date snippet for every 5th item */}
                                        <span className="text-[9px] text-gray-600 mt-2 text-center h-4 overflow-hidden truncate w-full hidden sm:block">
                                            {index % 4 === 0 ? formattedDate : ''}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Popular Nodes */}
                <div className="bg-white/[0.02] border border-white/[0.06] p-6 rounded-xl flex flex-col">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Popular Nodes (3D Canvas clicks)</h3>
                    <div className="flex-1 overflow-y-auto max-h-[220px] space-y-3 pr-2">
                        {popularNodes.length === 0 ? (
                            <p className="text-xs text-gray-600 text-center py-8">No clicks logged yet</p>
                        ) : (
                            popularNodes.map((node, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-white/[0.04] pb-2 text-xs">
                                    <div className="truncate pr-4">
                                        <p className="font-semibold text-white truncate">{node.role}</p>
                                        <p className="text-[10px] text-gray-500 truncate">{node.organization}</p>
                                    </div>
                                    <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/10 shrink-0">
                                        {node.click_count}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            {/* Middle Grid: Referrers & Geo & Devices */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Referrers */}
                <div className="bg-white/[0.02] border border-white/[0.06] p-6 rounded-xl">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Traffic Sources</h3>
                    <div className="space-y-3 overflow-y-auto max-h-[220px]">
                        {referrers.length === 0 ? (
                            <p className="text-xs text-gray-600 py-4">No sources logged</p>
                        ) : (
                            referrers.map((ref, i) => (
                                <div key={i} className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 truncate max-w-[80%]" title={ref.source}>{ref.source}</span>
                                    <span className="font-bold text-white bg-white/[0.04] px-1.5 py-0.5 rounded shrink-0">{ref.visit_count}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Geography */}
                <div className="bg-white/[0.02] border border-white/[0.06] p-6 rounded-xl">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Locations</h3>
                    <div className="space-y-3 overflow-y-auto max-h-[220px]">
                        {geoStats.length === 0 ? (
                            <p className="text-xs text-gray-600 py-4">No locations logged</p>
                        ) : (
                            geoStats.map((geo, i) => (
                                <div key={i} className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 truncate max-w-[80%]">{geo.city ? `${geo.city}, ${geo.country}` : geo.country}</span>
                                    <span className="font-bold text-white bg-white/[0.04] px-1.5 py-0.5 rounded shrink-0">{geo.visit_count}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Device breakdown */}
                <div className="bg-white/[0.02] border border-white/[0.06] p-6 rounded-xl">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Device Metrics</h3>
                    <div className="space-y-4 overflow-y-auto max-h-[220px] text-xs">
                        {/* Device types */}
                        <div>
                            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</p>
                            <div className="flex gap-2">
                                {deviceStats?.deviceTypes.map((t, i) => (
                                    <div key={i} className="bg-white/[0.03] border border-white/[0.05] p-2 rounded flex-1 text-center">
                                        <p className="text-gray-400 capitalize">{t.name}</p>
                                        <p className="font-bold text-white mt-1">{t.count}</p>
                                    </div>
                                )) || <p className="text-xs text-gray-600">No device data</p>}
                            </div>
                        </div>

                        {/* Top Browser / OS */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Top Browsers</p>
                                <div className="space-y-1.5">
                                    {deviceStats?.browsers.slice(0, 3).map((b, i) => (
                                        <div key={i} className="flex justify-between text-[11px]">
                                            <span className="text-gray-400 truncate">{b.name}</span>
                                            <span className="text-white font-medium">{b.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Top OS</p>
                                <div className="space-y-1.5">
                                    {deviceStats?.operatingSystems.slice(0, 3).map((o, i) => (
                                        <div key={i} className="flex justify-between text-[11px]">
                                            <span className="text-gray-400 truncate">{o.name}</span>
                                            <span className="text-white font-medium">{o.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Row: Recent Journeys & Detail Panel */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Sessions List */}
                <div className="lg:col-span-2 bg-white/[0.02] border border-white/[0.06] p-6 rounded-xl flex flex-col">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Recent Visits</h3>
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-white/[0.08] text-gray-500">
                                    <th className="py-3 px-2">Started</th>
                                    <th className="py-3 px-2">Location</th>
                                    <th className="py-3 px-2">Referrer</th>
                                    <th className="py-3 px-2">OS / Browser</th>
                                    <th className="py-3 px-2 text-center">Entered</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessionsList.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-600">No sessions recorded yet</td>
                                    </tr>
                                ) : (
                                    sessionsList.map((session) => (
                                        <tr
                                            key={session.id}
                                            onClick={() => fetchJourney(session.id)}
                                            className={`border-b border-white/[0.03] hover:bg-white/[0.03] cursor-pointer transition-colors ${selectedSessionId === session.id ? 'bg-purple-950/20 border-purple-500/20' : ''}`}
                                        >
                                            <td className="py-3 px-2 font-medium text-gray-300">
                                                {new Date(session.started_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                <span className="block text-[10px] text-gray-500">
                                                    {new Date(session.started_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2">
                                                {session.city ? `${session.city}, ${session.country}` : session.country || 'Local / Private'}
                                            </td>
                                            <td className="py-3 px-2 truncate max-w-[120px]" title={session.referrer || 'Direct'}>
                                                {session.referrer ? session.referrer.replace(/^https?:\/\/(www\.)?/, '') : 'Direct'}
                                            </td>
                                            <td className="py-3 px-2">
                                                {session.os || 'Unknown'} / {session.browser || 'Unknown'}
                                                <span className="block text-[10px] text-gray-600 font-mono capitalize">
                                                    {session.device_type}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 text-center">
                                                <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${session.entered_site ? 'bg-green-500/10 text-green-400 border border-green-500/15' : 'bg-red-500/10 text-red-400 border border-red-500/15'}`}>
                                                    {session.entered_site ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Event Journey Details Panel */}
                <div className="bg-white/[0.02] border border-white/[0.06] p-6 rounded-xl flex flex-col min-h-[300px]">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Session Event Log</h3>

                    {journeyLoading ? (
                        <div className="flex-1 flex items-center justify-center text-xs text-gray-500">
                            Loading journey logs...
                        </div>
                    ) : !selectedSessionId ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-xs text-gray-600 text-center px-4">
                            <span className="text-2xl mb-2">👁️</span>
                            Select a visit from the table to view their timeline sequence of actions.
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto max-h-[350px] pr-2 space-y-4 relative">
                            {/* Visual Timeline Path */}
                            <div className="absolute top-2 bottom-2 left-3 w-[1px] bg-white/[0.08]" />

                            {selectedSessionJourney.length === 0 ? (
                                <p className="text-xs text-gray-600 pl-8 py-4">No events logged for this session</p>
                            ) : (
                                selectedSessionJourney.map((event, i) => (
                                    <div key={i} className="relative pl-8 text-xs">
                                        {/* Dot */}
                                        <div className={`absolute top-1 left-2 w-2 h-2 rounded-full -translate-x-[3px] border ${event.event_type === 'enter_click' ? 'bg-green-400 border-green-400' : 'bg-purple-400 border-purple-400'}`} />

                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <p className="font-semibold text-white uppercase tracking-wider text-[10px]">
                                                    {event.event_type.replace('_', ' ')}
                                                </p>
                                                {/* Specific payload info */}
                                                {event.event_type === 'node_click' && (
                                                    <p className="text-[10px] text-purple-300 mt-0.5">
                                                        Clicked node: {event.event_data?.role} ({event.event_data?.org})
                                                    </p>
                                                )}
                                                {event.event_type === 'detail_view' && (
                                                    <p className="text-[10px] text-indigo-300 mt-0.5">
                                                        Opened details: {event.event_data?.role}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-gray-600 shrink-0">
                                                {new Date(event.event_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
