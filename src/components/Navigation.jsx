import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Navigation = () => {
  const { currentUser, activeSection, setActiveSection, logout } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleNavClick = (section) => {
    setActiveSection(section);
    setIsMenuOpen(false);
  };

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
      <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        <button
          className={`nav-link ${activeSection === 'about' ? 'active-link' : ''}`}
          onClick={() => handleNavClick('about')}
        >
          About
        </button>
        <button
          className={`nav-link ${activeSection === 'consultants' || activeSection === 'booking' ? 'active-link' : ''}`}
          onClick={() => handleNavClick('consultants')}
        >
          Our Consultants
        </button>
        <button
          className={`nav-link ${activeSection === 'queries' ? 'active-link' : ''}`}
          onClick={() => handleNavClick('queries')}
        >
          Queries &amp; Response
        </button>
        <button
          className={`nav-link ${activeSection === 'reachus' ? 'active-link' : ''}`}
          onClick={() => handleNavClick('reachus')}
        >
          Reach Us
        </button>
        <button
          className={`nav-link ${activeSection === 'services' ? 'active-link' : ''}`}
          onClick={() => handleNavClick('services')}
        >
          Services
        </button>
        <button
          className={`nav-link ${activeSection === 'blog' ? 'active-link' : ''}`}
          onClick={() => handleNavClick('blog')}
        >
          The Clarity Space
        </button>
        <button
          className={`nav-link ${['games_hub', 'letters', 'bloom', 'invaders', 'heartbeat'].includes(activeSection) ? 'active-link' : ''}`}
          onClick={() => handleNavClick('games_hub')}
        >
          Games
        </button>
        <button
          className={`nav-link ${activeSection === 'mybookings' ? 'active-link' : ''}`}
          onClick={() => handleNavClick('mybookings')}
        >
          My Bookings
        </button>
      </div>
      <div className="nav-right">
        <button className="hamburger-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--sage-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>
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
