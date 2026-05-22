import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

// Synthesized Pop Sound logic
const playPopSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Bubble pop sound design: quick pitch drop and volume fade
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    console.error("Audio error:", e);
  }
};

const PopPressure = () => {
  const { showToast } = useApp();
  
  const [gameState, setGameState] = useState('welcome');
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // Bubbles array
  const [bubbles, setBubbles] = useState([]);
  
  // The max pressure is 100. As you pop bubbles, it goes down.
  const pressureLevel = Math.max(0, 100 - score * 1.5);

  const negativeThoughts = [
    "I can't do this", "I'm a failure", "It's too hard", "Why try?", 
    "I'm overwhelmed", "It's hopeless", "Not good enough", 
    "Too much pressure", "I'll mess up", "Nobody cares"
  ];

  // Load High Score
  useEffect(() => {
    const saved = localStorage.getItem('popPressureHighScore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Timer & Game Loop
  useEffect(() => {
    let timer;
    let spawner;
    
    if (gameState === 'active' && timeLeft > 0) {
      // Countdown Timer
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      // Spawn Bubbles continuously
      spawner = setInterval(() => {
        setBubbles(prev => {
          // Keep a max of 20 bubbles on screen to prevent lag
          if (prev.length > 20) return prev;
          
          return [...prev, {
            id: Date.now() + Math.random(),
            left: Math.random() * 80 + 10, // 10% to 90%
            size: Math.random() * 40 + 80, // 80px to 120px to fit text
            speed: Math.random() * 3 + 3, // 3s to 6s to rise
            text: negativeThoughts[Math.floor(Math.random() * negativeThoughts.length)]
          }];
        });
      }, 500); // New bubble every 500ms
      
    } else if (gameState === 'active' && timeLeft === 0) {
      endGame();
    }
    
    return () => {
      clearInterval(timer);
      clearInterval(spawner);
    };
  }, [gameState, timeLeft]);
  

  const startGame = () => {
    setGameState('active');
    setTimeLeft(30);
    setScore(0);
    setBubbles([]);
  };

  const endGame = () => {
    setGameState('completed');
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('popPressureHighScore', score.toString());
      showToast("New High Score! 🏆");
    }
  };

  const popBubble = (id) => {
    playPopSound();
    setScore(prev => prev + 1);
    setBubbles(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="pressure-game-container">
      <style>{`
        .pressure-game-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%);
          font-family: 'Inter', sans-serif;
          overflow: hidden;
          position: relative;
        }

        .pressure-glass-panel {
          position: relative;
          z-index: 10;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 24px;
          padding: 2rem;
          margin: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 350px;
        }

        .pressure-title {
          color: #0369a1; /* Sky 700 */
          font-size: 2.5rem;
          margin-bottom: 1rem;
          font-weight: 800;
        }

        .pressure-subtitle {
          color: #0ea5e9; /* Sky 500 */
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }

        .btn-start-pressure {
          padding: 1rem 2rem;
          font-size: 1.5rem;
          background: #0ea5e9;
          color: white;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4);
          transition: transform 0.2s, background 0.2s;
        }

        .btn-start-pressure:hover {
          transform: scale(1.05);
          background: #0284c7;
        }

        .pressure-meter-wrapper {
          width: 300px;
          height: 30px;
          background: rgba(255,255,255,0.8);
          border-radius: 15px;
          overflow: hidden;
          border: 2px solid #bae6fd;
          margin: 1.5rem 0;
          position: relative;
        }

        .pressure-meter-fill {
          height: 100%;
          background: linear-gradient(90deg, #38bdf8, #ef4444);
          transition: width 0.3s ease-out;
        }

        .pressure-stats {
          font-size: 1.5rem;
          color: #0c4a6e;
          font-weight: bold;
          margin-top: 1rem;
        }

        /* Bubble Styles */
        .bubble-area {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 5;
          pointer-events: none; /* Let clicks pass through empty space */
        }

        .bubble {
          position: absolute;
          bottom: -150px;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95), rgba(224, 242, 254, 0.8));
          border: 1px solid rgba(255,255,255,0.8);
          border-radius: 50%;
          box-shadow: inset 0 0 20px rgba(255,255,255,0.7), 0 4px 15px rgba(0,0,0,0.05);
          pointer-events: auto; /* Make bubble clickable */
          cursor: pointer;
          animation: floatUp linear forwards;
          transition: transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
        }

        .bubble:hover {
          transform: scale(1.1);
        }

        .bubble:active {
          transform: scale(0.9);
        }

        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(-130vh) scale(1.2); opacity: 0; }
        }

        .calming-message {
          font-size: 1.8rem;
          color: #0369a1;
          font-weight: 500;
          margin: 2rem 0;
          line-height: 1.5;
          animation: fadeIn 2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Main Glass Panel */}
      <div 
        className="pressure-glass-panel" 
        style={gameState === 'active' ? { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', margin: 0, padding: '1.5rem', minWidth: 'auto', zIndex: 10 } : {}}
      >
        
        {gameState === 'welcome' && (
          <>
            <h1 className="pressure-title">Pop the Pressure</h1>
            <p className="pressure-subtitle">A 30-second calming release.</p>
            <p style={{ color: '#475569', marginBottom: '2rem', maxWidth: '400px' }}>
              When stress builds up, it helps to let it out. Tap the rising thought bubbles to pop them, and watch the pressure drop.
            </p>
            <div className="pressure-stats" style={{ marginBottom: '2rem' }}>High Score: {highScore} pops</div>
            <button className="btn-start-pressure" onClick={startGame}>Start Releasing</button>
          </>
        )}

        {gameState === 'active' && (
          <>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0284c7' }}>{timeLeft}s</div>
            <div className="pressure-meter-wrapper" style={{ width: '250px' }}>
              <div className="pressure-meter-fill" style={{ width: `${Math.min(100, pressureLevel)}%` }} />
            </div>
            <div style={{ color: '#0369a1', fontWeight: '600', fontSize: '1.2rem' }}>Pressure Level</div>
            <div className="pressure-stats">Popped: {score}</div>
          </>
        )}

        {gameState === 'completed' && (
          <>
            <h1 className="pressure-title">Time's Up</h1>
            <div className="calming-message">
              "Take a deep breath.<br/>You released something."
            </div>
            <div className="pressure-stats" style={{ marginBottom: '1rem' }}>Total Popped: {score}</div>
            <div className="pressure-stats" style={{ marginBottom: '2rem' }}>High Score: {highScore}</div>
            <button className="btn-start-pressure" onClick={startGame}>Release More</button>
          </>
        )}

      </div>

      {/* Bubble Area */}
      {gameState === 'active' && (
        <div className="bubble-area">
          {bubbles.map(b => (
            <div
              key={b.id}
              className="bubble"
              style={{
                left: `${b.left}%`,
                width: `${b.size}px`,
                height: `${b.size}px`,
                animationDuration: `${b.speed}s`
              }}
              onMouseDown={() => popBubble(b.id)}
              onTouchStart={() => popBubble(b.id)}
            >
              <span style={{ fontSize: '11px', textAlign: 'center', color: '#0369a1', fontWeight: 'bold', pointerEvents: 'none', lineHeight: '1.2' }}>
                {b.text}
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default PopPressure;
