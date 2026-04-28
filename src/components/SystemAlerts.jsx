import React from 'react';
import { AlertCircle, Battery } from 'lucide-react';

const SystemAlerts = ({ lowBatteryMode, batterySupported }) => {
    if (lowBatteryMode) {
        return (
            <div style={{ background: '#fef7e0', color: '#b06000', padding: '0.75rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600, borderBottom: '1px solid #f9ab00', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <Battery size={16} />
                Battery Saver Active: GPS and UI elements are optimized for longevity.
            </div>
        );
    }

    if (!batterySupported) {
        return (
            <div style={{ background: '#f1f3f4', color: 'var(--text-muted)', padding: '0.5rem', textAlign: 'center', fontSize: '0.75rem' }}>
                Adaptive battery monitoring limited on this browser.
            </div>
        );
    }

    return null;
};

export default SystemAlerts;
