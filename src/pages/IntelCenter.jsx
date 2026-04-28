import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, ShieldAlert, Zap, HeartPulse, MapPin, AlertCircle, Sparkles, Mic } from 'lucide-react';
import CONFIG from '../config/config';

const IntelCenter = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm your safety assistant. I can provide emergency guidance, first aid instructions, or help you find the nearest safe zone. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const scrollRef = useRef(null);

    const quickActions = [
        { label: 'Earthquake Safety', icon: Zap, prompt: 'What should I do during an earthquake?' },
        { label: 'Flood Guidance', icon: MapPin, prompt: 'How do I evacuate safely during a flood?' },
        { label: 'First Aid Help', icon: HeartPulse, prompt: 'Give me basic first aid instructions for common injuries.' },
    ];

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleInquiry = async (userPrompt) => {
        const query = userPrompt || input;
        if (!query) return;

        setMessages(prev => [...prev, { role: 'user', content: query }]);
        setInput('');
        setLoading(true);

        // Proceed to AI-driven analysis for all queries


        try {
            const API_BASE = CONFIG.API_BASE_URL;
            const response = await fetch(`${API_BASE}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    message: query, 
                    history: messages.map(m => ({ type: m.role, text: m.content })) 
                })
            });
            const data = await response.json();
            const reply = data.reply || "I'm having trouble connecting right now, but please follow safety grounding protocols and stay in a safe area.";
            
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm currently offline, but stay calm and seek higher ground or a designated shelter." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in" style={{ height: '70vh', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {quickActions.map((action, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleInquiry(action.prompt)}
                        className="sundar-card" 
                        style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textAlign: 'left', border: '1px solid var(--border)' }}
                    >
                        <div style={{ background: 'var(--primary-light)', padding: '8px', borderRadius: '10px' }}>
                            <action.icon size={20} color="var(--primary)" />
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{action.label}</span>
                    </button>
                ))}
            </div>

            <div className="sundar-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem', background: '#fff' }}>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '1rem' }}>
                    {messages.map((m, i) => (
                        <div key={i} style={{ 
                            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '80%',
                            padding: '1rem 1.5rem',
                            borderRadius: '20px',
                            background: m.role === 'user' ? 'var(--primary)' : '#f1f3f4',
                            color: m.role === 'user' ? '#fff' : 'var(--text-main)',
                            borderBottomLeftRadius: m.role === 'assistant' ? '4px' : '20px',
                            borderBottomRightRadius: m.role === 'user' ? '4px' : '20px',
                        }}>
                            <div style={{ fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{m.content}</div>
                        </div>
                    ))}
                    {loading && (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                            <Sparkles size={16} className="spin" />
                            Thinking...
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>

                <div style={{ display: 'flex', gap: '12px', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', marginTop: '1rem' }}>
                    <button 
                        onClick={() => {
                            if (isListening) {
                                window.recognition?.stop();
                                setIsListening(false);
                            } else {
                                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                                if (SpeechRecognition) {
                                    const rec = new SpeechRecognition();
                                    rec.onresult = (e) => {
                                        const transcript = e.results[0][0].transcript;
                                        setInput(transcript);
                                        handleInquiry(transcript);
                                    };
                                    rec.start();
                                    window.recognition = rec;
                                    setIsListening(true);
                                } else {
                                    alert("Voice recognition not supported on this browser.");
                                }
                            }
                        }}
                        style={{ 
                            background: isListening ? 'var(--danger)' : '#f1f3f4', 
                            border: 'none', borderRadius: '50%', width: '48px', height: '48px', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            color: isListening ? '#fff' : 'var(--text-muted)'
                        }}
                    >
                        <Mic size={20} className={isListening ? 'pulse' : ''} />
                    </button>
                    <input 
                        type="text" 
                        placeholder="Ask me anything..." 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleInquiry()}
                        style={{ flex: 1, background: '#f8f9fa', border: '1px solid var(--border)', borderRadius: '100px', padding: '0.8rem 1.5rem', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }}
                    />
                    <button 
                        onClick={() => handleInquiry()} 
                        style={{ background: 'var(--primary)', border: 'none', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        <Send size={20} color="#fff" />
                    </button>
                </div>
            </div>
            <style>{`
                .pulse { animation: pulse-red-mic 1.5s infinite; }
                @keyframes pulse-red-mic {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default IntelCenter;
