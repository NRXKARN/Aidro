import React, { useState } from 'react';
import { ShieldAlert, LogIn } from 'lucide-react';
import './Login.css';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ id: '', pin: '' });

    const handleLogin = (e) => {
        e.preventDefault();
        // Logical flow for demo: any input redirects to dashboard in a real app
        alert("Authenticating through AIDRO Secure Gateway...");
    };

    return (
        <div className="login-root">
            <div className="login-visual-bg">
                <div className="blur-circle c1"></div>
                <div className="blur-circle c2"></div>
            </div>
            
            <div className="login-card glass-card">
                <div className="login-header">
                    <ShieldAlert size={64} className="text-primary pulse" />
                    <h1>AIDRO</h1>
                    <p>Strategic Disaster Management Portal</p>
                </div>
                
                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-field">
                        <label>Personnel ID</label>
                        <input 
                            type="text" 
                            placeholder="AIDRO-XXXX-XX" 
                            onChange={(e) => setCredentials({...credentials, id: e.target.value})}
                        />
                    </div>
                    <div className="input-field">
                        <label>Secure PIN</label>
                        <input 
                            type="password" 
                            placeholder="••••••"
                            onChange={(e) => setCredentials({...credentials, pin: e.target.value})}
                        />
                    </div>
                    <button type="submit" className="login-btn">
                        AUTHORIZE ACCESS <LogIn size={20} />
                    </button>
                    <div className="login-footer">
                        <a href="#">Forgot Credentials?</a>
                        <span className="divider"></span>
                        <a href="#">Emergency Bypass</a>
                    </div>
                </form>
            </div>

            <div className="login-system-status">
                <span className="dot active"></span> AI Node 01: ONLINE | SECURE ENCLAVE ACTIVE
            </div>
        </div>
    );
};

export default LoginPage;
