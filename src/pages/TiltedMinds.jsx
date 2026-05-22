import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

// Safe LocalStorage helpers
const getHighScoreSafe = () => {
  try { return parseInt(localStorage.getItem('poovil_tilted_highscore') || '0', 10); } catch (e) { return 0; }
};
const setHighScoreSafe = (val) => {
  try { localStorage.setItem('poovil_tilted_highscore', val.toString()); } catch (e) { }
};

const pastThoughts = ["Regrets", "Old Mistakes", "Should haves", "Lost time", "Why didn't I?", "Past hurt"];
const futureThoughts = ["What if?", "Anxieties", "Expectations", "Deadlines", "Fears", "Not ready"];

const TiltedMinds = () => {
  const { setActiveSection } = useApp();
  const canvasRef = useRef(null);
  
  const [gameState, setGameState] = useState('welcome'); // welcome, playing, completed
  const [highScore, setHighScore] = useState(getHighScoreSafe());
  const [balanceProgress, setBalanceProgress] = useState(0); // 0 to 100
  
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);
  
  const keys = useRef({ ArrowLeft: false, ArrowRight: false, a: false, d: false });
  const touchX = useRef(null);

  const audioRef = useRef(null);

  const initAudio = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log(e));
    }
  };

  const updateAudio = (tiltAngle) => {
    // No longer shifting pitch, just let the calming music play
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const startGame = () => {
    initAudio();
    setBalanceProgress(0);
    setGameState('playing');
  };

  const quitGame = () => {
    stopAudio();
    setActiveSection('games_hub');
  };

  // Input Listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (keys.current.hasOwnProperty(e.key)) keys.current[e.key] = true;
    };
    const handleKeyUp = (e) => {
      if (keys.current.hasOwnProperty(e.key)) keys.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Physics & Render Loop
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let lastTime = performance.now();
    
    // Physics State
    let theta = 0; // Current angle in radians
    let omega = 0; // Angular velocity
    let playerX = 0; // -300 to 300
    
    let weights = [];
    let progress = 0; // Win at 45 seconds (45000 ms)
    const MAX_PROGRESS = 45000;
    
    const spawnWeight = () => {
      const isPast = Math.random() > 0.5;
      const dropX = isPast ? -(Math.random() * 200 + 50) : (Math.random() * 200 + 50);
      weights.push({
        id: Math.random(),
        x: dropX,
        y: -400,
        mass: Math.random() * 0.8 + 0.4,
        text: isPast ? pastThoughts[Math.floor(Math.random() * pastThoughts.length)] : futureThoughts[Math.floor(Math.random() * futureThoughts.length)],
        isPast,
        life: 1.0, // fades out from 1.0 to 0
        active: true
      });
    };

    const loop = (timestamp) => {
      const dt = timestamp - lastTime;
      lastTime = timestamp;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 + 100;
      
      // Player Movement
      const moveSpeed = 6;
      if (keys.current.ArrowLeft || keys.current.a) playerX -= moveSpeed;
      if (keys.current.ArrowRight || keys.current.d) playerX += moveSpeed;
      
      // Touch override
      if (touchX.current !== null) {
        const targetX = touchX.current - centerX;
        playerX += (targetX - playerX) * 0.1;
      }
      
      playerX = Math.max(-320, Math.min(320, playerX));
      
      // Spawner
      if (Math.random() < 0.008 && weights.length < 5) {
        spawnWeight();
      }
      
      // Physics Updates
      let torque = 0;
      
      // Strong natural restoring force (always wants to return to flat)
      torque -= theta * 2500;
      
      // Player weight (super heavy so you can easily overpower blocks)
      torque += playerX * 5.0;
      
      // Box weights
      weights.forEach(w => {
        if (!w.active) return;
        const boardY = w.x * Math.tan(theta);
        
        if (w.y < boardY - 15) {
          w.y += 4; // Falling
        } else {
          w.y = boardY - 15; // Resting
          torque += w.x * 1.5; 
          
          // Fade out when resting
          w.life -= 0.005; 
          if (w.life <= 0) {
            w.active = false;
          }
        }
        
        // Remove if fallen off
        if (w.x < -400 || w.x > 400 || w.y > 500) {
          w.active = false;
        }
      });
      
      weights = weights.filter(w => w.active);
      
      // Seesaw physics
      const alpha = torque * 0.00002; // Reduced acceleration
      omega += alpha;
      omega *= 0.80; // Heavy Dampening so it stops swinging quickly
      theta += omega;
      
      // Clamp tilt
      const maxTilt = 0.35; // reduced max tilt
      if (theta > maxTilt) { theta = maxTilt; omega = 0; }
      if (theta < -maxTilt) { theta = -maxTilt; omega = 0; }
      
      // Audio update
      updateAudio(theta);
      
      // Progression
      if (Math.abs(theta) < 0.20) { // Much wider winning angle (approx 11 degrees)
        progress += dt;
        setBalanceProgress(Math.min(100, (progress / MAX_PROGRESS) * 100));
        if (progress >= MAX_PROGRESS) {
          setGameState('completed');
          stopAudio();
          if (progress > highScore) {
            setHighScore(45); // Representing 45s max
            setHighScoreSafe(45);
          }
          return; // End loop
        }
      } else {
        progress = Math.max(0, progress - dt * 0.5); // Lose progress slowly if unbalanced
        setBalanceProgress(Math.min(100, (progress / MAX_PROGRESS) * 100));
      }
      
      // ---------------- RENDER ----------------
      // Dynamic Sky Gradient
      const balanceRatio = Math.max(0, 1 - (Math.abs(theta) / maxTilt));
      const skyHue = 220 - (balanceRatio * 20); 
      const skyLight = 15 + (balanceRatio * 15);
      ctx.fillStyle = `hsl(${skyHue}, 40%, ${skyLight}%)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw Stars/Dust based on balance
      ctx.fillStyle = `rgba(255, 255, 255, ${balanceRatio * 0.5})`;
      for(let i=0; i<30; i++) {
        ctx.beginPath();
        ctx.arc((Math.sin(i*10 + timestamp*0.001)*200 + 400), (Math.cos(i*5)*200 + 300), Math.random()*2, 0, Math.PI*2);
        ctx.fill();
      }

      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Draw Base/Pivot
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-30, 150);
      ctx.lineTo(30, 150);
      ctx.closePath();
      ctx.fill();
      
      // Rotate for board
      ctx.rotate(theta);
      
      // Draw Board
      ctx.shadowBlur = 20;
      ctx.shadowColor = `rgba(255, 255, 255, ${0.3 + balanceRatio * 0.5})`;
      const boardGradient = ctx.createLinearGradient(-350, 0, 350, 0);
      boardGradient.addColorStop(0, "rgba(96, 165, 250, 0.6)");
      boardGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.9)");
      boardGradient.addColorStop(1, "rgba(248, 113, 113, 0.6)");
      ctx.fillStyle = boardGradient;
      ctx.beginPath();
      ctx.roundRect(-350, -5, 700, 10, 5);
      ctx.fill();
      
      // Draw Player Orb
      ctx.shadowBlur = 30;
      ctx.shadowColor = "#fef08a";
      ctx.fillStyle = "#fef08a";
      ctx.beginPath();
      ctx.arc(playerX, -25, 20, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw Weights
      weights.forEach(w => {
        const rgb = w.isPast ? '96, 165, 250' : '248, 113, 113';
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(${rgb}, ${w.life})`;
        ctx.fillStyle = `rgba(20, 20, 20, ${w.life * 0.8})`;
        ctx.strokeStyle = `rgba(${rgb}, ${w.life})`;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.roundRect(w.x - 35, w.y - 15, 70, 30, 4);
        ctx.fill();
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(${rgb}, ${w.life})`;
        ctx.font = "12px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(w.text, w.x, w.y);
      });
      
      ctx.restore();
      
      animationFrameId = requestAnimationFrame(loop);
    };
    
    animationFrameId = requestAnimationFrame(loop);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState]);

  return (
    <div className="tilted-page-container fade-in" 
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '0 24px', maxWidth: '900px', margin: '0 auto' }}>
      
      <audio ref={audioRef} loop src="/assets/mixkit-silent-descent-614.mp3" />

      <div className="tilted-wrapper" 
        style={{ width: '100%', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 0.98) 100%)', borderRadius: '30px', border: '2px solid rgba(148, 163, 184, 0.2)', padding: '40px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
        onMouseMove={(e) => {
          if (gameState === 'playing' && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            touchX.current = e.clientX - rect.left;
          }
        }}
        onTouchMove={(e) => {
          if (gameState === 'playing' && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            touchX.current = e.touches[0].clientX - rect.left;
          }
        }}
        onMouseLeave={() => touchX.current = null}
        onTouchEnd={() => touchX.current = null}
      >

        {gameState === 'welcome' && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
            <span style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '12px', letterSpacing: '1px' }}>MINDFULNESS EXERCISE</span>
            <h2 style={{ fontSize: '48px', fontFamily: "'Cormorant Garamond', serif", fontWeight: '300', margin: 0 }}>TILTED MINDS</h2>
            <p style={{ color: '#cbd5e1', maxWidth: '500px', lineHeight: '1.6' }}>
              Memories of the past and anxieties of the future constantly pull at us.<br/><br/>
              Use <kbd style={{background: '#334155', padding: '2px 8px', borderRadius: '4px'}}>◀</kbd> <kbd style={{background: '#334155', padding: '2px 8px', borderRadius: '4px'}}>▶</kbd> arrows (or tap/swipe) to move your mind across the seesaw. Counterbalance the falling thoughts and remain perfectly level in the "now".
            </p>
            <button onClick={startGame} style={{ padding: '16px 40px', background: '#e2e8f0', color: '#0f172a', border: 'none', borderRadius: '30px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '16px' }}>
              Find Balance
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px', color: '#94a3b8' }}>
              <span>Past Regrets</span>
              <span>Awareness Progress: {Math.round(balanceProgress)}%</span>
              <span>Future Anxieties</span>
            </div>
            
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginBottom: '24px', overflow: 'hidden' }}>
              <div style={{ width: `${balanceProgress}%`, height: '100%', background: '#fef08a', transition: 'width 0.2s linear' }} />
            </div>

            <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', overflow: 'hidden', width: '100%', maxWidth: '800px' }}>
              <canvas 
                ref={canvasRef} 
                width={800} 
                height={500} 
                style={{ width: '100%', display: 'block', height: 'auto', background: '#0f172a' }}
              />
            </div>
            
            <button onClick={quitGame} style={{ marginTop: '24px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
              Exit Exercise
            </button>
          </div>
        )}

        {gameState === 'completed' && (
          <div className="fade-in" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', padding: '40px 0' }}>
            <div style={{ fontSize: '64px' }}>✨</div>
            <h2 style={{ fontSize: '36px', fontFamily: "'Cormorant Garamond', serif", fontWeight: '300', margin: 0, color: '#fef08a' }}>
              You are here.
            </h2>
            <p style={{ fontSize: '20px', color: '#e2e8f0' }}>Right now is enough.</p>
            <button onClick={quitGame} style={{ padding: '16px 40px', background: '#334155', color: 'white', border: 'none', borderRadius: '30px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '24px' }}>
              Return to Center
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default TiltedMinds;
