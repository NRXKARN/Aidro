import React, { useState } from 'react';
import { MessageSquare, Send, X, Bot } from 'lucide-react';
import { GeminiService } from '../services/GeminiService';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am AIDRO Assistant. How can I help you today? I support multiple languages.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Use the existing GeminiService to get a response
      const response = await GeminiService.analyzeHelpRequest(input); // Reusing logic for demo
      // In a real chatbot, we would use a different prompt for conversation
      const botMsg = { role: 'bot', text: response.summary || "I have noted your request and prioritized it in the system." };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "I'm having trouble connecting. Please try again or use the SOS button." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chatbot-wrapper ${isOpen ? 'open' : ''}`}>
      {!isOpen && (
        <button className="chat-toggle pulse" onClick={() => setIsOpen(true)}>
          <MessageSquare size={24} />
          <span className="tooltip">Ask Gemini</span>
        </button>
      )}

      {isOpen && (
        <div className="chat-window glass-card">
          <div className="chat-header">
            <div className="header-info">
              <Bot size={20} color="#00d2ff" />
              <span>AIDRO AI Support</span>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>
          
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                <div className="msg-bubble">{m.text}</div>
              </div>
            ))}
            {isLoading && <div className="msg bot loading">Thinking...</div>}
          </div>

          <form className="chat-input" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit"><Send size={18} /></button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
