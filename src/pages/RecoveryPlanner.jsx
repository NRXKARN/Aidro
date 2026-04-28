import React, { useState } from 'react';
import { ClipboardCheck, FileText, ShieldCheck, Activity, CheckCircle, ArrowUpRight } from 'lucide-react';

const RecoveryPlanner = () => {
    const [stabilityIndices] = useState([
        { label: 'Infrastructure', value: '78%', target: '94%' },
        { label: 'Public Health', value: '62%', target: '88%' },
        { label: 'Safe Housing', value: '34%', target: '70%' },
        { label: 'Resource Access', value: '88%', target: '92%' }
    ]);

    const [sectors] = useState([
        { id: 'ALPHA', stability: '82%', aidStatus: 'GRANTED', notes: 'Rebuilding primary medical clinic' },
        { id: 'BETA', stability: '44%', aidStatus: 'PENDING', notes: 'Evacuation complete. Awaiting structural scan.' },
        { id: 'GAMMA', stability: '12%', aidStatus: 'URGENT', notes: 'High flood damage. Secondary sweep required.' }
    ]);

    const [checklist] = useState([
        { id: 1, text: "Government ID Verification (National DB Sync)", priority: "CRITICAL" },
        { id: 2, text: "Geotagged Damage Documentation (Photo Evidence)", priority: "HIGH" },
        { id: 3, text: "Structural Integrity Certification Request", priority: "STANDARD" }
    ]);

    return (
        <div className="fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
            
            {/* HEADER */}
            <div className="card-horizon" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: 'var(--success)', padding: '10px', borderRadius: '10px' }}>
                        <ShieldCheck size={28} color="#fff" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Community Recovery Strategy</h2>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AUTHORIZED_AIDRO_AID_CHANNEL // Long-term stabilization roadmap</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="sos-btn-v5" style={{ padding: '0.6rem 2rem', borderRadius: '8px', fontWeight: 700 }}>Export Recovery Log</button>
                    <button className="sos-btn-v5" style={{ padding: '0.6rem 2rem', background: 'var(--success)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700 }}>Initiate Aid Batch</button>
                </div>
            </div>

            {/* TOP: STABILITY METRICS (HORIZONTAL) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {stabilityIndices.map((idx, i) => (
                    <div key={i} className="card-horizon" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)' }}>{idx.label}</span>
                            <Activity size={18} color="var(--primary)" />
                        </div>
                        <div style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0.5rem 0' }}>{idx.value}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 700 }}>{idx.target} RECOVERY TARGET</div>
                    </div>
                ))}
            </div>

            {/* MID: REQUIRED DOCUMENTATION (HORIZONTAL) */}
            <div className="card-horizon" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                    <FileText color="var(--primary)" size={20} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Required Verification Steps</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.25rem' }}>
                    {checklist.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: '1rem', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', alignItems: 'center' }}>
                            <div style={{ width: '22px', height: '22px', borderRadius: '6px', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckCircle size={14} color="var(--primary)" opacity={0.2} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '4px' }}>{item.priority} PRIORITY</div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.text}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* BOTTOM: AID ELIGIBILITY (HORIZONTAL) */}
            <div className="card-horizon" style={{ padding: '2rem', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                    <ClipboardCheck size={24} color="var(--primary)" />
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Safety & Aid Eligibility Queue</h2>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified community requests for reconstruction support</p>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.25rem' }}>
                    {sectors.map(sec => (
                        <div key={sec.id} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1rem' }}>
                                <span style={{ color: 'var(--primary)' }}>● SECTOR {sec.id}</span>
                                <span style={{ color: 'var(--success)', background: 'rgba(34, 197, 94, 0.1)', padding: '2px 10px', borderRadius: '4px' }}>{sec.aidStatus}</span>
                            </div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Stability: {sec.stability}</div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>Current Objective: {sec.notes}</p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className="sos-btn-v5" style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', fontWeight: 700 }}>Grant Aid</button>
                                <button className="sos-btn-v5" style={{ flex: 1, padding: '0.75rem', borderColor: 'var(--border-dim)', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    Inspect <ArrowUpRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecoveryPlanner;
