import React, { useState } from 'react';
import { 
    CloudRain, ShieldAlert, Navigation, Flame, 
    AlertTriangle, XCircle, CheckCircle, Heart,
    Smartphone, Battery, User as UserIcon, ArrowLeft
} from 'lucide-react';

const DisasterHub = ({ coords }) => {
    const [situation, setSituation] = useState(null);
    const [showProfile, setShowProfile] = useState(false);

    const situations = {
        FLOOD: {
            label: 'Flood Safety',
            icon: CloudRain,
            color: '#1a73e8',
            do: [
                'Move to the highest point in the building.',
                'Switch off main electricity and gas valves.',
                'Listen to emergency radio for updates.',
                'Keep a whistle to signal for help.'
            ],
            notDo: [
                'Do not walk or drive through moving water.',
                'Do not touch electrical equipment if you are wet.',
                'Avoid bridge crossings if water is high.',
                'Don’t consume flood water or contaminated food.'
            ]
        },
        EARTHQUAKE: {
            label: 'Earthquake Safety',
            icon: AlertTriangle,
            color: '#f9ab00',
            do: [
                'Drop, Cover, and Hold on.',
                'Stay inside until the shaking stops.',
                'If outside, move to an open area away from buildings.',
                'Protect your head and neck.'
            ],
            notDo: [
                'Do not use elevators.',
                'Do not stand in doorways.',
                'Do not run outside during the shaking.',
                'Avoid tall buildings, trees, and power lines.'
            ]
        },
        LOST: {
            label: 'Route Finding',
            icon: Navigation,
            color: '#1e8e3e',
            do: [
                'Stop and stay calm. Observe your surroundings.',
                'Stay where you are to make it easier for rescue.',
                'Signal for help using mirrors or whistles.',
                'Seek shelter and keep warm.'
            ],
            notDo: [
                'Do not keep wandering (you may go in circles).',
                'Do not exhaust yourself.',
                'Don’t travel at night.',
                'Avoid crossing large rivers alone.'
            ]
        },
        FIRE: {
            label: 'Fire Safety',
            icon: Flame,
            color: '#d93025',
            do: [
                'Get out, stay out, and call for help.',
                'Stay low to the ground to avoid smoke.',
                'Touch doors with the back of your hand before opening.',
                'Stop, drop, and roll if clothes catch fire.'
            ],
            notDo: [
                'Do not open hot doors.',
                'Do not use elevators.',
                'Do not stop to collect belongings.',
                'Don’t hide under beds or in closets.'
            ]
        }
    };

    const emergencyProfile = {
        name: "Gaurav Telange",
        bloodGroup: "O+",
        allergies: "Penicillin, Peanuts",
        conditions: "Asthma",
        contacts: ["+91 98700 00000 (Home)", "+91 87600 00000 (Brother)"]
    };

    return (
        <div className="fade-in" style={{ height: '70vh', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* CLEAN_HEADER */}
            <div className="sundar-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: 'var(--primary-light)', padding: '10px', borderRadius: '12px' }}>
                        <ShieldAlert size={24} color="var(--primary)" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Helpful Guides</h2>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Essential steps for your safety.</p>
                    </div>
                </div>
                <button 
                    onClick={() => setShowProfile(!showProfile)}
                    style={{ background: 'var(--primary)', border: 'none', color: '#fff', padding: '0.8rem 1.5rem', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <UserIcon size={18} /> {showProfile ? 'View Guides' : 'Emergency Profile'}
                </button>
            </div>

            {showProfile ? (
                <div className="sundar-card fade-in" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Medical ID</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Important information for first responders.</p>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div style={{ padding: '1.25rem', background: '#f8f9fa', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Name</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{emergencyProfile.name}</div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ padding: '1.25rem', background: '#fce8e6', borderRadius: 'var(--radius-md)', border: '1px solid #f5c2c7' }}>
                                <div style={{ fontSize: '0.8rem', color: '#d93025', fontWeight: 600 }}>Blood Group</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#d93025' }}>{emergencyProfile.bloodGroup}</div>
                            </div>
                            <div style={{ padding: '1.25rem', background: '#f8f9fa', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Conditions</div>
                                <div style={{ fontSize: '1rem', fontWeight: 700 }}>{emergencyProfile.conditions}</div>
                            </div>
                        </div>

                        <div style={{ padding: '1.25rem', background: '#f8f9fa', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Allergies</div>
                            <div style={{ fontSize: '1rem', fontWeight: 700 }}>{emergencyProfile.allergies}</div>
                        </div>

                        <div style={{ padding: '1.25rem', background: '#f8f9fa', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Emergency Contacts</div>
                            {emergencyProfile.contacts.map((c, i) => (
                                <div key={i} style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', marginTop: '4px' }}>{c}</div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {!situation ? (
                        <div className="sundar-grid">
                            {Object.entries(situations).map(([key, data]) => (
                                <button 
                                    key={key}
                                    onClick={() => setSituation(key)}
                                    className="sundar-card"
                                    style={{ 
                                        textAlign: 'center', 
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease'
                                    }}
                                >
                                    <div style={{ display: 'inline-flex', padding: '1.5rem', background: `${data.color}15`, borderRadius: '50%', marginBottom: '1.5rem' }}>
                                        <data.icon size={40} color={data.color} />
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{data.label}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>Essential survival steps</p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <button 
                                onClick={() => setSituation(null)}
                                style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '0.5rem 0' }}
                            >
                                <ArrowLeft size={18} /> Back to Guides
                            </button>

                            <div className="sundar-grid">
                                <div className="sundar-card">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                                        <CheckCircle size={24} color="var(--success)" />
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>What to do</h3>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {situations[situation].do.map((text, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                                <div style={{ marginTop: '4px' }}><CheckCircle size={16} color="var(--success)" /></div>
                                                <div style={{ fontSize: '1rem', color: 'var(--text-main)', lineHeight: '1.5' }}>{text}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="sundar-card">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                                        <XCircle size={24} color="var(--danger)" />
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>What to avoid</h3>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {situations[situation].notDo.map((text, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                                <div style={{ marginTop: '4px' }}><XCircle size={16} color="var(--danger)" /></div>
                                                <div style={{ fontSize: '1rem', color: 'var(--text-main)', lineHeight: '1.5' }}>{text}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            <div className="sundar-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Battery size={20} color="var(--primary)" />
                    <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>AIDRO will automatically optimize for low battery when needed.</p>
                </div>
            </div>
        </div>
    );
};

export default DisasterHub;
