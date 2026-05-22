import React, { useState, useEffect } from 'react';

const LettersNeverSent = () => {
  const [stage, setStage] = useState('writing'); // 'writing', 'folding', 'flying', 'completed'
  const [letterText, setLetterText] = useState('');
  const [foldStep, setFoldStep] = useState(0); // 0 (flat), 1 (corners), 2 (half crease), 3 (plane ready)
  const [breathText, setBreathText] = useState('Inhale');

  // Breathing loop guide (8s cycle: 4s inhale, 4s exhale)
  useEffect(() => {
    if (stage !== 'completed') return;
    const interval = setInterval(() => {
      setBreathText((prev) => (prev === 'Inhale' ? 'Exhale' : 'Inhale'));
    }, 4000);
    return () => clearInterval(interval);
  }, [stage]);

  const handleCompleted = (e) => {
    e.preventDefault();
    if (!letterText.trim()) return;
    setStage('folding');
    setFoldStep(0);
  };

  const handleFoldClick = () => {
    if (foldStep < 3) {
      setFoldStep((prev) => prev + 1);
    }
  };

  const handleFlyAway = () => {
    setStage('flying');
    // Transition to completed stage after the flight animation finishes
    setTimeout(() => {
      setStage('completed');
    }, 2800);
  };

  const handleReset = () => {
    setLetterText('');
    setFoldStep(0);
    setStage('writing');
  };

  // SVG Paths for smooth paper-to-plane transitions
  const renderInteractivePaper = () => {
    const paperWidth = 240;
    const paperHeight = 320;

    if (foldStep === 0) {
      // Flat Ruled Paper
      return (
        <svg width="280" height="360" viewBox="0 0 280 360" className="interactive-fold-svg">
          {/* Main Paper Sheet */}
          <rect x="20" y="20" width={paperWidth} height={paperHeight} rx="8" fill="#ffffff" stroke="var(--border)" strokeWidth="1.5" filter="drop-shadow(0 12px 24px rgba(107, 68, 144, 0.1))" />
          {/* Vertical Red Line */}
          <line x1="60" y1="20" x2="60" y2="340" stroke="#f0cfc0" strokeWidth="1.5" />
          {/* Ruled Horizontal Lines */}
          {[...Array(11)].map((_, i) => (
            <line key={i} x1="20" y1={55 + i * 25} x2="260" y2={55 + i * 25} stroke="#faf0fc" strokeWidth="1.2" />
          ))}
          {/* Dimmed writing lines mimicking letters */}
          <path d="M70,80 L220,80 M70,105 L240,105 M70,130 L180,130 M70,155 L210,155 M70,180 L230,180" stroke="#e8d8f0" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 5" />
        </svg>
      );
    }

    if (foldStep === 1) {
      // Step 1: Top Corners Folded Down Inward
      return (
        <svg width="280" height="360" viewBox="0 0 280 360" className="interactive-fold-svg">
          {/* Bottom unfold area */}
          <path d="M20,120 L20,340 L260,340 L260,120 L140,20 Z" fill="#ffffff" stroke="var(--border)" strokeWidth="1.5" filter="drop-shadow(0 12px 24px rgba(107, 68, 144, 0.1))" />
          {/* Left Folded Flap */}
          <path d="M20,120 L140,20 L140,120 Z" fill="#fcfbfd" stroke="var(--border)" strokeWidth="1" />
          {/* Right Folded Flap */}
          <path d="M260,120 L140,20 L140,120 Z" fill="#fcfbfd" stroke="var(--border)" strokeWidth="1" />
          {/* Left fold line */}
          <line x1="20" y1="120" x2="140" y2="120" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
          {/* Right fold line */}
          <line x1="260" y1="120" x2="140" y2="120" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
          {/* Center line */}
          <line x1="140" y1="120" x2="140" y2="340" stroke="#e8d8f0" strokeWidth="1.2" />
          {/* Bottom horizontal ruled lines */}
          {[...Array(7)].map((_, i) => (
            <line key={i} x1="20" y1={170 + i * 24} x2="260" y2={170 + i * 24} stroke="#faf0fc" strokeWidth="1" />
          ))}
        </svg>
      );
    }

    if (foldStep === 2) {
      // Step 2: Tall triangle (paper creased in half vertically)
      return (
        <svg width="280" height="360" viewBox="0 0 280 360" className="interactive-fold-svg">
          {/* Folded vertical left-profile trapezoid */}
          <path d="M140,20 L140,340 L20,340 Z" fill="#ffffff" stroke="var(--border)" strokeWidth="1.5" filter="drop-shadow(0 12px 24px rgba(107, 68, 144, 0.1))" />
          {/* Side fold overlapping flap */}
          <path d="M140,20 L140,340 L80,340 Z" fill="#f8f5fc" stroke="var(--border)" strokeWidth="1" />
          {/* Crease lines */}
          <line x1="140" y1="20" x2="140" y2="340" stroke="#b89ec8" strokeWidth="2" />
        </svg>
      );
    }

    // Step 3: Complete volumetric paper plane ready to glide
    return (
      <svg width="280" height="360" viewBox="0 0 280 360" className="interactive-fold-svg final-plane">
        <defs>
          <linearGradient id="planeGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e8dbee" />
          </linearGradient>
          <linearGradient id="planeGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5effa" />
            <stop offset="100%" stopColor="#c5a9d8" />
          </linearGradient>
          <linearGradient id="planeBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b095c4" />
            <stop offset="100%" stopColor="#785990" />
          </linearGradient>
        </defs>
        
        {/* Shadow */}
        <path d="M60,280 L140,310 L220,280 Z" fill="rgba(107, 68, 144, 0.08)" filter="blur(6px)" />
        
        {/* Plane Parts */}
        {/* Left Wing Under */}
        <path d="M140,50 L40,250 L140,290 Z" fill="url(#planeGradLeft)" stroke="#d3c0e0" strokeWidth="1" />
        {/* Right Wing Under */}
        <path d="M140,50 L240,250 L140,290 Z" fill="url(#planeGradRight)" stroke="#c3acd5" strokeWidth="1" />
        
        {/* Main Body Bottom Crease */}
        <path d="M140,50 L140,290 L120,270 Z" fill="url(#planeBodyGrad)" />
        <path d="M140,50 L140,290 L160,270 Z" fill="#9b7db0" />
        
        {/* Outer wing fold lines */}
        <line x1="140" y1="50" x2="40" y2="250" stroke="#b89ec8" strokeWidth="1.5" />
        <line x1="140" y1="50" x2="240" y2="250" stroke="#9e80b2" strokeWidth="1.5" />
      </svg>
    );
  };

  const getInstructionText = () => {
    if (foldStep === 0) return "Click the paper to fold the top corners...";
    if (foldStep === 1) return "Click again to fold along the center crease...";
    if (foldStep === 2) return "Click once more to finish the wings...";
    return "Your letter has been folded into a paper plane. Ready to release?";
  };

  return (
    <div className="letters-page-container">
      {stage === 'writing' && (
        <div className="letters-stage-wrapper fade-in">
          <div className="letters-header">
            <h2>LETTER NEVER SENT</h2>
            <p className="letters-sub">(Write what your heart couldn't say)</p>
          </div>

          <form onSubmit={handleCompleted} className="letters-form">
            <div className="letters-paper-sheet">
              {/* Dimmed watermark text styled behind lines */}
              <div className="letters-watermark">
                <p>This space is for your feelings.</p>
                <p>No scores. No judgment. Just release.</p>
              </div>

              <textarea
                value={letterText}
                onChange={(e) => setLetterText(e.target.value)}
                placeholder="Anger, sadness, regret, frustration, or silent wishes... write them all here. Nobody will ever read this."
                className="letters-textarea"
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '28px' }}>
              <button type="submit" className="btn-book-now letters-btn" disabled={!letterText.trim()}>
                Completed ✓
              </button>
            </div>
          </form>
        </div>
      )}

      {stage === 'folding' && (
        <div className="letters-stage-wrapper fade-in" style={{ textAlign: 'center' }}>
          <div className="letters-header" style={{ marginBottom: '16px' }}>
            <h2>LETTER NEVER SENT</h2>
            <p className="letters-sub" style={{ color: 'var(--text-muted)' }}>Folding away your heavy emotions</p>
          </div>

          <p className="letters-fold-instruction">{getInstructionText()}</p>

          <div className="letters-interactive-canvas-box" onClick={handleFoldClick}>
            <div className={`letters-paper-wrapper step-${foldStep}`}>
              {renderInteractivePaper()}
            </div>
          </div>

          {foldStep === 3 && (
            <button 
              onClick={handleFlyAway} 
              className="btn-book-now letters-btn pulse-glow"
              style={{ marginTop: '24px', background: 'linear-gradient(135deg, #7c5c8a, #9b8fc0)' }}
            >
              Fly Away &amp; Let Go ✈️
            </button>
          )}

          <div className="letters-folding-footer">
            <span>Progress: {foldStep * 33}%</span>
            <div className="letters-progressbar">
              <div className="letters-progress-fill" style={{ width: `${foldStep * 33.3}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {stage === 'flying' && (
        <div className="letters-stage-wrapper sky-skyline fade-in">
          {/* Flying plane animation screen */}
          <div className="letters-starry-bg">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="letters-star" style={{
                top: `${Math.random() * 80}%`,
                left: `${Math.random() * 95}%`,
                animationDelay: `${Math.random() * 2}s`
              }}></div>
            ))}
          </div>

          <div className="flying-plane-container letters-plane-fly">
            {/* Shaded 3D perspective paper plane */}
            <svg width="150" height="150" viewBox="0 0 280 360">
              <path d="M140,50 L40,250 L140,290 Z" fill="#ffffff" stroke="#d3c0e0" strokeWidth="1" />
              <path d="M140,50 L240,250 L140,290 Z" fill="#f5effa" stroke="#c3acd5" strokeWidth="1" />
              <path d="M140,50 L140,290 L120,270 Z" fill="#b095c4" />
              <path d="M140,50 L140,290 L160,270 Z" fill="#9b7db0" />
            </svg>
            <div className="letters-smoke-trail"></div>
          </div>
          
          <div className="releasing-status-overlay">
            <p>Releasing your letter to the sky...</p>
          </div>
        </div>
      )}

      {stage === 'completed' && (
        <div className="letters-stage-wrapper sky-skyline fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          
          <div className="letters-starry-bg">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="letters-star" style={{
                top: `${Math.random() * 90}%`,
                left: `${Math.random() * 95}%`,
                animationDelay: `${Math.random() * 3}s`
              }}></div>
            ))}
          </div>

          <div className="letters-healing-card">
            <h1 className="letters-healing-quote">“Letting go is also a form of healing.”</h1>
            <p className="letters-healing-sub">
              Your feelings have been released into the universe. <br />
              You are safe. You are heard. You are lighter now.
            </p>
            
            {/* Circular breathing guide */}
            <div className="letters-breathing-container">
              <div className={`letters-breathing-circle ${breathText.toLowerCase()}`}>
                <span className="letters-breathing-text">{breathText}</span>
              </div>
              <p className="letters-breathing-label">Follow the pulse to center your thoughts</p>
            </div>

            <button 
              onClick={handleReset} 
              className="btn-book-now letters-btn"
              style={{ background: 'transparent', border: '1.5px solid rgba(255, 255, 255, 0.4)', color: 'white', boxShadow: 'none', padding: '12px 32px' }}
            >
              Write Another Letter 🌿
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LettersNeverSent;
