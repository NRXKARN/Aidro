import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
    Shield, Map as MapIcon, Compass as CompassIcon, 
    Send, Brain, Users, Mic, ShieldAlert, Zap, Radio, User
} from 'lucide-react';
import ResponderHub from './pages/ResponderHub';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import GuidanceHub from './pages/GuidanceHub';
import ReportingPage from './pages/ReportingPage';
import IntelCenter from './pages/IntelCenter';
import DisasterHub from './pages/DisasterHub';
import ProfileView from './pages/ProfileView';
import SurvivalKit from './pages/SurvivalKit';
import ErrorBoundary from './components/ErrorBoundary';
import SystemAlerts from './components/SystemAlerts';
import CONFIG from './config/config';
import './styles/SundarSimple.css';

const App = () => {
    console.log("APP_RELOAD_TRIGGERED");
    const [activeView, setActiveView] = useState('overview');
    const [coords, setCoords] = useState({ lat: 18.4013, lng: 76.5519 });
    const [lowBatteryMode, setLowBatteryMode] = useState(false);
    const [batterySupported, setBatterySupported] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const [autoSOSTriggered, setAutoSOSTriggered] = useState(false);
    
    console.log("AIDRO_CORE_INIT: ", { activeView, lowBatteryMode });

    // GPS Coordination
    useEffect(() => {
        if (!navigator.geolocation) return;
        const options = { 
            enableHighAccuracy: !lowBatteryMode,
            timeout: 10000,
            maximumAge: lowBatteryMode ? 60000 : 0 
        };

        // Get immediate position first
        navigator.geolocation.getCurrentPosition(
            (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => console.warn("Initial location fetch failed: ", err.message),
            options
        );

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            (err) => console.log("Location signal pending...", err.message),
            options
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, [lowBatteryMode]);

    // Battery Management for extreme situations (iOS/Safari Fallback)
    useEffect(() => {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                const checkBattery = () => {
                    if (!CONFIG) return;
                    const isCritical = battery.level <= (CONFIG.BATTERY_CRITICAL_LEVEL || 0.15);
                    if (isCritical && !battery.charging) setLowBatteryMode(true);
                    else if (battery.level > (CONFIG.BATTERY_CRITICAL_LEVEL || 0.15) + 0.05) setLowBatteryMode(false);
                };
                checkBattery();
                battery.addEventListener('levelchange', checkBattery);
            }).catch(() => setBatterySupported(false));
        } else {
            console.warn("Battery API unavailable (iOS/Safari).");
            setBatterySupported(false);
        }
    }, []);

    const navItems = [
        { id: 'overview', label: 'Home', icon: Shield },
        { id: 'map', label: 'Safety Map', icon: MapIcon },
        { id: 'protocols', label: 'Help Guide', icon: ShieldAlert },
        { id: 'survival', label: 'Toolkit', icon: Zap },
        { id: 'compass', label: 'Direction', icon: CompassIcon },
        { id: 'intel', label: 'AI Assistant', icon: Brain },
        { id: 'fleet', label: 'Volunteers', icon: Users },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    return (
        <div className={`sundar-app ${lowBatteryMode ? 'battery-saver' : ''}`}>
            {/* CLEAN_GOOGLE_HEADER */}
            <header className="sundar-header">
                <div className="sundar-logo">
                    <Shield size={28} />
                    <span>AIDRO Guardian</span>
                </div>

                <nav className="sundar-nav">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={activeView === item.id ? 'active' : ''}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div className={`status-pill ${navigator.onLine ? 'status-online' : 'status-offline'}`}>
                        {navigator.onLine ? 'Online' : 'Offline Mode'}
                    </div>
                </div>
            </header>

            <SystemAlerts lowBatteryMode={lowBatteryMode} batterySupported={batterySupported} />

            {/* FRIENDLY_MAIN_SURFACE */}
            <main className="sundar-main">
                <ErrorBoundary>
                    {activeView === 'overview' && <Dashboard onImmediateSOS={() => { setActiveView('sos'); setAutoSOSTriggered(true); }} />}
                    {activeView === 'map' && (
                        <div className="fade-in sundar-card" style={{ height: '70vh', width: '100%', padding: 0, overflow: 'hidden', position: 'relative' }}>
                             <MapView 
                                coords={coords} 
                                lowPower={lowBatteryMode} 
                                onQuickSOS={() => { setActiveView('sos'); setAutoSOSTriggered(true); }} 
                             />
                        </div>
                    )}
                    {activeView === 'protocols' && <DisasterHub coords={coords} />}
                    {activeView === 'compass' && <GuidanceHub coords={coords} /> }
                    {activeView === 'survival' && <SurvivalKit /> }
                    {activeView === 'sos' && (
                        <ReportingPage 
                            coords={coords} 
                            autoTriggered={autoSOSTriggered} 
                            onSuccess={() => { setAutoSOSTriggered(false); setActiveView('overview'); }} 
                        />
                    )}
                    {activeView === 'fleet' && <ResponderHub /> }
                    {activeView === 'intel' && <IntelCenter /> }
                    {activeView === 'profile' && <ProfileView /> }
                </ErrorBoundary>
            </main>

            {/* HUMAN-FRIENDLY SOS ACTION */}
            {activeView !== 'sos' && (
                <button 
                    onClick={() => { setActiveView('sos'); setAutoSOSTriggered(true); }}
                    className="sundar-sos-fab"
                >
                    <Send size={24} />
                    Get Help Now
                </button>
            )}

            <footer style={{ padding: '1rem 2rem', background: '#fff', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mic size={14} color={isListening ? 'var(--success)' : 'var(--danger)'} />
                        Voice Recognition: {isListening ? 'Active' : 'Turned Off'}
                    </div>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', opacity: 0.7 }}>
                    Helping you stay safe. Version {CONFIG?.VERSION || '4.0.0'}
                </div>
            </footer>
        </div>
    );
};

export default App;

