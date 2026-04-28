import React, { useState, useEffect } from 'react';
import { 
    Zap, Volume2, Shield, HeartPulse, Flame, Droplets, 
    ArrowRight, Lightbulb, AlertTriangle, Radio, Phone
} from 'lucide-react';

const SurvivalKit = () => {
    const [flashlightOn, setFlashlightOn] = useState(false);
    const [sirenOn, setSirenOn] = useState(false);
    const audioRef = React.useRef(null);

    const checklistItems = [
        { id: 1, text: "Keep 3 days of water (4L per person/day)", category: "Water", icon: Droplets, color: "#1a73e8" },
        { id: 2, text: "Non-perishable food & manual can opener", category: "Food", icon: Flame, color: "#e67c73" },
        { id: 3, text: "Battery-powered or hand-crank radio", category: "Comms", icon: Radio, color: "#f9ab00" },
        { id: 4, text: "First aid kit with essential meds", category: "Medical", icon: HeartPulse, color: "#d93025" },
        { id: 5, text: "Flashlight and extra batteries", category: "Light", icon: Lightbulb, color: "#f9ab00" },
    ];

    const toggleFlashlight = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            const track = stream.getVideoTracks()[0];
            const capabilities = track.getCapabilities();
            
            if (capabilities.torch) {
                await track.applyConstraints({ advanced: [{ torch: !flashlightOn }] });
                setFlashlightOn(!flashlightOn);
            } else {
                alert("Flashlight not supported on this device.");
            }
        } catch (err) {
            console.error("Flashlight error:", err);
            // Simulated for desktop
            setFlashlightOn(!flashlightOn);
        }
    };

    const toggleSiren = () => {
        if (!sirenOn) {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5);
            oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 1);
            oscillator.loop = true;

            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            audioRef.current = { oscillator, audioCtx };
            setSirenOn(true);
        } else {
            if (audioRef.current) {
                audioRef.current.oscillator.stop();
                audioRef.current.audioCtx.close();
            }
            setSirenOn(false);
        }
    };

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            
            <div className="sundar-card" style={{ textAlign: 'center' }}>
                <h1 className="heading-display">Survival Toolkit</h1>
                <p className="text-sub">Essential tools and checklists for emergency situations.</p>
            </div>

            <div className="sundar-grid">
                {/* TOOL: FLASHLIGHT */}
                <div className="sundar-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center' }}>
                    <div style={{ 
                        width: '80px', height: '80px', borderRadius: '50%', 
                        background: flashlightOn ? '#fff7e0' : '#f1f3f4',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: flashlightOn ? '#f9ab00' : 'var(--text-muted)',
                        boxShadow: flashlightOn ? '0 0 30px rgba(249, 171, 0, 0.4)' : 'none',
                        transition: 'all 0.3s ease'
                    }}>
                        <Lightbulb size={40} fill={flashlightOn ? '#f9ab00' : 'none'} />
                    </div>
                    <div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Flashlight</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Use your device's LED as a signal or light source.</p>
                    </div>
                    <button 
                        onClick={toggleFlashlight}
                        style={{ 
                            width: '100%', padding: '1rem', borderRadius: '100px', border: 'none',
                            background: flashlightOn ? '#f9ab00' : 'var(--primary)',
                            color: '#fff', fontWeight: 700, cursor: 'pointer'
                        }}
                    >
                        {flashlightOn ? 'Turn Off' : 'Turn On'}
                    </button>
                </div>

                {/* TOOL: SIREN */}
                <div className="sundar-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center' }}>
                    <div style={{ 
                        width: '80px', height: '80px', borderRadius: '50%', 
                        background: sirenOn ? '#fce8e6' : '#f1f3f4',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: sirenOn ? '#d93025' : 'var(--text-muted)',
                        animation: sirenOn ? 'pulse-red 1s infinite' : 'none',
                        transition: 'all 0.3s ease'
                    }}>
                        <Volume2 size={40} />
                    </div>
                    <div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Emergency Siren</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Emit a loud sound to alert nearby rescue teams.</p>
                    </div>
                    <button 
                        onClick={toggleSiren}
                        style={{ 
                            width: '100%', padding: '1rem', borderRadius: '100px', border: 'none',
                            background: sirenOn ? '#d93025' : 'var(--primary)',
                            color: '#fff', fontWeight: 700, cursor: 'pointer'
                        }}
                    >
                        {sirenOn ? 'Stop Siren' : 'Activate Siren'}
                    </button>
                </div>
            </div>

            <div className="sundar-card">
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Shield size={24} color="var(--primary)" />
                    Survival Checklist
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {checklistItems.map(item => (
                        <div key={item.id} style={{ 
                            display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.2rem', 
                            background: '#f8f9fa', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' 
                        }}>
                            <div style={{ background: '#fff', padding: '10px', borderRadius: '12px', color: item.color, boxShadow: 'var(--shadow-sm)' }}>
                                <item.icon size={24} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: item.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.category}</div>
                                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.text}</div>
                            </div>
                            <input type="checkbox" style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="sundar-grid">
                <div className="sundar-card" style={{ background: 'var(--primary-light)', border: 'none' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>First Aid Basics</h3>
                    <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <li>Control bleeding with direct pressure.</li>
                        <li>Keep patient warm to prevent shock.</li>
                        <li>Do not move someone with head/neck injury.</li>
                    </ul>
                </div>
                <div className="sundar-card" style={{ background: '#e6f4ea', border: 'none' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#1e8e3e' }}>Offline Resources</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        All tools on this page work without internet. Keep this tab open if you lose connectivity.
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes pulse-red {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(217, 48, 37, 0.7); }
                    70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(217, 48, 37, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(217, 48, 37, 0); }
                }
            `}</style>
        </div>
    );
};

export default SurvivalKit;
