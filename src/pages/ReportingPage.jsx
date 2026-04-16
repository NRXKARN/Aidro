import React, { useState } from 'react';
import { Send, MapPin, Camera, Mic, ShieldAlert } from 'lucide-react';
import './Reporting.css';

/**
 * AIDRO User Reporting Page
 * survivors can submit help requests with real-time AI analysis
 */
const ReportingPage = () => {
  const [report, setReport] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    // Simulate Gemini AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        priority: 'High',
        score: 88,
        summary: 'Emergency food and medical assistance requested for family in flooded attic.'
      });
    }, 2000);
  };

  return (
    <div className="reporting-root">
      <div className="reporting-container glass-card">
        <header className="reporting-header">
          <ShieldAlert size={48} className="text-red-500" />
          <h1>Emergency Assistance</h1>
          <p>Provide details of your situation. AIDRO AI will prioritize your request immediately.</p>
        </header>

        <form onSubmit={handleSubmit} className="report-form">
          <div className="input-group">
            <label>Current Status</label>
            <textarea 
              placeholder="E.g., I am trapped in Sector 7 with 3 people. Water is rising fast..." 
              value={report}
              onChange={(e) => setReport(e.target.value)}
              required
            />
          </div>

          <div className="quick-selectors">
            <button type="button" className="selector-btn">Medical</button>
            <button type="button" className="selector-btn">Rescue</button>
            <button type="button" className="selector-btn">Food/Water</button>
          </div>

          <div className="attachment-actions">
            <button type="button" className="action-btn"><MapPin /> Share Location</button>
            <button type="button" className="action-btn"><Camera /> Attach Photo</button>
            <button type="button" className="action-btn"><Mic /> Voice Note</button>
          </div>

          <button type="submit" className="submit-btn" disabled={isAnalyzing}>
            {isAnalyzing ? 'AI ANALYZING...' : 'SUBMIT ALERT'} <Send size={20} />
          </button>
        </form>

        {result && (
          <div className="analysis-result fade-in">
            <div className="priority-badge">{result.priority} Priority</div>
            <p>{result.summary}</p>
            <div className="progress-mini">
              <label>AI Confidence: {result.score}%</label>
              <div className="bar"><div className="fill" style={{width: `${result.score}%`}}></div></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportingPage;
