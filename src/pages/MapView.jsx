import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap, useMapEvents, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ShieldAlert, Navigation2, Crosshair, Flag, MapPin, AlertTriangle } from 'lucide-react';
import CONFIG from '../config/config';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const targetIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const MapClickHandler = ({ onMark }) => {
    useMapEvents({
        click: (e) => onMark([e.latlng.lat, e.latlng.lng])
    });
    return null;
};

const ChangeView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

const MapView = ({ coords, lowPower, onQuickSOS }) => {
    const [quakes, setQuakes] = useState([]);
    const [layer, setLayer] = useState('threat');
    const [destination, setDestination] = useState(null);
    const [mapCenter, setMapCenter] = useState([coords?.lat || 18.4013, coords?.lng || 76.5519]);
    const [showRiskZones, setShowRiskZones] = useState(true);
    const [zoneLevel, setZoneLevel] = useState('All');
    const [showSafeZones, setShowSafeZones] = useState(true);
    const isOffline = !navigator.onLine;

    const riskZones = [
        { pos: [18.5204, 73.8567], type: 'Flood Risk', radius: 2000, level: 'High' },
        { pos: [18.4500, 76.5000], type: 'Landslide Risk', radius: 3000, level: 'High' },
        { pos: [18.3800, 76.5200], type: 'Structural Damage', radius: 1000, level: 'Medium' }
    ];

    const safeZones = [
        { pos: [18.4213, 76.5419], type: 'Central Shelter', radius: 1500 },
        { pos: [18.4000, 76.6000], type: 'Medical Camp', radius: 2500 }
    ];

    const fetchQuakeLayer = useCallback(async () => {
        if (isOffline || lowPower) return;
        try {
            const resp = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson');
            const data = await resp.json();
            setQuakes(data.features.map(f => ({
                id: f.id,
                pos: [f.geometry.coordinates[1], f.geometry.coordinates[0]],
                mag: f.properties.mag,
                title: f.properties.title
            })));
        } catch (e) {
            console.error("Earthquake data sync failed.");
        }
    }, [isOffline, lowPower]);

    useEffect(() => {
        fetchQuakeLayer();
        const interval = setInterval(fetchQuakeLayer, (lowPower ? 900 : 300) * 1000);
        return () => clearInterval(interval);
    }, [fetchQuakeLayer, lowPower]);

    return (
        <div style={{ height: '100%', width: '100%', position: 'relative', background: '#f8f9fa' }}>
            
            {/* CLEAN_MAP_CONTROLS */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', zIndex: 1000, display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' }}>
                <div style={{ display: 'flex', gap: '12px', pointerEvents: 'auto' }}>
                    <div className="sundar-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Flag size={18} color={destination ? 'var(--success)' : 'var(--text-muted)'} />
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                            {destination ? 'Destination Set' : 'Click map to set goal'}
                        </div>
                    </div>
                    <button 
                        onClick={() => {
                            const levels = ['All', 'High', 'Medium', 'Hidden'];
                            const next = levels[(levels.indexOf(zoneLevel) + 1) % levels.length];
                            setZoneLevel(next);
                            setShowRiskZones(next !== 'Hidden');
                        }} 
                        style={{ 
                            background: showRiskZones ? 'var(--danger)' : '#fff', 
                            border: '1px solid var(--border)', 
                            padding: '10px', 
                            borderRadius: '12px', 
                            cursor: 'pointer', 
                            color: showRiskZones ? '#fff' : 'var(--text-main)',
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            fontSize: '0.8rem', 
                            fontWeight: 600,
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }}
                    >
                        <ShieldAlert size={14} /> Danger Level: {zoneLevel}
                    </button>
                    <button 
                        onClick={() => setShowSafeZones(!showSafeZones)} 
                        style={{ 
                            background: showSafeZones ? 'var(--success)' : '#fff', 
                            border: '1px solid var(--border)', 
                            padding: '10px', 
                            borderRadius: '12px', 
                            cursor: 'pointer', 
                            color: showSafeZones ? '#fff' : 'var(--text-main)',
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            fontSize: '0.8rem', 
                            fontWeight: 600,
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }}
                    >
                        <ShieldAlert size={14} /> {showSafeZones ? 'Hide Safe' : 'Show Safe'}
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
                    <button 
                        onClick={() => {
                            if (!coords || !coords.lat || !coords.lng) return;
                            let nearest = null;
                            let minDistance = Infinity;
                            safeZones.forEach(zone => {
                                const dLat = coords.lat - zone.pos[0];
                                const dLng = coords.lng - zone.pos[1];
                                const distance = Math.sqrt(dLat * dLat + dLng * dLng);
                                if (distance < minDistance) {
                                    minDistance = distance;
                                    nearest = zone;
                                }
                            });
                            if (nearest) {
                                setDestination(nearest.pos);
                                setMapCenter(nearest.pos);
                            }
                        }}
                        style={{ background: 'var(--success)', border: 'none', padding: '10px 20px', borderRadius: '100px', cursor: 'pointer', color: '#fff', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(26, 115, 232, 0.2)' }}
                    >
                        <MapPin size={16} /> Nearest Shelter
                    </button>
                    <button onClick={() => setLayer(layer === 'nav' ? 'threat' : 'nav')} style={{ background: '#fff', border: '1px solid var(--border)', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-main)', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <Navigation2 size={20} />
                    </button>
                    <button onClick={() => setMapCenter([coords.lat, coords.lng])} style={{ background: '#fff', border: '1px solid var(--border)', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: 'var(--primary)', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <Crosshair size={20} />
                    </button>
                </div>
            </div>

            {/* FLOATING_SOS_QUICK_ACTION */}
            <button 
                onClick={onQuickSOS}
                style={{ position: 'absolute', bottom: '130px', right: '20px', zIndex: 1000, width: '60px', height: '60px', background: 'var(--danger)', border: 'none', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 24px rgba(217, 48, 37, 0.4)' }}
            >
                <div className="pulse" style={{ position: 'absolute', width: '100%', height: '100%', background: 'inherit', borderRadius: '50%', opacity: 0.3 }}></div>
                <AlertTriangle size={24} />
            </button>

            <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                <ChangeView center={mapCenter} />
                <MapClickHandler onMark={setDestination} />
                
                <TileLayer
                    url={layer === 'nav' ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"}
                    attribution='&copy; OpenStreetMap'
                />

                {coords && (
                    <Marker position={[coords.lat, coords.lng]} icon={userIcon}>
                        <Popup><div style={{ fontWeight: 700 }}>Your Location</div></Popup>
                    </Marker>
                )}

                {destination && (
                    <Marker position={destination} icon={targetIcon}>
                        <Popup><div style={{ fontWeight: 700 }}>Chosen Safe Destination</div></Popup>
                    </Marker>
                )}

                {showRiskZones && riskZones.filter(z => zoneLevel === 'All' || z.level === zoneLevel).map((z, i) => (
                    <Circle key={`risk-${i}`} center={z.pos} radius={z.radius} pathOptions={{ color: '#d93025', fillColor: '#d93025', fillOpacity: 0.15, dashArray: '8, 8' }}>
                        <Popup><div style={{ fontWeight: 700 }}>{z.type} Area (Level: {z.level})</div></Popup>
                    </Circle>
                ))}

                {showSafeZones && safeZones.map((z, i) => (
                    <Circle key={`safe-${i}`} center={z.pos} radius={z.radius} pathOptions={{ color: '#1e8e3e', fillColor: '#1e8e3e', fillOpacity: 0.15, dashArray: '8, 8' }}>
                        <Popup><div style={{ fontWeight: 700 }}>{z.type} (Safe Zone)</div></Popup>
                    </Circle>
                ))}

                {coords && coords.lat && coords.lng && destination && (
                    <Polyline 
                        positions={[[coords.lat, coords.lng], destination]} 
                        pathOptions={{ 
                            color: 'var(--primary)', 
                            weight: 3, 
                            dashArray: '10, 10', 
                            opacity: 0.6 
                        }}
                    />
                )}

                {quakes.map(q => (
                    <React.Fragment key={q.id}>
                        <Circle center={q.pos} radius={q.mag * 20000} pathOptions={{ color: '#ea4335', fillColor: '#ea4335', fillOpacity: 0.1, weight: 1 }} />
                        <Marker position={q.pos}>
                            <Popup><div style={{ color: '#d93025', fontWeight: 700 }}>Magnitude {q.mag} Earthquake</div></Popup>
                        </Marker>
                    </React.Fragment>
                ))}
            </MapContainer>

            {/* ROUTE_INFO_OVERLAY */}
            {destination && (
                <div className="sundar-card" style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, padding: '12px 24px', display: 'flex', gap: '20px', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                     <div>
                         <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Route Active</div>
                         <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--success)' }}>Safe path calculated</div>
                     </div>
                     <button onClick={() => setDestination(null)} style={{ background: '#f8f9fa', border: '1px solid var(--border)', color: 'var(--danger)', padding: '6px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                </div>
            )}

            <div className="sundar-card" style={{ position: 'absolute', bottom: '30px', left: '20px', zIndex: 1000, padding: '10px 20px', display: 'flex', gap: '15px', fontSize: '0.8rem', fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', background: '#1a73e8', borderRadius: '50%' }} /> You</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', background: '#1e8e3e', borderRadius: '50%' }} /> Safe Zone</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', background: '#d93025', opacity: 0.5, borderRadius: '50%' }} /> Danger</div>
            </div>
        </div>
    );
};

export default MapView;
