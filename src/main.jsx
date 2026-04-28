import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

console.log("MAINTAIN_INIT_SEQUENCE_START");

// GLOBAL ERROR CATCHER FOR BLANK SCREEN DEBUGGING
window.addEventListener('error', (e) => {
    document.body.innerHTML += `<div style="background:#d93025;color:white;padding:20px;z-index:9999;position:fixed;top:0;left:0;width:100%;font-family:monospace;">
        <h3 style="margin:0 0 10px 0;">INIT FATAL ERROR:</h3>
        <pre style="margin:0;">${e.error?.stack || e.message}</pre>
    </div>`;
});
window.addEventListener('unhandledrejection', (e) => {
    document.body.innerHTML += `<div style="background:#f9ab00;color:black;padding:20px;z-index:9999;position:fixed;top:0;left:0;width:100%;font-family:monospace;">
        <h3 style="margin:0 0 10px 0;">INIT PROMISE REJECTION:</h3>
        <pre style="margin:0;">${e.reason?.stack || e.reason}</pre>
    </div>`;
});

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// REGISTER_SW_FOR_OFFLINE_MISSION_RESILIENCY
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW_SENTINEL_ACTIVE: ', registration.scope);
    }).catch(error => {
      console.log('SW_SYNC_FAILED: ', error);
    });
  });
}
