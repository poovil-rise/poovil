import React from 'react';
import { useApp } from '../context/AppContext';

const GamesHub = () => {
  const { setActiveSection } = useApp();

  const games = [
    {
      id: 'letters',
      title: 'Letters Never Sent',
      icon: '/assets/letters_icon.png',
      description: 'Write down unspoken words on an airplane and watch it fly away into the sky. A therapeutic letting go exercise.',
      color: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
      textColor: '#2a5298'
    },
    {
      id: 'bloom',
      title: 'Thought Water',
      icon: '/assets/bloom_icon.png',
      description: 'Drop your heavy thoughts into a serene pond and watch them transform into beautiful, calm lotus flowers.',
      color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      textColor: '#c94b4b'
    },
    {
      id: 'invaders',
      title: 'Thought Invaders',
      icon: '/assets/invaders_icon.png',
      description: 'An arcade-style game to practice cognitive defusion by playfully blasting away your negative racing thoughts.',
      color: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      textColor: '#4a00e0'
    },
    {
      id: 'heartbeat',
      title: 'Heartbeat Drummer',
      icon: '/assets/heartbeat_icon.png',
      description: 'Tap along to find your calm rhythm in this deeply relaxing procedural audio-visual heartbeat experience.',
      color: 'linear-gradient(135deg, #fbcfe8 0%, #fdba74 100%)',
      textColor: '#c2410c'
    },
    {
      id: 'pop_pressure',
      title: 'Pop the Pressure',
      icon: '/assets/pop_icon.svg',
      description: 'A calming 30-second mini-game to help you physically release stress by popping rising thought bubbles.',
      color: 'linear-gradient(135deg, #e0f2fe 0%, #7dd3fc 100%)',
      textColor: '#0369a1'
    },
    {
      id: 'tilted_minds',
      title: 'Tilted Minds',
      icon: '/assets/tilted_icon.svg',
      description: 'Find your center by physically counterbalancing the heavy weights of past regrets and future anxieties.',
      color: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
      textColor: '#1e293b'
    }
  ];

  return (
    <div className="games-hub-container fade-in">
      <div className="games-hub-header">
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '48px', color: 'var(--text-dark)', marginBottom: '16px' }}>
          Interactive Wellness
        </h2>
        <p style={{ fontSize: '18px', color: 'var(--text)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Explore our collection of immersive, psychology-backed mini-games. Each experience is designed to help you release anxiety, ground yourself, and find your calm rhythm.
        </p>
      </div>

      <div className="games-hub-grid">
        {games.map(game => (
          <div 
            key={game.id} 
            className="game-card"
            style={{ '--theme-color': game.textColor, '--bg-grad': game.color }}
            onClick={() => setActiveSection(game.id)}
          >
            <div className="game-card-icon">
              <img src={game.icon} alt={game.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
            </div>
            
            <div className="game-card-content">
              <h3>{game.title}</h3>
              <p>{game.description}</p>
            </div>
            
            <div className="game-card-action">
              <button>Play Experience</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesHub;
