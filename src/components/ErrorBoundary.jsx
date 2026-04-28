import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Module Crash Detected:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="sundar-card" style={{ padding: '3rem', textAlign: 'center', border: '2px dashed var(--danger)' }}>
          <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Something didn't load correctly</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>We've isolated the issue to keep the rest of the app running.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
                background: 'var(--primary)', 
                color: '#fff', 
                border: 'none', 
                padding: '0.8rem 2rem', 
                borderRadius: '100px', 
                fontWeight: 600, 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '10px',
                cursor: 'pointer'
            }}
          >
            <RefreshCw size={18} /> Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
