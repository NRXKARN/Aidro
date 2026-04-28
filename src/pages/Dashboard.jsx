import React, { useState, useEffect, useMemo } from 'react';
import { 
    Shield, AlertTriangle, Activity, Zap, Globe, RefreshCcw, 
    Search, Map, Users, CloudLightning, Navigation2, Info, Sun, CloudRain
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard = ({ onImmediateSOS }) => {
    const [allAlerts, setAllAlerts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [safetyScore, setSafetyScore] = useState(85);
    const [stats, setStats] = useState({
        total_tracked: 0,
        last_sync: new Date().toLocaleTimeString(),
        pending_sync: 0
    });

    const checkPendingSync = () => {
        const pending = JSON.parse(localStorage.getItem('AIDRO_PENDING_SOS') || '[]');
        setStats(prev => ({ ...prev, pending_sync: pending.length }));
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson');
            const data = await response.json();
            
            const processed = data.features.map(feature => ({
                id: feature.id,
                title: feature.properties.title,
                mag: feature.properties.mag,
                severity: feature.properties.mag >= 5.0 ? 'Urgent' : 'Normal',
                timestamp: new Date(feature.properties.time).toLocaleString('en-US', { 
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                }),
                location: feature.properties.place,
            }));

            setAllAlerts(processed);
            setStats(prev => ({ ...prev, total_tracked: data.metadata.count, last_sync: new Date().toLocaleTimeString() }));
            
            if (processed.length > 0) {
                const impact = processed[0].mag; 
                setSafetyScore(Math.max(0, Math.floor(100 - (impact * 10))));
            }
        } catch (error) {
            console.error("Data sync paused.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        checkPendingSync();
        window.addEventListener('online', checkPendingSync);
        return () => window.removeEventListener('online', checkPendingSync);
    }, []);

    const filteredAlerts = useMemo(() => {
        return allAlerts.filter(a => a.location.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [allAlerts, searchQuery]);

    const chartData = useMemo(() => ({
        labels: filteredAlerts.length > 0 ? filteredAlerts.slice(0, 10).map(a => a.timestamp.split(',')[0]).reverse() : ['...'],
        datasets: [{
            label: 'Activity Intensity',
            data: filteredAlerts.length > 0 ? filteredAlerts.slice(0, 10).map(a => a.mag).reverse() : [0],
            borderColor: '#1a73e8',
            backgroundColor: 'rgba(26, 115, 232, 0.05)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointRadius: 0
        }]
    }), [filteredAlerts]);

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* HERO_SOS_SECTION */}
            <div className="sundar-card" style={{ background: '#d93025', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: 'none' }}>
                <div style={{ flex: 1 }}>
                    <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 800 }}>Need assistance?</h2>
                    <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>Our team and AI are standing by to help you stay safe.</p>
                </div>
                <button 
                    onClick={onImmediateSOS}
                    style={{ background: '#fff', color: '#d93025', border: 'none', padding: '1rem 2.5rem', borderRadius: '100px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer' }}
                >
                    Request Help
                </button>
            </div>

            {/* QUICK_STATS_GRID */}
            <div className="sundar-grid">
                <div className="sundar-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Current Safety Score</h3>
                        <Info size={16} color="var(--text-muted)" />
                    </div>
                    <div style={{ fontSize: '3.5rem', fontWeight: 800, color: safetyScore > 70 ? 'var(--success)' : 'var(--warning)' }}>
                        {safetyScore}%
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        Based on local seismic and weather data.
                    </p>
                    <div style={{ marginTop: '1.5rem', height: '8px', background: '#f1f3f4', borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{ width: `${safetyScore}%`, height: '100%', background: safetyScore > 70 ? 'var(--success)' : 'var(--warning)', transition: 'width 1s ease' }}></div>
                    </div>
                </div>

                <div className="sundar-card">
                    <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Weather Forecast</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', height: '100%', alignItems: 'center' }}>
                        
                        {/* YESTERDAY */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Yesterday</div>
                            <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#fff7e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Sun size={24} color="#f9ab00" />
                            </div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>28°C</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Clear Skies</div>
                        </div>

                        {/* TODAY */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px', transform: 'scale(1.1)' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800 }}>Today</div>
                            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(26, 115, 232, 0.2)' }}>
                                <CloudRain size={28} color="#1a73e8" />
                            </div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>22°C</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: 600 }}>Heavy Rain</div>
                        </div>

                        {/* TOMORROW */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tomorrow</div>
                            <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#fce8e6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CloudLightning size={24} color="#d93025" />
                            </div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>20°C</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Storms</div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ACTIVITY_SECTION */}
            <div className="sundar-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
                <div className="sundar-card">
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Recent Ground Activity</h3>
                    <div style={{ height: '300px' }}>
                        <Line 
                            data={chartData} 
                            options={{ 
                                maintainAspectRatio: false, 
                                scales: { 
                                    y: { beginAtZero: true, grid: { color: '#f1f3f4' }, border: { display: false } }, 
                                    x: { grid: { display: false }, border: { display: false } } 
                                }, 
                                plugins: { legend: { display: false } } 
                            }} 
                        />
                    </div>
                </div>

                <div className="sundar-card">
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Safe Zones</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {loading ? (
                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>Updating...</div>
                        ) : (
                            allAlerts.slice(0, 4).map(alert => (
                                <div key={alert.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{alert.location}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                        {alert.severity === 'Urgent' ? '⚠️ Precaution Advised' : '✅ Stable Status'}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
