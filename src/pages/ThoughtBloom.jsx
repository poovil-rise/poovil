import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import Sentiment from 'sentiment';

const sentiment = new Sentiment();

const Petals = () => {
  const petals = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    width: `${Math.random() * 15 + 10}px`,
    height: `${Math.random() * 15 + 10}px`,
    animationDurationFall: `${Math.random() * 10 + 5}s`,
    animationDelayFall: `-${Math.random() * 10}s`,
    animationDurationSway: `${Math.random() * 3 + 2}s`,
  }));

  return (
    <div className="petals-container">
      {petals.map((p) => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            width: p.width,
            height: p.height,
            animation: `fall ${p.animationDurationFall} linear ${p.animationDelayFall} infinite, sway ${p.animationDurationSway} ease-in-out infinite alternate`
          }}
        />
      ))}
    </div>
  );
};

// We removed the SVG flowers and now use the stunning crossfade reveal mechanism

const ThoughtBloom = () => {
  const { showToast } = useApp();
  
  const [gameState, setGameState] = useState('welcome'); // welcome, active, completed
  const [timeElapsed, setTimeElapsed] = useState(0); 
  const [fastestTime, setFastestTime] = useState(0);
  
  const [inputText, setInputText] = useState('');
  const [words, setWords] = useState([]);
  
  const inputRef = useRef(null);
  const bgMusicRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('thoughtBloomFastestTime');
    if (saved) setFastestTime(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    let timer;
    if (gameState === 'active') {
      timer = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
      
      // Play background music
      if (bgMusicRef.current) {
        bgMusicRef.current.volume = 0.5;
        bgMusicRef.current.play().catch(err => console.log("Audio autoplay blocked:", err));
      }
    } else {
      // Stop background music
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const startGame = () => {
    setGameState('active');
    setTimeElapsed(0);
    setWords([]);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!inputText.trim() || gameState !== 'active') return;
      
      const newWord = inputText.trim();
      
      // Validation 1: Too short
      if (newWord.length < 3) {
        showToast("Please type a longer word! 🌱");
        return;
      }
      
      // Validation 2: Gibberish keyboard mashing (4+ consonants in a row)
      if (/[bcdfghjklmnpqrstvwxyz]{4,}/i.test(newWord)) {
        showToast("Hmm, that doesn't look like a real word! 🤔");
        return;
      }
      
      // Validation 3: Negative Sentiment
      const result = sentiment.analyze(newWord);
      if (result.score < 0) {
        showToast("The garden only blooms with positive or neutral thoughts! 🌸");
        return;
      }

      // Validation 4: Duplicate Check
      if (words.some(w => w.toLowerCase() === newWord.toLowerCase())) {
        showToast("You already planted that thought! 🌱");
        return;
      }

      setInputText('');
      
      const newWords = [...words, newWord];
      setWords(newWords);
      
      // End game if fully bloomed
      if (newWords.length >= 8) {
        setGameState('completed');
        confetti({ particleCount: 200, spread: 120, origin: { y: 0.6 }, zIndex: 9999 });
        
        if (fastestTime === 0 || timeElapsed < fastestTime) {
          setFastestTime(timeElapsed);
          localStorage.setItem('thoughtBloomFastestTime', timeElapsed.toString());
          showToast("New Record Time! 🏆");
        } else {
          showToast(`Beautiful! You fully bloomed in ${timeElapsed}s 🌸`);
        }
      }
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const secs = s % 60;
    return `${m}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flower-game-container">
      <style>{`
        .flower-game-container {
          background: radial-gradient(circle at center, #ffe4e1 0%, #fff0f5 50%, #fdf2f8 100%) !important;
        }
        .flower-left-col, .flower-right-col {
          background: rgba(255, 255, 255, 0.3) !important;
          backdrop-filter: blur(16px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(16px) saturate(180%) !important;
          border-left: 1px solid rgba(255, 255, 255, 0.6) !important;
          border-right: 1px solid rgba(255, 255, 255, 0.6) !important;
        }
        .petals-container {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          overflow: hidden; pointer-events: none; z-index: 0;
        }
        .petal {
          position: absolute;
          background: linear-gradient(135deg, #ffb6c1, #ff69b4);
          border-radius: 15px 0 15px 0;
          opacity: 0.6;
          box-shadow: 0 0 10px rgba(255, 105, 180, 0.3);
        }
        @keyframes fall {
          0% { top: -10%; transform: rotate(0deg); }
          100% { top: 110%; transform: rotate(360deg); }
        }
        @keyframes sway {
          0% { margin-left: -50px; }
          100% { margin-left: 50px; }
        }
        .center-glow {
          position: absolute;
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(255, 105, 180, 0.15) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%;
          z-index: 0;
          animation: pulseGlow 6s infinite alternate;
          pointer-events: none;
        }
        @keyframes pulseGlow {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
        }
      `}</style>

      <Petals />
      <div className="center-glow" />

      <audio ref={bgMusicRef} src="/assets/mixkit-silent-descent-614.mp3" loop />
      
      {/* LEFT COLUMN: STATS */}
      <div className="flower-left-col">
        {gameState === 'active' || gameState === 'completed' ? (
          <>
            <div className="flower-timer">{formatTime(timeElapsed)}</div>
            <div className="flower-score" style={{marginTop: '2rem'}}>Time Elapsed: {timeElapsed}s</div>
            <div className="flower-score">Fastest Bloom: {fastestTime > 0 ? `${fastestTime}s` : '--'}</div>
            {gameState === 'completed' && (
               <button className="flower-start-btn" style={{marginTop: '3rem'}} onClick={startGame}>
                 Bloom Again
               </button>
            )}
          </>
        ) : (
          <div style={{textAlign: 'center'}}>
            <h1 style={{color: '#db2777', fontSize: '2.5rem', marginBottom: '1rem'}}>Thought Bloom</h1>
            <p style={{fontSize: '1.2rem', color: '#4b5563', marginBottom: '2rem', lineHeight: '1.6'}}>
              Type 8 positive thoughts as fast as you can to fully bloom the logo!<br/>
              <span style={{fontSize: '1rem', color: '#db2777', fontWeight: '500'}}>
                Examples: happy, strong, capable, brave, peace, calm, joy, focused
              </span>
            </p>
            <div className="flower-score" style={{marginBottom: '2rem'}}>Fastest Bloom: {fastestTime > 0 ? `${fastestTime}s` : '--'}</div>
            <button className="flower-start-btn" onClick={startGame}>Start Game</button>
          </div>
        )}
      </div>

      {/* CENTER COLUMN: LOGO & INPUT */}
      <div className="flower-center-col">
        <div className="flower-logo-wrapper" style={{ position: 'relative' }}>
          {/* Base Text Placeholder (Replaces bare image) */}
          <div 
            style={{ 
              position: 'absolute', 
              top: '0', left: '0', width: '100%', height: '100%', 
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              color: '#db2777', fontSize: '1.4rem', fontWeight: 'bold', textAlign: 'center', padding: '2rem',
              opacity: words.length === 0 ? 1 : 0.1, transition: 'opacity 0.5s',
              zIndex: 1
            }}
          >
            Type affirmative thoughts to reveal the logo...
          </div>
          
          {/* Full Floral Image (Reveals via Clock Wipe) */}
          <img 
            src="/assets/poovil-heart-full.jpg" 
            alt="Poovil Blooming" 
            className="flower-logo-img" 
            style={{ 
              position: 'absolute', 
              top: '0', 
              left: '0', 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain',
              WebkitMaskImage: `conic-gradient(black ${Math.min(100, (words.length / 8) * 100)}%, transparent 0)`,
              maskImage: `conic-gradient(black ${Math.min(100, (words.length / 8) * 100)}%, transparent 0)`,
              transition: 'mask-image 0.5s ease-out, -webkit-mask-image 0.5s ease-out',
              zIndex: 11
            }}
          />
        </div>
        
        {gameState === 'active' && (
          <div className="flower-input-wrapper">
            <input 
              ref={inputRef}
              type="text"
              className="flower-input"
              placeholder="Type a word and press Enter..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: WORDS */}
      <div className="flower-right-col">
        <h3 style={{color: '#be185d', fontSize: '1.5rem', marginBottom: '1rem'}}>Your Garden of Thoughts</h3>
        {words.slice().reverse().map((w, idx) => (
          <div key={idx} className="flower-word-bubble">
            {w}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThoughtBloom;
