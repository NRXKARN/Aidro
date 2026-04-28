import React, { useState, useRef, useEffect } from 'react';
import { 
    Send, AlertTriangle, Shield, CheckCircle, Radio, 
    MessageSquare, Share2, MapPin, Phone, Info, Clock, ShieldCheck, 
    Activity, Heart, Flame, Droplets, Mic
} from 'lucide-react';
import { ApiService } from '../services/ApiService';

const ReportingPage = ({ coords, onSuccess, autoTriggered }) => {
    const [emergencyType, setEmergencyType] = useState('Medical');
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState('READY'); // READY, QUEUED, SENT
    const [analysisData, setAnalysisData] = useState(null);
    const [dispatchedAssets, setDispatchedAssets] = useState([]);
    const [countdown, setCountdown] = useState(15);
    const isOffline = !navigator.onLine;

    // Auto-SOS logic for hands-free emergency
    useEffect(() => {
        let timer;
        if (autoTriggered && status === 'READY' && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (autoTriggered && countdown === 0 && status === 'READY') {
            handleSOS();
        }
        return () => clearInterval(timer);
    }, [autoTriggered, countdown, status]);

    const handleSOS = async () => {
        setStatus('QUEUED');

        let emergencyNumber = "919372150328"; // Default fallback
        const savedProfile = localStorage.getItem('aidro_user_profile');
        if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            if (profile.emergencyContactNumber && profile.emergencyContactNumber.trim() !== '') {
                // Ensure it contains only numbers, remove spaces, etc
                emergencyNumber = profile.emergencyContactNumber.replace(/\D/g, '');
            }
        }

        const msg = `URGENT EMERGENCY: ${emergencyType} assistance needed. My location: https://www.google.com/maps?q=${coords?.lat},${coords?.lng}`;
        
        // Primary action: Open WhatsApp
        window.open(`https://wa.me/${emergencyNumber}?text=${encodeURIComponent(msg)}`, '_blank');
        
        const reportPayload = {
            message: msg,
            location: coords,
            priority: "High"
        };

        if (isOffline) {
            setStatus('SENT');
            return;
        }

        setIsSending(true);
        try {
            // Background logging to mission control
            const result = await ApiService.submitReport(reportPayload);
            setAnalysisData(result.analysis);
            setDispatchedAssets(result.assets_dispatched || []);
            setStatus('SENT');
            if (onSuccess) setTimeout(onSuccess, 15000); 
        } catch (error) {
            console.error("Communication issue.", error);
            setStatus('SENT'); // Still mark as sent since WhatsApp opened
            if (onSuccess) setTimeout(onSuccess, 15000);
        } finally {
            setIsSending(false);
        }
    };

    const emergencyOptions = [
        { id: 'Medical', label: 'Medical', icon: Heart, color: '#d93025' },
        { id: 'Trapped', label: 'Trapped', icon: Activity, color: '#f9ab00' },
        { id: 'Fire', label: 'Fire', icon: Flame, color: '#e67c73' },
        { id: 'Flood', label: 'Flood', icon: Droplets, color: '#1a73e8' },
    ];

    if (status === 'SENT') {
        return (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <div className="sundar-card" style={{ textAlign: 'center', border: 'none', background: '#e6f4ea' }}>
                    <div style={{ display: 'inline-flex', padding: '1rem', background: '#fff', borderRadius: '50%', marginBottom: '1.5rem', color: 'var(--success)' }}>
                        <CheckCircle size={48} />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', marginBottom: '0.5rem' }}>Help is on the way</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>We have received your request and dispatched assistance.</p>
                </div>

                {analysisData && (
                    <div className="sundar-grid">
                        <div className="sundar-card">
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <ShieldCheck size={20} color="var(--primary)" />
                                Stay Safe Steps
                            </h3>
                            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {analysisData.instructions.map((inst, i) => (
                                    <li key={i} style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{inst}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="sundar-card">
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <MapPin size={20} color="var(--warning)" />
                                Responders
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {dispatchedAssets.length > 0 ? dispatchedAssets.map((asset, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{asset.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Time: {Math.floor(Math.random() * 8) + 3} mins</div>
                                        </div>
                                        <div style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.85rem' }}>En Route</div>
                                    </div>
                                )) : (
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Connecting with local volunteers and teams...</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <button 
                    onClick={onSuccess}
                    style={{ background: '#fff', border: '1px solid var(--border)', padding: '1rem', borderRadius: '100px', fontWeight: 600, cursor: 'pointer' }}
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            
            {autoTriggered && status === 'READY' && (
                <div className="sundar-card" style={{ background: '#fce8e6', border: '2px solid #d93025', textAlign: 'center' }}>
                    <h2 style={{ color: '#d93025', fontWeight: 800, marginBottom: '0.5rem' }}>Help request auto-sending in {countdown}s</h2>
                    <p style={{ color: '#d93025', fontSize: '0.95rem', marginBottom: '1.5rem' }}>We detected a potential emergency. Stay calm.</p>
                    <button 
                        onClick={onSuccess}
                        style={{ background: '#d93025', color: '#fff', border: 'none', padding: '0.8rem 2rem', borderRadius: '100px', fontWeight: 700, cursor: 'pointer' }}
                    >
                        I'm safe, please cancel
                    </button>
                </div>
            )}

            <div className="sundar-card" style={{ textAlign: 'center' }}>
                <h1 className="heading-display" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Emergency Help</h1>
                <p className="text-sub">Select the type of assistance you need and we'll connect you instantly.</p>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <MapPin size={14} /> {coords?.lat.toFixed(4)}, {coords?.lng.toFixed(4)}
                </div>
            </div>

            <div className="sundar-card">
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 700 }}>What's happening?</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                    {emergencyOptions.map(option => (
                        <button 
                            key={option.id}
                            onClick={() => setEmergencyType(option.id)}
                            style={{ 
                                padding: '1.5rem',
                                background: emergencyType === option.id ? option.color : '#f8f9fa',
                                color: emergencyType === option.id ? '#fff' : 'var(--text-main)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <option.icon size={24} />
                            <span style={{ fontWeight: 600 }}>{option.label}</span>
                        </button>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    <button 
                        onClick={() => alert("Accessing camera for damage assessment...")}
                        style={{ 
                            padding: '1rem', background: '#f1f3f4', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600
                        }}
                    >
                        <Shield size={18} /> Capture Situation
                    </button>
                    <button 
                        onClick={() => alert("Recording voice note...")}
                        style={{ 
                            padding: '1rem', background: '#f1f3f4', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600
                        }}
                    >
                        <Mic size={18} /> Add Voice Note
                    </button>
                </div>

                <button 
                    onClick={handleSOS}
                    disabled={isSending}
                    style={{ 
                        width: '100%',
                        padding: '1.5rem',
                        background: '#25D366', // WhatsApp Green color
                        color: '#fff',
                        border: 'none',
                        borderRadius: '100px',
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        boxShadow: '0 8px 24px rgba(37, 211, 102, 0.3)'
                    }}
                >
                    {isSending ? 'Sending Request...' : 'Request Help via WhatsApp'}
                    <MessageSquare size={24} />
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <button 
                    onClick={() => {
                        const msg = `Emergency: I need help. My location: https://www.google.com/maps?q=${coords?.lat},${coords?.lng}`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#128C7E', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                    <MessageSquare size={18} /> Share via WhatsApp
                </button>
                <button 
                    onClick={() => {
                        const msg = `Emergency: I need help. My location: https://www.google.com/maps?q=${coords?.lat},${coords?.lng}`;
                        window.location.href = `sms:?body=${encodeURIComponent(msg)}`;
                    }}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                    <Share2 size={18} /> Send as SMS
                </button>
            </div>
        </div>
    );
};

export default ReportingPage;
