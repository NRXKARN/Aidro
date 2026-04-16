import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import ReportingPage from './pages/ReportingPage';
import LoginPage from './pages/LoginPage';
import MapView from './pages/MapView';
import Chatbot from './components/Chatbot';
import { ShieldAlert, LayoutDashboard, FileWarning, Map as MapIcon, LogOut, Package, Wifi } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [backendStatus, setBackendStatus] = useState("Checking...");

  // Milestone: Verify Backend Connection
  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then(res => res.json())
      .then(data => setBackendStatus(data.message))
      .catch(() => setBackendStatus("Offline ⚠️"));
  }, []);

  if (!isLoggedIn) {
    return <div onClick={() => setIsLoggedIn(true)}><LoginPage /></div>;
  }

  return (
    <div className="app-shell">
      <nav className="side-nav">
        <div className="nav-logo">
          <ShieldAlert size={32} color="#00d2ff" />
          <span>AIDRO</span>
        </div>
        
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
           <div style={{ background: 'rgba(0, 210, 255, 0.1)', padding: '0.5rem', borderRadius: '8px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Wifi size={12} color={backendStatus.includes('working') ? '#00d2ff' : '#ef4444'} />
              <span>API: {backendStatus}</span>
           </div>
        </div>

        <div className="nav-items">
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard /> Admin Dashboard
          </button>
          <button className={activeTab === 'map' ? 'active' : ''} onClick={() => setActiveTab('map')}>
            <MapIcon /> Tactical Map
          </button>
          <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>
            <Package /> Inventory
          </button>
          <button className={activeTab === 'report' ? 'active' : ''} onClick={() => setActiveTab('report')}>
            <FileWarning /> SOS Reporting
          </button>
          
          <div className="nav-spacer" style={{flex: 1}}></div>
          <button onClick={() => setIsLoggedIn(false)} className="logout-btn"><LogOut /> Log Out</button>
        </div>
      </nav>

      <main className="main-viewport">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'report' && <ReportingPage />}
        {activeTab === 'map' && <MapView />}
        {activeTab === 'inventory' && <div style={{padding: '2rem'}}><h1>Inventory Management</h1><p>Full-stack inventory tracking is active in inventory.py.</p></div>}
      </main>

      <Chatbot />
    </div>
  );
}

export default App;
