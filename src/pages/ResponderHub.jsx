import React, { useState, useEffect } from 'react';
import { Activity, Shield, Users, Radio, Globe } from 'lucide-react';
import CONFIG from '../config/config';

const ResponderHub = () => {
    const [rescueOps, setRescueOps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${CONFIG.API_BASE_URL}/fleet`)
            .then(res => res.json())
            .then(data => {
                setRescueOps(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', overflowY: 'auto' }}>
            
            {/* CORE_TELEMETRY_STRIP */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div className="card-horizon" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ padding: '12px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '10px' }}><Activity size={24} color="var(--primary)" /></div>
                    <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>ACTIVE_MISSION_SQUAD</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>12 UNITS</div>
                    </div>
                </div>
                <div className="card-horizon" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px' }}><Shield size={24} color="var(--success)" /></div>
                    <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>SECURE_ZONES_ESTABLISHED</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>4 SECTORS</div>
                    </div>
                </div>
            </div>

            {/* ASSET_STREAM */}
            <div className="card-horizon" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                    <Radio size={20} color="var(--primary)" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Fleet Deployment Stream</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {rescueOps.map((op, i) => (
                        <div key={i} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>{op.name || op.id}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                    SKILLS: {op.skills ? op.skills.join(', ').toUpperCase() : 'GENERAL'}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: op.status === 'IN_TRANSIT' ? 'var(--warning)' : 'var(--success)' }}>{op.status || 'UNKNOWN'}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SECTOR_MAP_LEGEND (Simplified) */}
            <div className="card-horizon" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.65rem', fontWeight: 800 }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--danger)' }} /> PRIMARY_HAZARD
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.65rem', fontWeight: 800 }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} /> EXTRACTION_POINT
                </div>
            </div>

        </div>
    );
};

export default ResponderHub;
