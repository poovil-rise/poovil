import React, { useState, useEffect, useRef } from 'react';

const HeartbeatDrummer = () => {
  const [gameState, setGameState] = useState('welcome'); // 'welcome', 'active', 'completed'
  const [isMuted, setIsMuted] = useState(false);
  const [bpm, setBpm] = useState(0);
  const [fillLevel, setFillLevel] = useState(0); // 0 to 100
  
  // Audio Refs
  const bgMusicRef = useRef(null);
  const thumpRef = useRef(null);
  const thumpTimerRef = useRef(null);

  // Gameplay Refs
  const tapsRef = useRef([]);
  const ripplesRef = useRef([]);
  const symbolsRef = useRef([]); // Floating completion symbols
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Determine pace status
  let paceStatus = 'idle';
  if (bpm > 80) paceStatus = 'fast';
  else if (bpm >= 50 && bpm <= 80) paceStatus = 'correct';
  else if (bpm > 0 && bpm < 50) paceStatus = 'slow';

  // Dynamic Styles
  let heartColor = '#475569';
  let bgColorClass = 'drummer-bg-neutral';
  let feedbackMessage = 'Just breathe and tap.';
  
  if (paceStatus === 'slow') {
    heartColor = '#fbcfe8'; // Baby Pink
    bgColorClass = 'drummer-bg-slow';
    feedbackMessage = 'Too slow... tap a little faster.';
  } else if (paceStatus === 'correct') {
    heartColor = '#ef4444'; // Vibrant Red
    bgColorClass = 'drummer-bg-correct';
    feedbackMessage = 'Perfect rhythm. Hold this pace to fill your heart.';
  } else if (paceStatus === 'fast') {
    heartColor = '#450a0a'; // Maroon Black
    bgColorClass = 'drummer-bg-fast';
    feedbackMessage = "You're rushing. Breathe, and slow down.";
  }

  // Initialize Audio
  const initAudio = () => {
    if (!bgMusicRef.current) {
      const bgm = new Audio('/assets/mixkit-silent-descent-614.mp3');
      bgm.loop = true;
      bgm.volume = 0.3;
      bgMusicRef.current = bgm;
    }
    if (!isMuted) {
      bgMusicRef.current.play().catch(e => console.error("Audio blocked by browser:", e));
    }
  };

  // Handle Muting
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = isMuted ? 0 : 0.3;
    }
  }, [isMuted]);

  // Handle Game State Audio Fading
  useEffect(() => {
    if (gameState !== 'active') {
      if (bgMusicRef.current) bgMusicRef.current.pause();
      if (thumpRef.current) thumpRef.current.pause();
      if (thumpTimerRef.current) clearTimeout(thumpTimerRef.current);
    } else if (!isMuted) {
      if (bgMusicRef.current) bgMusicRef.current.play().catch(() => {});
    }
  }, [gameState, isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
      if (thumpRef.current) {
        thumpRef.current.pause();
        thumpRef.current = null;
      }
      if (thumpTimerRef.current) clearTimeout(thumpTimerRef.current);
    };
  }, []);

  // Play Thump
  const playThump = () => {
    if (isMuted) return;
    
    // Choose the heartbeat .wav based on the current pace
    let src = '/assets/mixkit-heartbeat-medium-speed-495.wav';
    if (paceStatus === 'slow') src = '/assets/mixkit-slow-heartbeat-494.wav';
    if (paceStatus === 'fast') src = '/assets/mixkit-fast-heartbeat-493.wav';
    
    if (!thumpRef.current) {
      thumpRef.current = new Audio(src);
    } else if (!thumpRef.current.src.endsWith(src)) {
      thumpRef.current.src = src;
    }
    
    thumpRef.current.volume = 1.0;
    thumpRef.current.currentTime = 0;
    thumpRef.current.play().catch(e => console.error(e));

    // Force the long audio file to pause after exactly one heartbeat (approx 600ms)
    // so it doesn't loop or play multiple beats
    if (thumpTimerRef.current) {
      clearTimeout(thumpTimerRef.current);
    }
    thumpTimerRef.current = setTimeout(() => {
      if (thumpRef.current) {
        thumpRef.current.pause();
      }
    }, 600);
  };

  // Handle Tap
  const handleTap = () => {
    if (gameState === 'completed') return;
    if (gameState === 'welcome') {
      initAudio();
      setGameState('active');
    }
    
    const now = performance.now();
    playThump();
    
    // Add Ripple
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      ripplesRef.current.push({
        x: rect.width / 2,
        y: rect.height / 2,
        radius: 40,
        opacity: 0.8,
        createdAt: now,
        status: paceStatus // store current status to lock its color
      });
    }

    // BPM Calculation
    let newTaps = [...tapsRef.current, now];
    if (newTaps.length > 5) newTaps.shift();
    tapsRef.current = newTaps;
    
    if (newTaps.length > 1) {
      const intervals = [];
      for (let i = 1; i < newTaps.length; i++) {
        intervals.push(newTaps[i] - newTaps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      setBpm(calculatedBpm);
      
      // Update Fill Logic
      setFillLevel(prev => {
        let newFill = prev;
        // Evaluate the *new* calculated pace
        if (calculatedBpm >= 50 && calculatedBpm <= 80) {
          newFill = Math.min(100, prev + 12); // Fill up
        } else {
          newFill = Math.max(0, prev - 8); // Drain
        }
        
        if (newFill >= 100 && gameState !== 'completed') {
          setGameState('completed');
          spawnCompletionSymbols();
        }
        return newFill;
      });
    }
  };

  const spawnCompletionSymbols = () => {
    for(let i=0; i<30; i++) {
      symbolsRef.current.push({
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + Math.random() * 200,
        size: Math.random() * 20 + 10,
        speed: Math.random() * 2 + 1,
        char: Math.random() > 0.5 ? '💖' : '✨',
        drift: (Math.random() - 0.5) * 2
      });
    }
  };

  // Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const render = (time) => {
      if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Ripples
      ripplesRef.current = ripplesRef.current.filter(ripple => ripple.opacity > 0);
      ripplesRef.current.forEach(ripple => {
        const expansionSpeed = ripple.status === 'fast' ? 3 : (ripple.status === 'slow' ? 1 : 1.5);
        ripple.radius += expansionSpeed;
        ripple.opacity -= ripple.status === 'fast' ? 0.015 : 0.008;
        
        if (ripple.opacity > 0) {
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
          
          let rColor = '255, 255, 255'; // default
          if (ripple.status === 'slow') rColor = '251, 207, 232'; // pink
          else if (ripple.status === 'correct') rColor = '239, 68, 68'; // red
          else if (ripple.status === 'fast') rColor = '69, 10, 10'; // maroon
          
          ctx.strokeStyle = `rgba(${rColor}, ${ripple.opacity})`;
          ctx.lineWidth = ripple.status === 'fast' ? 2 : 4;
          ctx.stroke();
        }
      });
      
      // Draw Floating Symbols (Completion)
      if (symbolsRef.current.length > 0) {
        ctx.textAlign = 'center';
        symbolsRef.current.forEach(sym => {
          sym.y -= sym.speed;
          sym.x += sym.drift;
          ctx.font = `${sym.size}px Arial`;
          ctx.fillText(sym.char, sym.x, sym.y);
        });
        symbolsRef.current = symbolsRef.current.filter(sym => sym.y > -50);
      }
      
      // Idle Cooldown
      if (tapsRef.current.length > 0 && gameState === 'active') {
        const lastTap = tapsRef.current[tapsRef.current.length - 1];
        if (time - lastTap > 3000) {
           setBpm(0);
           setFillLevel(prev => Math.max(0, prev - 1)); // slowly drain if idle
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };
    
    animationRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationRef.current);
  }, [gameState]);

  const handleRestart = () => {
    setGameState('welcome');
    setBpm(0);
    setFillLevel(0);
    tapsRef.current = [];
    ripplesRef.current = [];
    symbolsRef.current = [];
  };

  return (
    <div style={{ padding: '56px 24px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      <div className={`drummer-wrapper ${bgColorClass}`} onClick={handleTap}>
        
        {/* Mute Toggle */}
        <div className="drummer-header">
          <button 
            className="drummer-mute-btn"
            onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
          >
            {isMuted ? '🔇 Unmute' : '🔊 Mute'}
          </button>
        </div>

        <canvas ref={canvasRef} className="drummer-canvas" />

        {/* Main Interactive Heart */}
        {gameState !== 'welcome' && (
          <div className="drummer-center" style={{ zIndex: 10 }}>
            <svg 
              width="100" height="100" viewBox="0 0 24 24" 
              style={{ 
                transition: 'all 0.3s ease',
                filter: `drop-shadow(0 0 ${fillLevel / 3}px ${heartColor})`,
                transform: `scale(${1 + (fillLevel / 400)})` 
              }}
            >
              <defs>
                <linearGradient id="heartFill" x1="0" y1="1" x2="0" y2="0">
                  <stop offset={`${fillLevel}%`} stopColor={heartColor} />
                  <stop offset={`${fillLevel}%`} stopColor="rgba(255,255,255,0.03)" />
                </linearGradient>
              </defs>
              <path 
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                fill="url(#heartFill)" 
                stroke={heartColor} 
                strokeWidth="0.8" 
              />
            </svg>
          </div>
        )}

        {/* Dynamic Feedback Text & Instructions */}
        <div className="drummer-messages">
          {gameState === 'welcome' && (
            <div className="drummer-instructions-card">
              <h2 className="drummer-subtitle">Heartbeat Drummer</h2>
              <p style={{ color: '#ced4da', fontSize: '15px', lineHeight: '1.6', maxWidth: '400px', margin: '0 auto 16px', fontFamily: "'DM Sans', sans-serif" }}>
                How to play: Tap the screen in a steady, calm rhythm.<br/><br/>
                If you find the perfect pace, your heart will fill with red warmth. If you rush, it turns dark. If you are too slow, it fades to pink. Fill it completely to win peace.
              </p>
              <button className="drummer-btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>Tap anywhere to begin</button>
            </div>
          )}
          
          {gameState === 'active' && (
            <div style={{ opacity: bpm > 0 ? 1 : 0, transition: 'opacity 0.5s ease' }}>
              <h2 className="drummer-subtitle" style={{ color: heartColor, textShadow: '0 0 12px rgba(0,0,0,0.5)' }}>
                {feedbackMessage}
              </h2>
              <div className="drummer-bpm-readout" style={{ marginTop: '8px' }}>
                {bpm > 0 ? `${bpm} BPM - ${fillLevel}% Full` : 'Listening...'}
              </div>
            </div>
          )}
        </div>

        {/* Completion Modal Overlay */}
        {gameState === 'completed' && (
          <div className="drummer-completion-overlay" onClick={(e) => e.stopPropagation()}>
            <div className="drummer-completion-card">
              <h2>You found your rhythm.</h2>
              <p>Your heart is full. You slowed your world down.</p>
              <button className="drummer-btn" onClick={handleRestart}>
                Rest here again
              </button>
            </div>
          </div>
        )}

        {/* Footer Watermark */}
        <div className="drummer-footer">
          (This space is for your heartbeat. No rush. No pressure. Just breathe and tap.)
        </div>
      </div>
    </div>
  );
};

export default HeartbeatDrummer;
