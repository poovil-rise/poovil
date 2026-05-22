import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Footer = () => {
  const { setActiveSection, adminLogin } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminClick = () => {
    setIsModalOpen(true);
    setPassword('');
    setError('');
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    if (!password) {
      setError('Please enter password');
      return;
    }
    const res = adminLogin(password);
    if (res.success) {
      setIsModalOpen(false);
      setPassword('');
      setError('');
    } else {
      setError(res.error);
    }
  };

  return (
    <>
      <footer className="site-footer" style={{ marginTop: 'auto' }}>
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-logo">
              <img id="footerLogoImg" src="/assets/image_2.png" alt="Poovil Logo" />
              <div>
                <div className="footer-logo-text">POOVIL</div>
                <div className="footer-tagline">BLOOM.EMPOWER.GROW</div>
                <div className="footer-socials" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '12px' }}>
                  <a href="https://www.instagram.com/poovil.rise?igsh=MTBkcWdudXAzNHkzMg==" title="Instagram" target="_blank" rel="noreferrer" style={{ width: '32px', height: '32px', transition: 'transform 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <svg viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <radialGradient id="ig-grad-footer" cx="30%" cy="107%" r="150%">
                          <stop offset="0%" stopColor="#fdf497"></stop>
                          <stop offset="10%" stopColor="#fdf497"></stop>
                          <stop offset="50%" stopColor="#fd5949"></stop>
                          <stop offset="68%" stopColor="#d6249f"></stop>
                          <stop offset="100%" stopColor="#285AEB"></stop>
                        </radialGradient>
                      </defs>
                      <circle cx="36" cy="36" r="36" fill="url(#ig-grad-footer)"></circle>
                      <rect x="18" y="18" width="36" height="36" rx="10" fill="none" stroke="white" strokeWidth="3"></rect>
                      <circle cx="36" cy="36" r="9" fill="none" stroke="white" strokeWidth="3"></circle>
                      <circle cx="46.5" cy="25.5" r="2" fill="white"></circle>
                    </svg>
                  </a>
                  <a href="https://chat.whatsapp.com/LjH5WUUvHyf2tfNWgKh0O1" title="WhatsApp" target="_blank" rel="noreferrer" style={{ width: '32px', height: '32px', transition: 'transform 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <svg viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="36" cy="36" r="36" fill="#25D366"></circle>
                      <path fillRule="evenodd" clipRule="evenodd" d="M36 13C23.3 13 13 23.3 13 36c0 4.7 1.4 9.1 3.7 12.8L13.5 59l10.5-3.2C27.5 57.5 31.6 58.8 36 58.8 48.7 58.8 59 48.5 59 35.8 59 23.1 48.7 13 36 13z" fill="white"></path>
                      <path fillRule="evenodd" clipRule="evenodd" d="M36 15.8c-11.1 0-20.2 9.1-20.2 20.2 0 4.4 1.4 8.5 3.9 11.8l-2.5 7.5 7.7-2.5c3.2 2.1 7 3.4 11.1 3.4 11.1 0 20.2-9.1 20.2-20.2S47.1 15.8 36 15.8z" fill="#25D366"></path>
                      <path d="M28.3 25.4c-.4-.9-.8-.9-1.2-.9-.3 0-.7 0-1.1 0-.4 0-1 .1-1.5.7-.5.5-2 2-2 4.8s2.1 5.6 2.4 6c.3.4 4 6.4 9.9 8.7 4.9 1.9 5.9 1.6 6.9 1.5 1-.1 3.3-1.3 3.8-2.6.4-1.3.4-2.4.3-2.6-.1-.2-.4-.3-.9-.6-.4-.2-2.7-1.3-3.1-1.5-.4-.2-.7-.2-1 .2-.3.4-1.2 1.5-1.5 1.8-.3.3-.5.4-.9.1-.4-.2-1.8-.7-3.4-2.1-1.3-1.1-2.1-2.5-2.4-2.9-.2-.4 0-.7.2-.9.2-.2.4-.5.7-.7.2-.2.3-.4.5-.7.2-.3.1-.6 0-.8-.1-.2-1-2.5-1.4-3.5z" fill="white"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="footer-links">
              <button className="footer-link" onClick={() => setActiveSection('about')}>
                About
              </button>
              <button className="footer-link" onClick={() => setActiveSection('consultants')}>
                Consultants
              </button>
              <button className="footer-link" onClick={() => setActiveSection('mybookings')}>
                My Bookings
              </button>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">
              © {new Date().getFullYear()} <span>POOVIL</span>. All rights reserved.
              {/* Hidden admin access */}
              <button onClick={handleAdminClick} className="admin-secret-btn" title="Admin Access">
                ●
              </button>
            </div>
            <div className="footer-motto">
              <em>Bloom. Empower. Grow.</em>
            </div>
          </div>
        </div>
      </footer>

      {/* ADMIN LOGIN MODAL */}
      {isModalOpen && (
        <div
          className="admin-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '40px',
              width: '340px',
              boxShadow: '0 24px 80px rgba(0,0,0,.3)',
              position: 'relative'
            }}
          >
            <button
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#aaa'
              }}
            >
              ✕
            </button>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  background: 'linear-gradient(135deg,#7c5c8a,#b89ec8)',
                  borderRadius: '14px',
                  margin: '0 auto 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px'
                }}
              >
                🔐
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 500, color: '#1a2e22' }}>
                Admin Access
              </div>
              <div style={{ fontSize: '13px', color: '#5a7a65', marginTop: '4px' }}>
                Enter your admin password to continue
              </div>
            </div>
            <form onSubmit={handleLoginSubmit}>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#5a7a65',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '6px'
                }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1.5px solid #d4e4d8',
                  borderRadius: '12px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '15px',
                  outline: 'none',
                  marginBottom: '8px',
                  color: 'var(--text)'
                }}
              />
              <div id="adminPassErr" style={{ color: '#c0392b', fontSize: '13px', minHeight: '18px', marginBottom: '12px' }}>
                {error}
              </div>
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '13px',
                  background: 'linear-gradient(135deg,#4a2d62,#7c5c8a)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '15px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Enter Admin Panel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
