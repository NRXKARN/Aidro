import React, { useEffect, useState } from 'react';
import { Activity, AlertCircle, Droplets, MapPin, Users } from 'lucide-react';
import { ApiService } from '../services/ApiService';
import './Dashboard.css';

/**
 * AIDRO Admin Dashboard Page
 */
const Dashboard = () => {
  const [liveStats, setLiveStats] = useState({ total_affected: '0', critical_zones: '0' });

  useEffect(() => {
    const fetchData = async () => {
      const stats = await ApiService.getDashboardStats();
      setLiveStats({
        total_affected: stats.total_affected.toLocaleString(),
        critical_zones: stats.critical_zones.toString()
      });
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Critical', value: liveStats.critical_zones, icon: <AlertCircle className="text-red-500" />, trend: '+3 since 1h' },
    { label: 'People Safe', value: liveStats.total_affected, icon: <Users className="text-blue-500" />, trend: '94% targeted' },
    { label: 'Resource Efficiency', value: '88%', icon: <Activity className="text-green-500" />, trend: '+12% optimized' },
    { label: 'Water Units Level', value: '42%', icon: <Droplets className="text-cyan-500" />, trend: 'Critical - Low' },
  ];

  return (
    <div className="dashboard-root">
      <header className="dash-header">
        <div className="dash-welcome">
          <h1>Command Center <span className="text-primary">AIDRO v2.0</span></h1>
          <p>AI prioritized response engine is active.</p>
        </div>
        <div className="dash-actions">
          <button className="btn-secondary">Export Report</button>
          <button className="btn-primary">Deploy Strategic Unit</button>
        </div>
      </header>

      <section className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="glass-stat-card">
            <div className="stat-header">
              <span className="stat-icon">{stat.icon}</span>
              <span className="stat-trend">{stat.trend}</span>
            </div>
            <div className="stat-main">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
            <div className="stat-progress-bg">
              <div className="stat-progress-bar" style={{width: '70%'}}></div>
            </div>
          </div>
        ))}
      </section>

      <main className="dash-content-grid">
        <div className="center-map-view glass-card">
          <div className="card-header">
            <h3>Tactical Impact Map</h3>
            <div className="map-legend">
              <span className="badge high">High Risk</span>
              <span className="badge medium">Moderate</span>
            </div>
          </div>
          <div className="map-placeholder-container">
            <div className="map-overlay">
              <div className="map-info-toast">
                <strong>Sector 7 - Submersion Risk</strong>
                <p>AI Priority Score: 98.4</p>
              </div>
            </div>
            <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=2033&auto=format&fit=crop" alt="Global Map View" />
          </div>
        </div>

        <aside className="notification-panel glass-card">
          <h3>Real-time Alerts</h3>
          <div className="alert-list">
            <AlertItem 
              type="Critical" 
              location="Riverside A" 
              message="Flash flooding reported. 40 families trapped."
              time="2m ago"
              score="94"
            />
            <AlertItem 
              type="Warning" 
              location="Industrial Sector" 
              message="Leaking containment unit detected by sensors."
              time="12m ago"
              score="72"
            />
          </div>
        </aside>
      </main>
    </div>
  );
};

const AlertItem = ({ type, location, message, time, score }) => (
  <div className={`alert-item-card ${type.toLowerCase()}`}>
    <div className="alert-meta">
      <span className="alert-type">{type}</span>
      <span className="alert-time">{time}</span>
    </div>
    <div className="alert-body">
      <strong>{location}</strong>
      <p>{message}</p>
    </div>
    <div className="alert-footer">
      <span className="ai-badge">Gemini Score: {score}</span>
    </div>
  </div>
);

export default Dashboard;
