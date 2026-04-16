import React, { useState } from 'react';
import { Layers, Map as MapIcon, Navigation, Target, Activity } from 'lucide-react';
import './MapView.css';

const MapView = () => {
    const [selectedZone, setSelectedZone] = useState(null);

    const zones = [
        { id: 1, name: 'Sector 7 - North Delta', risk: 94, status: 'Critical', coord: {x: 40, y: 30} },
        { id: 2, name: 'Riverside Precinct', risk: 62, status: 'Warning', coord: {x: 65, y: 55} },
        { id: 3, name: 'Industrial Hub B', risk: 28, status: 'Stable', coord: {x: 25, y: 70} },
    ];

    return (
        <div className="map-view-root">
            <div className="map-canvas-container">
                <div className="map-grid-overlay"></div>
                
                {/* Simulated Map Markers */}
                {zones.map(zone => (
                    <div 
                        key={zone.id} 
                        className={`map-marker ${zone.status.toLowerCase()}`}
                        style={{ top: `${zone.coord.y}%`, left: `${zone.coord.x}%` }}
                        onClick={() => setSelectedZone(zone)}
                    >
                        <div className="marker-ping"></div>
                        <Target size={24} />
                        <span className="marker-label">{zone.risk}</span>
                    </div>
                ))}

                <img 
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" 
                    className="base-map" 
                    alt="Satellite Terrain" 
                />
            </div>

            <div className="map-ui-overlay">
                <header className="map-toolbar glass-card">
                    <div className="tool-group">
                        <button className="tool-btn active"><MapIcon size={20} /> Satellite</button>
                        <button className="tool-btn"><Layers size={20} /> Heatmap</button>
                        <button className="tool-btn"><Navigation size={20} /> Traffic</button>
                    </div>
                    <div className="map-search">
                        <input type="text" placeholder="Locate sector..." />
                    </div>
                </header>

                <aside className="map-sidebar glass-card">
                    <div className="sidebar-header">
                        <Activity size={24} color="#00d2ff" />
                        <h3>Zone Analytics</h3>
                    </div>
                    
                    {selectedZone ? (
                        <div className="zone-details fade-in">
                            <h2>{selectedZone.name}</h2>
                            <div className="risk-score-display">
                                <span className="label">AI Risk Index</span>
                                <span className="value">{selectedZone.risk}%</span>
                            </div>
                            <div className="zone-stats">
                                <div className="stat">
                                    <label>Population</label>
                                    <strong>12.4k</strong>
                                </div>
                                <div className="stat">
                                    <label>Resilience</label>
                                    <strong>Low</strong>
                                </div>
                            </div>
                            <button className="btn-deploy">DEPLOY LOGISTICS</button>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>Select a tactical node to view AI predicted risk levels and infrastructure status.</p>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
};

export default MapView;
