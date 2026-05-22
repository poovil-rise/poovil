import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

// Safe LocalStorage helpers to avoid crashing in restricted/private browser settings
const getHighScoreSafe = () => {
  try {
    return parseInt(localStorage.getItem('poovil_invaders_highscore') || '0', 10);
  } catch (e) {
    return 0;
  }
};

const setHighScoreSafe = (val) => {
  try {
    localStorage.setItem('poovil_invaders_highscore', val.toString());
  } catch (e) {
    // Silently ignore storage blocks
  }
};

// Helper explosion particles creator (Pure utility)
const createExplosion = (x, y, color) => {
  const count = 22;
  const arr = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    arr.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1.0,
      size: Math.random() * 2.5 + 1.2,
      color: color || `hsl(${Math.random() * 360}, 90%, 75%)`
    });
  }
  return arr;
};

// Capsule renderer helper (Pure utility)
const drawCapsule = (ctx, x, y, width, height, text, isNegative) => {
  ctx.save();
  ctx.shadowBlur = 12;
  ctx.shadowColor = isNegative ? "rgba(250, 82, 82, 0.45)" : "rgba(135, 169, 34, 0.4)";
  
  // Capsule border and filled glass backgrounds
  ctx.fillStyle = isNegative ? "rgba(42, 16, 26, 0.85)" : "rgba(23, 36, 18, 0.85)";
  ctx.strokeStyle = isNegative ? "#fa5252" : "#87a922";
  ctx.lineWidth = 1.8;
  
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x - width/2, y - height/2, width, height, 14);
  } else {
    // Fallback drawing if roundRect isn't mapped
    ctx.rect(x - width/2, y - height/2, width, height);
  }
  ctx.fill();
  ctx.stroke();
  
  // Render internal text node
  ctx.fillStyle = isNegative ? "#ffc9c9" : "#e9fac8";
  ctx.font = "500 11.5px 'DM Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
  ctx.restore();
};

