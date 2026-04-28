import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCw, Smartphone, MapPin, Wind, Activity, Move } from 'lucide-react';

const GuidanceHub = ({ coords }) => {
    const [bearing, setBearing] = useState(0);
    const [isLive, setIsLive] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const dialRef = useRef(null);

    // 1. HARDWARE_SENSOR_LOGIC (Automatic Handshake)
    const handleHardwareSync = useCallback((orient) => {
        let heading = null;
        if (orient.webkitCompassHeading !== undefined) heading = orient.webkitCompassHeading;
        else if (orient.absolute && orient.alpha !== null) heading = 360 - orient.alpha;
        else if (orient.alpha !== null) heading = 360 - orient.alpha;

        if (heading !== null) {
            setBearing(heading);
            setIsLive(true);
        }
    }, []);

    // 2. KEYBOARD_LOGIC (For Laptop Users)
    const handleKeyDown = useCallback((e) => {
        if (isLive) return;
        if (e.key === 'ArrowLeft') setBearing(prev => (prev - 2 + 360) % 360);
        if (e.key === 'ArrowRight') setBearing(prev => (prev + 2) % 360);
    }, [isLive]);

    // 3. MOUSE_TOUCH_DRAG_LOGIC (Manual Test Mode)
    const handleRotateManual = (e) => {
        if (isLive || !isDragging) return;
        const rect = dialRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
        setBearing((angle + 90 + 360) % 360);
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        // Attempt passive sensor link
        window.addEventListener('deviceorientation', handleHardwareSync, true);
        window.addEventListener('deviceorientationabsolute', handleHardwareSync, true);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('deviceorientation', handleHardwareSync);
            window.removeEventListener('deviceorientationabsolute', handleHardwareSync);
        };
    }, [handleKeyDown, handleHardwareSync]);

    const initSensors = async () => {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const response = await DeviceOrientationEvent.requestPermission();
                if (response === 'granted') setIsLive(true);
            } catch (e) { alert("SSL_HTTPS_REQUIRED_FOR_SENSORS"); }
        }
    };

    return (
        <div className="fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto' }}>
            
            {/* VINTAGE_COMMAND_SECTION */}
            <div className="card-horizon" style={{ padding: 'clamp(2rem, 10vw, 5rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#0a0d14', position: 'relative' }}>
                
                <div style={{ position: 'absolute', top: '2.5rem', right: '2.5rem', display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: isLive ? 'var(--success)' : 'var(--warning)' }}>
                        {isLive ? 'LIVE_SENSORS' : 'MANUAL_MODE'}
                    </div>
                    <button onClick={initSensors} style={{ background: isLive ? 'rgba(255,255,255,0.05)' : 'var(--primary)', border: isLive ? '1px solid var(--border)' : 'none', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}>
                        <Smartphone size={14} /> LINK MOBILE
                    </button>
                </div>

                {/* THE_CLASSIC_DIAL */}
                <div 
                    ref={dialRef}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                    onMouseMove={handleRotateManual}
                    onTouchStart={() => setIsDragging(true)}
                    onTouchEnd={() => setIsDragging(false)}
                    onTouchMove={handleRotateManual}
                    style={{ 
                        position: 'relative', 
                        width: 'clamp(320px, 75vmin, 450px)', 
                        height: 'clamp(320px, 75vmin, 450px)', 
                        background: '#fff', 
                        borderRadius: '50%', 
                        border: '12px solid #ccc',
                        boxShadow: 'inset 0 0 50px rgba(0,0,0,0.1), 0 20px 60px rgba(0,0,0,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isLive ? 'default' : 'grab'
                    }}
                >
                    <div style={{ position: 'absolute', width: '85%', height: '85%', border: '1px solid #eee', borderRadius: '50%' }} />

                    {/* FIXED_DIAL_HUD */}
                    <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
                        {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340].map(deg => (
                             <div key={deg} style={{ position: 'absolute', width: '100%', height: '100%', transform: `rotate(${deg}deg)`, textAlign: 'center' }}>
                                 <span style={{ color: '#000', fontSize: '1.2rem', fontWeight: 800, display: 'inline-block', transform: `rotate(${-deg}deg)`, marginTop: '18px' }}>
                                    {deg === 0 ? '0' : deg}
                                 </span>
                             </div>
                        ))}

                        {/* Cardinal Points */}
                        <div style={{ position: 'absolute', top: '12%', left: '50%', transform: 'translateX(-50%)', color: '#000', fontSize: '3rem', fontWeight: 900, fontFamily: 'serif' }}>N</div>
                        <div style={{ position: 'absolute', bottom: '12%', left: '50%', transform: 'translateX(-50%)', color: '#000', fontSize: '2rem', fontWeight: 900, fontFamily: 'serif' }}>S</div>
                        <div style={{ position: 'absolute', left: '12%', top: '50%', transform: 'translateY(-50%)', color: '#000', fontSize: '2rem', fontWeight: 900, fontFamily: 'serif' }}>W</div>
                        <div style={{ position: 'absolute', right: '12%', top: '50%', transform: 'translateY(-50%)', color: '#000', fontSize: '2rem', fontWeight: 900, fontFamily: 'serif' }}>E</div>

                        {/* Analog Ticks */}
                        {[...Array(72)].map((_, i) => (
                             <div key={i} style={{ position: 'absolute', left: '50%', width: '1px', height: '100%', background: i % 2 === 0 ? '#111' : '#bbb', transform: `rotate(${i * 5}deg)` }}>
                                <div style={{ height: i % 2 === 0 ? '15px' : '8px', width: '2px', background: 'inherit' }} />
                             </div>
                        ))}
                    </div>

                    {/* DYNAMIC_ crimson_NEEDLE */}
                    <div style={{ 
                        position: 'absolute', 
                        width: '12px', 
                        height: '75%', 
                        transform: `rotate(${ bearing }deg)`, 
                        transition: isLive ? 'transform 0.05s linear' : 'transform 1s cubic-bezier(0.19, 1, 0.22, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 10
                    }}>
                        <div style={{ width: '0', height: '50%', borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '160px solid #e11d48', marginTop: '-15px' }} />
                        <div style={{ width: '0', height: '50%', borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '160px solid #111' }} />
                    </div>

                    {/* Center Pin Hub */}
                    <div style={{ 
                        position: 'absolute', 
                        width: '32px', 
                        height: '32px', 
                        background: 'radial-gradient(circle at 30% 30%, #fff, #555)', 
                        borderRadius: '50%', 
                        border: '3px solid #333', 
                        zIndex: 11,
                        boxShadow: isLive ? '0 0 15px var(--primary-glow)' : '0 4px 10px rgba(0,0,0,0.5)'
                    }} />

                    {/* Precise Degree Readout */}
                    <div style={{ position: 'absolute', bottom: '30%', textAlign: 'center', zIndex: 5, background: 'rgba(5, 8, 17, 0.05)', padding: '5px 15px', borderRadius: '20px', border: '1px solid #ddd' }}>
                         <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#000', fontFamily: 'monospace' }}>{Math.round(bearing)}°</div>
                    </div>
                </div>

                {!isLive && (
                    <div style={{ marginTop: '2.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textAlign: 'center' }}>
                         <Move size={12} style={{ display: 'inline', marginRight: '5px' }} /> 
                         LAPTOP DETECTED: Use Arrow Keys or Mouse-Drag to Rotate the Compass
                    </div>
                )}
            </div>

            {/* SECONDARY_TELEMETRY */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="card-horizon" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ padding: '15px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px' }}><Activity size={24} color="var(--primary)" /></div>
                    <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>MOTION_STABILITY</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>STEADY</div>
                    </div>
                </div>
                <div className="card-horizon" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ padding: '15px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '12px' }}><MapPin size={24} color="var(--accent)" /></div>
                    <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>GPS_VECTOR_DATA</div>
                        <div style={{ fontSize: '1rem', fontWeight: 900 }}>{coords?.lat.toFixed(4)}, {coords?.lng.toFixed(4)}</div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default GuidanceHub;
