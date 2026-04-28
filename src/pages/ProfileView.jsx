import React, { useState, useEffect } from 'react';
import { User, Activity, Phone, AlertCircle, Save, CheckCircle } from 'lucide-react';

const ProfileView = () => {
    const [profile, setProfile] = useState({
        name: '',
        bloodGroup: 'A+',
        emergencyContactName: '',
        emergencyContactNumber: '',
        medicalConditions: '',
        allergies: ''
    });

    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const savedProfile = localStorage.getItem('aidro_user_profile');
        if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
        setSaved(false);
    };

    const handleSave = () => {
        localStorage.setItem('aidro_user_profile', JSON.stringify(profile));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px', margin: '0 auto', paddingBottom: '2rem' }}>
            <div className="sundar-card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, var(--primary) 0%, #1a73e8 100%)', color: '#fff' }}>
                <div style={{ display: 'inline-flex', padding: '1.5rem', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', marginBottom: '1rem' }}>
                    <User size={48} />
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Your Medical Profile</h1>
                <p style={{ opacity: 0.9 }}>This information will be used by emergency responders.</p>
            </div>

            <div className="sundar-card">
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={20} color="var(--primary)" /> Basic Information
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Full Name</label>
                        <input 
                            type="text" 
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            placeholder="e.g. John Doe"
                            style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '1rem', boxSizing: 'border-box' }}
                        />
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Blood Group</label>
                        <select 
                            name="bloodGroup"
                            value={profile.bloodGroup}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '1rem', boxSizing: 'border-box', background: '#fff' }}
                        >
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="Unknown">Unknown</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="sundar-card">
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={20} color="#d93025" /> Emergency Contacts
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Contact Name (Relationship)</label>
                        <input 
                            type="text" 
                            name="emergencyContactName"
                            value={profile.emergencyContactName}
                            onChange={handleChange}
                            placeholder="e.g. Jane Doe (Mother)"
                            style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '1rem', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Contact Number (WhatsApp enabled)</label>
                        <input 
                            type="tel" 
                            name="emergencyContactNumber"
                            value={profile.emergencyContactNumber}
                            onChange={handleChange}
                            placeholder="e.g. 919372150328"
                            style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '1rem', boxSizing: 'border-box' }}
                        />
                    </div>
                </div>
            </div>

            <div className="sundar-card">
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={20} color="#f9ab00" /> Health & Medical
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Existing Medical Conditions</label>
                        <textarea 
                            name="medicalConditions"
                            value={profile.medicalConditions}
                            onChange={handleChange}
                            placeholder="Asthma, Diabetes, Heart condition, etc. (Optional)"
                            rows="3"
                            style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '1rem', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Known Allergies</label>
                        <textarea 
                            name="allergies"
                            value={profile.allergies}
                            onChange={handleChange}
                            placeholder="Penicillin, Peanuts, Bee stings, etc. (Optional)"
                            rows="2"
                            style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '1rem', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }}
                        />
                    </div>
                </div>
            </div>

            <button 
                onClick={handleSave}
                style={{ 
                    width: '100%',
                    padding: '1.25rem',
                    background: saved ? '#34a853' : 'var(--primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '100px',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    boxShadow: saved ? '0 8px 20px rgba(52, 168, 83, 0.3)' : '0 8px 20px rgba(66, 133, 244, 0.3)'
                }}
            >
                {saved ? (
                    <><CheckCircle size={22} /> Profile Saved</>
                ) : (
                    <><Save size={22} /> Save Information</>
                )}
            </button>
        </div>
    );
};

export default ProfileView;
