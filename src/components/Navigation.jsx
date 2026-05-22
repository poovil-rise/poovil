import React from 'react';
import { useApp } from '../context/AppContext';

const Navigation = () => {
  const { currentUser, activeSection, setActiveSection, logout } = useApp();

  const handleAvatarClick = () => {
    if (currentUser.name === 'Guest') {
      setActiveSection('login');
    } else {
      setActiveSection('mybookings');
    }
  };

  const isGuest = currentUser.name === 'Guest';
  const initial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'G';

  return (
    <nav>
      <div className="nav-logo-wrap" onClick={() => setActiveSection('about')} style={{ cursor: 'pointer' }}>
        <img src="/assets/image_0.jpeg" className="nav-logo-img" alt="Poovil Logo" />
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 500, color: 'var(--sage-dark)' }}>
          POOVIL
        </span>
      </div>
      <div className="nav-links">
        <button
          className={`nav-link ${activeSection === 'about' ? 'active-link' : ''}`}
          onClick={() => setActiveSection('about')}
        >
          About
        </button>
        <button
          className={`nav-link ${activeSection === 'consultants' || activeSection === 'booking' ? 'active-link' : ''}`}
          onClick={() => setActiveSection('consultants')}
        >
          Our Consultants
        </button>
        <button
          className={`nav-link ${activeSection === 'queries' ? 'active-link' : ''}`}
          onClick={() => setActiveSection('queries')}
        >
          Queries &amp; Response
        </button>
        <button
          className={`nav-link ${activeSection === 'reachus' ? 'active-link' : ''}`}
          onClick={() => setActiveSection('reachus')}
        >
          Reach Us
        </button>
        <button
          className={`nav-link ${activeSection === 'services' ? 'active-link' : ''}`}
          onClick={() => setActiveSection('services')}
        >
          Services
        </button>
        <button
          className={`nav-link ${activeSection === 'blog' ? 'active-link' : ''}`}
          onClick={() => setActiveSection('blog')}
        >
          The Clarity Space
        </button>
        <button
          className={`nav-link ${['games_hub', 'letters', 'bloom', 'invaders', 'heartbeat'].includes(activeSection) ? 'active-link' : ''}`}
          onClick={() => setActiveSection('games_hub')}
        >
          Games
        </button>
        <button
          className={`nav-link ${activeSection === 'mybookings' ? 'active-link' : ''}`}
          onClick={() => setActiveSection('mybookings')}
        >
          My Bookings
        </button>
      </div>
      <div className="nav-right">
        <div
          className="avatar"
          id="userAvatar"
          onClick={handleAvatarClick}
          style={{ cursor: 'pointer' }}
          title={isGuest ? 'Sign In / Register' : `Profile: ${currentUser.name}`}
        >
          {initial}
        </div>
        {!isGuest && (
          <button className="logout-btn" onClick={logout}>
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