// Giant boss drawing helper (Pure utility)
const drawBoss = (ctx, x, y, width, height, hp, maxHp) => {
  ctx.save();
  // Pulsing glows
  ctx.shadowBlur = 24 + Math.sin(Date.now() / 150) * 8;
  ctx.shadowColor = "rgba(107, 68, 144, 0.75)";
  
  ctx.fillStyle = "rgba(28, 11, 41, 0.95)";
  ctx.strokeStyle = "#9c36b5";
  ctx.lineWidth = 2.5;
  
  ctx.beginPath();
  ctx.arc(x, y - 5, 42, 0, Math.PI * 2);
  ctx.arc(x - 50, y, 32, 0, Math.PI * 2);
  ctx.arc(x + 50, y, 32, 0, Math.PI * 2);
  ctx.arc(x - 25, y + 15, 28, 0, Math.PI * 2);
  ctx.arc(x + 25, y + 15, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  if (hp < maxHp) {
    ctx.strokeStyle = "rgba(253, 224, 71, 0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 30, y);
    ctx.lineTo(x, y + 10);
    ctx.lineTo(x + 25, y - 5);
    ctx.stroke();
  }

  ctx.fillStyle = "#fa5252";
  ctx.font = "italic bold 15px 'Cormorant Garamond', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("CORE FEAR: DOUBT", x, y + 5);
  
  ctx.fillStyle = "#adb5bd";
  ctx.font = "500 9.5px 'DM Sans', sans-serif";
  ctx.fillText("Strike to shatter", x, y - 24);

  const barW = 120;
  const barH = 5;
  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  ctx.fillRect(x - barW/2, y + 36, barW, barH);
  
  const pct = hp / maxHp;
  ctx.fillStyle = "#be4bdb";
  ctx.fillRect(x - barW/2, y + 36, barW * pct, barH);
  
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.strokeRect(x - barW/2, y + 36, barW, barH);
  ctx.restore();
};

// Cannon drawing helper (Pure utility)
const drawCannon = (ctx, x, y) => {
  ctx.save();
  ctx.shadowBlur = 15;
  ctx.shadowColor = "rgba(135, 169, 34, 0.4)";
  
  ctx.fillStyle = "rgba(43, 61, 31, 0.85)";
  ctx.strokeStyle = "#87a922";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y + 20, 24, Math.PI, 0);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = "#87a922";
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x - 5, y - 10, 10, 24, 3);
  } else {
    ctx.rect(x - 5, y - 10, 10, 24);
  }
  ctx.fill();
  
  ctx.fillStyle = "#e9fac8";
  ctx.beginPath();
  ctx.arc(x, y - 10, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

const ThoughtInvaders = () => {
  const { showToast } = useApp();
  
  // Game screens: 'welcome', 'playing', 'victory', 'gameover'
  const [stage, setStage] = useState('welcome');
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1); // 1, 2, 3 (Boss)
  
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  
  // Reactive states for rendering clean UI overlay info
  const [uiWave, setUiWave] = useState(1);
  const [uiScore, setUiScore] = useState(0);
  const [bossHp, setBossHp] = useState(5);
  const [highScore, setHighScore] = useState(() => getHighScoreSafe());

  // Pools of negative and positive thoughts
  const negativeDoubts = [
    "I'm not good enough",
    "Nobody cares",
    "I always fail",
    "I can't do this",
    "I am a burden",
    "I will disappoint them",
    "I'm useless",
    "Everything is too hard",
    "I'm all alone",
    "I will never heal"
  ];

  const positiveAffirmations = [
    "I am enough",
    "I am loved",
    "I keep trying",
    "I deserve peace",
    "I am resilient",
    "I am capable",
    "I am strong",
    "I will get through this",
    "I am worthy",
    "Healing is possible"
  ];

  // Game coordinates and items refs to avoid closed-over React state in requestAnimationFrame loop
  const gameStateRef = useRef({
    cannonX: 200,
    projectiles: [],
    invaders: [],
    particles: [],
    keys: { Left: false, Right: false, Space: false },
    score: 0,
    wave: 1,
    boss: null,
    lastSpawnTime: 0,
    invadersDefeatedInWave: 0,
    isFiring: false,
    lastFireTime: 0
  });

  // Track size of the canvas box dynamically
  const canvasWidth = 500;
  const canvasHeight = 450;

  // Handle game start
  const audioCtxRef = useRef(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playLaser = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  const startGame = () => {
    initAudio();
    setStage('playing');
    setScore(0);
    setWave(1);
    setUiWave(1);
    setUiScore(0);
    setBossHp(5);

    gameStateRef.current = {
      cannonX: canvasWidth / 2,
      projectiles: [],
      invaders: [],
      particles: [],
      keys: { Left: false, Right: false, Space: false },
      score: 0,
      wave: 1,
      boss: null,
      lastSpawnTime: 0,
      invadersDefeatedInWave: 0,
      isFiring: false,
      lastFireTime: 0
    };
    
    showToast("Mind defense turret deployed! 🚀");
  };

  // Preset button shoot for mobile controls
  const handleMoveLeft = () => {
    gameStateRef.current.cannonX = Math.max(40, gameStateRef.current.cannonX - 25);
  };

  const handleMoveRight = () => {
    gameStateRef.current.cannonX = Math.min(canvasWidth - 40, gameStateRef.current.cannonX + 25);
  };

  const startMobileShoot = (e) => {
    if (e) e.preventDefault();
    gameStateRef.current.isFiring = true;
  };

  const stopMobileShoot = (e) => {
    if (e) e.preventDefault();
    gameStateRef.current.isFiring = false;
  };

  // Keyboard binding listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (stage !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameStateRef.current.keys.Left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameStateRef.current.keys.Right = true;
      }
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        gameStateRef.current.keys.Space = true;
      }
    };

    const handleKeyUp = (e) => {
      if (stage !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameStateRef.current.keys.Left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameStateRef.current.keys.Right = false;
      }
      if (e.key === ' ' || e.key === 'Spacebar') {
        gameStateRef.current.keys.Space = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [stage]);

  // Main canvas loop orchestrator
  useEffect(() => {
    if (stage !== 'playing') {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const updateLoop = () => {
      const state = gameStateRef.current;

      // Wave transitions logic (Clean, non-hoisted block variable declaration)
      const checkWaveProgression = () => {
        const currentTarget = state.wave === 1 ? 8 : 12;
        if (state.invadersDefeatedInWave >= currentTarget && state.wave < 3) {
          state.wave += 1;
          setUiWave(state.wave);
          state.invadersDefeatedInWave = 0;
          state.invaders = [];
          state.projectiles = [];
          showToast(`Wave ${state.wave} commencing! You are doing great.`);
        }
      };

      // 1. Move Cannon
      if (state.keys.Left) {
        state.cannonX = Math.max(40, state.cannonX - 4);
      }
      if (state.keys.Right) {
        state.cannonX = Math.min(canvasWidth - 40, state.cannonX + 4);
      }

      // 2. Shoot logic
      if (state.keys.Space || state.isFiring) {
        const now = Date.now();
        if (now - state.lastFireTime > 80) { // Satisfying rapid fire rate (about 12 shots per second)
          playLaser();
          const randomAffirmation = positiveAffirmations[Math.floor(Math.random() * positiveAffirmations.length)];
          state.projectiles.push({
            x: state.cannonX,
            y: canvasHeight - 40,
            text: randomAffirmation,
            vy: -6.5, // slightly faster projectile velocity for premium feel
            width: 100,
            height: 25
          });
          state.lastFireTime = now;
        }
      }

      // 3. Spawning Invaders / Boss Setup
      const now = Date.now();
      if (state.wave < 3) {
        const spawnDelay = state.wave === 1 ? 2500 : 1600;
        const maxWaveInvaders = state.wave === 1 ? 8 : 12;

        if (now - state.lastSpawnTime > spawnDelay && state.invadersDefeatedInWave + state.invaders.length < maxWaveInvaders) {
          const randomDoubt = negativeDoubts[Math.floor(Math.random() * negativeDoubts.length)];
          state.invaders.push({
            x: Math.random() * (canvasWidth - 140) + 70,
            y: -30,
            text: randomDoubt,
            vy: state.wave === 1 ? 0.7 : 1.2,
            vx: state.wave === 2 ? (Math.random() - 0.5) * 0.5 : 0, // slight drift in Wave 2
            width: 125,
            height: 28
          });
          state.lastSpawnTime = now;
        }
      } else if (state.wave === 3 && !state.boss) {
        // Spawn Final boss
        state.boss = {
          x: canvasWidth / 2,
          y: 60,
          width: 180,
          height: 70,
          vx: 0.8,
          hp: 5,
          maxHp: 5,
          lastShoot: 0
        };
        showToast("⚠️ The Core Fear has appeared! Fight back! 🛡️");
      }

      // Boss special: Spawning temporary distractions/disturbances
      if (state.boss) {
        const b = state.boss;
        b.x += b.vx;
        if (b.x < 100 || b.x > canvasWidth - 100) {
          b.vx = -b.vx; // bounce
        }

        // Boss occasionally shoots negative thoughts down
        if (now - b.lastShoot > 2800) {
          const randomDoubt = negativeDoubts[Math.floor(Math.random() * negativeDoubts.length)];
          state.invaders.push({
            x: b.x,
            y: b.y + 40,
            text: randomDoubt,
            vy: 1.4,
            vx: (Math.random() - 0.5) * 0.8,
            width: 120,
            height: 28
          });
          b.lastShoot = now;
        }
      }

      // 4. Update coordinates
      // Update Projectiles
      state.projectiles.forEach(p => p.y += p.vy);
      state.projectiles = state.projectiles.filter(p => p.y > -30);

      // Update Invaders
      state.invaders.forEach(inv => {
        inv.y += inv.vy;
        if (inv.vx) inv.x += inv.vx;
        
        // Bounce off canvas sides
        if (inv.x < 70 || inv.x > canvasWidth - 70) {
          inv.vx = -inv.vx;
        }
      });

      // Bottom crossing line triggers Game Over state (ground at canvasHeight - 20)
      let crossedBottom = false;
      for (let i = 0; i < state.invaders.length; i++) {
        if (state.invaders[i].y > canvasHeight - 20) {
          crossedBottom = true;
          break;
        }
      }

      if (crossedBottom) {
        // Trigger Game Over!
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current);
        }
        setStage('gameover');
        
        // Sync and update high score
        const finalScore = state.score;
        const currentHighScore = getHighScoreSafe();
        if (finalScore > currentHighScore) {
          setHighScoreSafe(finalScore);
          setHighScore(finalScore);
        }
        showToast("Game Over! The doubts overwhelmed your headspace. 😔");
        return;
      }

      // Update particles
      state.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;
      });
      state.particles = state.particles.filter(p => p.alpha > 0);

      // 5. Collision Detections
      state.projectiles.forEach((p) => {
        // Collision with standard invaders
        state.invaders.forEach((inv) => {
          if (p.toRemove || inv.toRemove) return;

          const distX = Math.abs(p.x - inv.x);
          const distY = Math.abs(p.y - inv.y);

          // Approximate overlap
          if (distX < 65 && distY < 20) {
            // Explode invader
            state.particles.push(...createExplosion(inv.x, inv.y, "rgba(250, 82, 82, 0.7)"));
            state.particles.push(...createExplosion(p.x, p.y, "rgba(135, 169, 34, 0.7)"));

            // Mark for removal
            inv.toRemove = true;
            p.toRemove = true;

            state.score += 1;
            setUiScore(state.score);

            const currentHighScore = getHighScoreSafe();
            if (state.score > currentHighScore) {
              setHighScoreSafe(state.score);
              setHighScore(state.score);
            }

            state.invadersDefeatedInWave += 1;

            // Wave completion checker
            checkWaveProgression();
          }
        });

        // Collision with Boss
        if (state.boss && !p.toRemove) {
          const b = state.boss;
          const distX = Math.abs(p.x - b.x);
          const distY = Math.abs(p.y - b.y);

          if (distX < 90 && distY < 35) {
            // Hit Boss
            p.toRemove = true;
            b.hp -= 1;
            setBossHp(b.hp);
            
            // Hit sparkles
            state.particles.push(...createExplosion(p.x, p.y, "#fab005"));

            if (b.hp <= 0) {
              // Boss Defeated!
              state.particles.push(...createExplosion(b.x, b.y, "#fab005"));
              state.particles.push(...createExplosion(b.x - 30, b.y, "#e64980"));
              state.particles.push(...createExplosion(b.x + 30, b.y, "#15aabf"));
              
              state.boss = null;
              
              // End game with victory after beautiful explosion delay
              setTimeout(() => {
                setStage('victory');
                state.score += 5; // 5 bonus points
                setUiScore(state.score);
                const currentHighScore = getHighScoreSafe();
                if (state.score > currentHighScore) {
                  setHighScoreSafe(state.score);
                  setHighScore(state.score);
                }
              }, 1200);
            }
          }
        }
      });

      // Filter out removed projectiles and invaders
      state.projectiles = state.projectiles.filter(p => !p.toRemove);
      state.invaders = state.invaders.filter(inv => !inv.toRemove);

      // (Wave progression is handled at the top of the updateLoop to prevent Temporal Dead Zone or Scope issues)

      // 6. RENDER EVERYTHING ON CANVAS
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Create rich cosmic gradient for the sky background
      const skyGradient = ctx.createRadialGradient(
        canvasWidth / 2, canvasHeight / 2, 10,
        canvasWidth / 2, canvasHeight / 2, canvasWidth
      );
      skyGradient.addColorStop(0, '#101424'); // soft deep slate blue in the center
      skyGradient.addColorStop(1, '#05070a'); // ultra-dark charcoal-blue at edges
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Soft lavender nebula glow in background for rich aesthetics
      ctx.save();
      const nebulaGrad = ctx.createRadialGradient(
        canvasWidth / 2, 80, 20,
        canvasWidth / 2, 80, 250
      );
      nebulaGrad.addColorStop(0, 'rgba(156, 54, 181, 0.08)');
      nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebulaGrad;
      ctx.beginPath();
      ctx.arc(canvasWidth / 2, 80, 250, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Star particles twinkling in background
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      for (let s = 0; s < 18; s++) {
        const starX = (s * 87) % canvasWidth;
        const starY = (s * 133 + Date.now() / 15) % canvasHeight;
        ctx.fillRect(starX, starY, 1.5, 1.5);
      }

      // Draw Projectiles
      state.projectiles.forEach(p => {
        // Draw positive bullet capsule
        drawCapsule(ctx, p.x, p.y, p.width, p.height, p.text, false);
      });

      // Draw Invaders
      state.invaders.forEach(inv => {
        // Draw negative invader capsule
        drawCapsule(ctx, inv.x, inv.y, inv.width, inv.height, inv.text, true);
      });

      // Draw Particles
      state.particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Boss
      if (state.boss) {
        drawBoss(ctx, state.boss.x, state.boss.y, state.boss.width, state.boss.height, state.boss.hp, state.boss.maxHp);
      }

      // Draw Cannon Turret
      drawCannon(ctx, state.cannonX, canvasHeight - 20);

      // Draw ground border line
      ctx.strokeStyle = "rgba(184, 158, 200, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvasHeight - 20);
      ctx.lineTo(canvasWidth, canvasHeight - 20);
      ctx.stroke();

      // Trigger next animation frame
      gameLoopRef.current = requestAnimationFrame(updateLoop);
    };

    // Tap / drag directly to target coordinate to aim & shoot instantly
    const handleCanvasInteractionStart = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clickX = clientX - rect.left;
      
      const state = gameStateRef.current;
      state.cannonX = Math.min(canvasWidth - 40, Math.max(40, clickX));
      state.isFiring = true;
    };

    const handleCanvasInteractionMove = (e) => {
      const state = gameStateRef.current;
      if (!state.isFiring) return;
      
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clickX = clientX - rect.left;
      
      state.cannonX = Math.min(canvasWidth - 40, Math.max(40, clickX));
    };

    const handleCanvasInteractionEnd = (e) => {
      if (e) e.preventDefault();
      const state = gameStateRef.current;
      state.isFiring = false;
    };

    canvas.addEventListener('mousedown', handleCanvasInteractionStart);
    canvas.addEventListener('mousemove', handleCanvasInteractionMove);
    canvas.addEventListener('mouseup', handleCanvasInteractionEnd);
    canvas.addEventListener('mouseleave', handleCanvasInteractionEnd);
    
    canvas.addEventListener('touchstart', handleCanvasInteractionStart, { passive: false });
    canvas.addEventListener('touchmove', handleCanvasInteractionMove, { passive: false });
    canvas.addEventListener('touchend', handleCanvasInteractionEnd);
    canvas.addEventListener('touchcancel', handleCanvasInteractionEnd);

    // Initial trigger
    gameLoopRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      if (canvas) {
        canvas.removeEventListener('mousedown', handleCanvasInteractionStart);
        canvas.removeEventListener('mousemove', handleCanvasInteractionMove);
        canvas.removeEventListener('mouseup', handleCanvasInteractionEnd);
        canvas.removeEventListener('mouseleave', handleCanvasInteractionEnd);
        canvas.removeEventListener('touchstart', handleCanvasInteractionStart);
        canvas.removeEventListener('touchmove', handleCanvasInteractionMove);
        canvas.removeEventListener('touchend', handleCanvasInteractionEnd);
        canvas.removeEventListener('touchcancel', handleCanvasInteractionEnd);
      }
    };
  }, [stage]);

  return (
    <div className="arcade-page-container">
      <div className="arcade-wrapper" style={{ transform: 'scale(0.85)', transformOrigin: 'center center' }}>
        
        {/* GAME SCREEN WELCOME */}
        {stage === 'welcome' && (
          <div className="arcade-screen welcome-screen fade-in">
            <div className="arcade-console-header">
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
                <span className="retro-tag">SYSTEM STATUS: UNSTABLE DOUBTS DETECTED</span>
                <span className="retro-tag" style={{ background: 'rgba(252, 196, 25, 0.12)', border: '1px solid rgba(252, 196, 25, 0.35)', color: '#fcc419', textShadow: '0 0 8px rgba(252, 196, 25, 0.4)' }}>
                  🏆 HIGH SCORE: {highScore}
                </span>
              </div>
              <h2>THOUGHT INVADERS</h2>
              <p className="console-sub">This space is for your mind. Fight back and silence the doubts. 🛡️</p>
            </div>

            <div className="arcade-instructions-card">
              <h3>Defensive Protocol Brief:</h3>
              <ul>
                <li>Negative thoughts fall from the top like invader blocks trying to cloud your mind.</li>
                <li>Your defensive cannon at the bottom shoots <strong>Positive Affirmations</strong>.</li>
                <li>Destroy negative doubts by colliding positive affirmations directly into them!</li>
                <li><strong>Satisfying Rapid Fire</strong>: Hold down Spacebar or click/tap rapidly to shoot a continuous stream of affirmations!</li>
                <li><strong>Controls</strong>:
                  <ul>
                    <li>🖥️ <strong>PC</strong>: Move with <kbd>◀</kbd> / <kbd>▶</kbd> (or <kbd>A</kbd> / <kbd>D</kbd>), press <kbd>Spacebar</kbd> to launch.</li>
                    <li>📱 <strong>Mobile / Mouse</strong>: Tap anywhere on the space skyline screen to aim and fire instantly!</li>
                  </ul>
                </li>
              </ul>
            </div>

            <button onClick={startGame} className="btn-book-now arcade-start-btn pulse-glow">
              Launch Defenses 🚀
            </button>
          </div>
        )}

        {/* GAME PLAYING STAGE SCREEN */}
        {stage === 'playing' && (
          <div className="arcade-screen playing-screen fade-in">
            
            {/* Top Score HUD Panels */}
            <div className="arcade-hud-header">
              <div className="hud-panel">
                <span className="hud-label">DEFENSE LEVEL</span>
                <span className="hud-val text-green">
                  {uiWave === 3 ? "CORE BOSS ⚠️" : `WAVE ${uiWave}`}
                </span>
              </div>
              <div className="hud-panel">
                <span className="hud-label">SILENCED</span>
                <span className="hud-val text-purple">{uiScore}</span>
              </div>
              <div className="hud-panel">
                <span className="hud-label">HIGH SCORE</span>
                <span className="hud-val" style={{ color: '#fcc419', textShadow: '0 0 10px rgba(252, 196, 25, 0.4)' }}>{highScore}</span>
              </div>
            </div>

            {/* Boss Health Bar Overlay */}
            {uiWave === 3 && (
              <div className="boss-hud-health fade-in">
                <span>BOSS: CORE FEAR</span>
                <div className="boss-health-bar">
                  <div 
                    className="boss-health-fill" 
                    style={{ width: `${(bossHp / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Central Canvas viewport container */}
            <div className="arcade-canvas-box">
              <canvas 
                ref={canvasRef} 
                width={canvasWidth} 
                height={canvasHeight} 
                className="gameplay-canvas"
              />
              <span className="canvas-tap-hint">Tap sky screen to aim &amp; fire instantly 💧</span>
            </div>

            {/* Mobile Screen Bottom Console Buttons */}
            <div className="arcade-mobile-buttons">
              <button onClick={handleMoveLeft} className="console-ctrl-btn">
                ◀ Move Left
              </button>
              <button 
                onTouchStart={startMobileShoot}
                onTouchEnd={stopMobileShoot}
                onMouseDown={startMobileShoot}
                onMouseUp={stopMobileShoot}
                onMouseLeave={stopMobileShoot}
                className="console-ctrl-btn shoot-btn"
              >
                Shoot 💥
              </button>
              <button onClick={handleMoveRight} className="console-ctrl-btn">
                Move Right ▶
              </button>
            </div>
            
            <div className="arcade-playing-footer">
              <button onClick={() => setStage('welcome')} className="btn-quit">
                Abrupt Quit 🛑
              </button>
            </div>
          </div>
        )}

        {/* GAME OVER SCREEN */}
        {stage === 'gameover' && (
          <div className="arcade-screen gameover-screen fade-in">
            <div className="gameover-badge">💀 DEFEATED</div>
            
            <div className="gameover-text-panel">
              <h2 className="gameover-title">The doubts overwhelmed your headspace.</h2>
              <p className="gameover-reflection">
                You silenced <strong>{uiScore}</strong> negative doubts this round. <br />
                Your current High Score: <strong>{highScore}</strong> <br />
                Don't be discouraged. Reframing your thoughts is a constant journey, and every step counts.
              </p>
            </div>

            <button onClick={startGame} className="btn-book-now arcade-start-btn pulse-glow" style={{ background: 'linear-gradient(135deg, #e64980, #fa5252)' }}>
              Try Again 🛡️
            </button>
            
            <button onClick={() => setStage('welcome')} className="btn-book-now bloom-reset-btn" style={{ marginTop: '14px' }}>
              Return to Console 🌿
            </button>
          </div>
        )}

        {/* GAME VICTORY STAGE SCREEN */}
        {stage === 'victory' && (
          <div className="arcade-screen victory-screen fade-in">
            <div className="victory-badge">🏆 VICTORY</div>
            
            <div className="victory-text-panel">
              <h2 className="victory-quote">
                “Every negative thought you silenced today? Your mind did that. You're stronger than you think.”
              </h2>
              <p className="victory-reflection">
                You successfully defended your headspace. You silenced <strong>{uiScore}</strong> negative doubts today! <br />
                All-time High Score: <strong>{highScore}</strong> <br />
                Remember: The weapons of validation and positive intent are always inside you.
              </p>
            </div>

            <div className="victory-decor-cloud">
              <span className="lotus-glowing">🌸</span>
            </div>

            <button onClick={startGame} className="btn-book-now arcade-start-btn">
              Fight Back Again 🛡️
            </button>
            
            <button onClick={() => setStage('welcome')} className="btn-book-now bloom-reset-btn" style={{ marginTop: '14px' }}>
              Return to Console 🌿
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ThoughtInvaders;
