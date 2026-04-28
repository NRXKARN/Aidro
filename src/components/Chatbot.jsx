import React, { useState } from 'react';
import { Send, ShieldAlert, Zap, Heart, Info, Wind, Activity, Mic } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: "AIDRO MISSION INTELLIGENCE ACTIVE. I can provide survival protocols, psychological grounding, or resource localization. State your situation." }
  ]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle");

  const quickActions = [
    { label: "SURVIVAL PROTOCOL", value: "Provide immediate survival steps for current disaster." },
    { label: "PSYCH GROUNDING", value: "Initiate 60-second breathing/grounding protocol." },
    { label: "RESOURCE LOCATOR", value: "Where is the nearest medical and supply hub?" }
  ];

  const handleSend = async (text) => {
    const val = text || input;
    if (!val.trim()) return;

    setMessages(prev => [...prev, { type: 'user', text: val }]);
    setInput("");
    setStatus("typing");

    try {
      const res = await fetch('/api/chat', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
              message: val,
              history: messages.slice(-10) // Send last 10 messages for context
          })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { type: 'bot', text: data.reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { type: 'bot', text: "PRIMARY DATA LINK SEVERED. REVERTING TO CACHE: Move to higher ground. Signal via light at night." }]);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="guardian-bot-floating fade-in">
      <div className="bot-window">
        <div className="bot-inner-header" style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
           <Zap size={14} color="var(--primary)" className="pulse" /> 
           <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px' }}>MISSION INTEL ASSISTANT</span>
        </div>
        
        <div className="bot-feed" style={{ height: '350px', overflowY: 'auto' }}>
          {messages.map((m, i) => (
            <div key={i} className={`msg-row ${m.type}`} style={{ display: 'flex', flexDirection: m.type === 'user' ? 'row-reverse' : 'row' }}>
               <div className="msg-bubble" style={{ 
                 background: m.type === 'user' ? 'var(--primary)' : 'rgba(30, 41, 59, 0.5)',
                 color: m.type === 'user' ? '#fff' : '#e2e8f0',
                 border: '1px solid var(--border)'
               }}>{m.text}</div>
            </div>
          ))}
          {status === "typing" && (
            <div className="msg-row bot">
              <div className="msg-bubble" style={{ opacity: 0.6 }}>ANALYZING TELEMETRY...</div>
            </div>
          )}
        </div>

        <div className="quick-chips" style={{ padding: '0.75rem 1.5rem', display: 'flex', gap: '8px', overflowX: 'auto', borderTop: '1px solid var(--border)' }}>
           {quickActions.map(act => (
             <button key={act.label} className="chip" onClick={() => handleSend(act.value)} style={{ whiteSpace: 'nowrap' }}>
                {act.label}
             </button>
           ))}
        </div>

        <div className="bot-input-field" style={{ padding: '1rem 1.5rem', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="INPUT COMMAND OR QUERY..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
          />
          <button onClick={() => handleSend()} disabled={status === "typing"} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
