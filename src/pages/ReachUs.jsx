import React from 'react';
import { useApp } from '../context/AppContext';

const ReachUs = () => {
  const { setActiveSection } = useApp();

  return (
    <div id="reachusSection" className="fade-in" style={{ paddingBottom: '48px' }}>
      <div className="reachus-hero">
        <img id="footerLogoImg" src="/assets/image_2.png" alt="Poovil" />
        <div>
          <h2>Reach <em>Us</em></h2>
          <p className="hero-subtitle">We're here for you — connect with us on any platform that feels comfortable!!</p>
        </div>
      </div>

      <div className="why-choose-wrap">
        <div className="why-choose-icon">
          <img src="/assets/megaphone.jpg" alt="Megaphone Reach Us" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
        </div>
        <div className="why-choose-text">
          <h3>Why choose us:</h3>
          <p>We all want to share or communicate a lot of our thoughts with someone, and sometimes, circumstances put us in a place where some things go unsaid and unspoken. At Poovil, we are a team of dedicated consultant psychologists ready to provide a safe, nonjudgmental, and confidential space for every unique individual with personalized care, a holistic and proven approach, and flexible and easily accessible service.</p>
        </div>
      </div>

      <div className="platforms-wrap">
        <h4>Connect With Us</h4>
        <p className="platforms-subtext">Choose your favourite platform — we're just a tap away</p>
        <div className="platform-icons">

          {/* Gmail */}
          <div className="platform-icon-wrap">
            <a className="platform-icon" href="mailto:poovil.rise@gmail.com" title="Gmail" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
                <circle cx="36" cy="36" r="36" fill="white"></circle>
                <g transform="translate(10,16)">
                  <rect x="0" y="0" width="52" height="40" rx="3" fill="white" stroke="#e0e0e0" strokeWidth="1.5"></rect>
                  <rect x="0" y="0" width="4" height="40" fill="#EA4335"></rect>
                  <rect x="48" y="0" width="4" height="40" fill="#EA4335"></rect>
                  <rect x="0" y="0" width="52" height="4" fill="#4285F4"></rect>
                  <rect x="0" y="36" width="52" height="4" fill="#34A853"></rect>
                  <path d="M0 0 L26 22 L52 0 Z" fill="white"></path>
                  <path d="M0 0 L26 22 L52 0" fill="none" stroke="#EA4335" strokeWidth="3" strokeLinejoin="round"></path>
                </g>
              </svg>
            </a>
            <span class="platform-label">Gmail</span>
          </div>

          {/* Instagram */}
          <div className="platform-icon-wrap">
            <a className="platform-icon" href="https://www.instagram.com/poovil.rise?igsh=MTBkcWdudXAzNHkzMg==" title="Instagram" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
                    <stop offset="0%" stopColor="#fdf497"></stop>
                    <stop offset="10%" stopColor="#fdf497"></stop>
                    <stop offset="50%" stopColor="#fd5949"></stop>
                    <stop offset="68%" stopColor="#d6249f"></stop>
                    <stop offset="100%" stopColor="#285AEB"></stop>
                  </radialGradient>
                </defs>
                <circle cx="36" cy="36" r="36" fill="url(#ig-grad)"></circle>
                <rect x="18" y="18" width="36" height="36" rx="10" fill="none" stroke="white" strokeWidth="3"></rect>
                <circle cx="36" cy="36" r="9" fill="none" stroke="white" strokeWidth="3"></circle>
                <circle cx="46.5" cy="25.5" r="2" fill="white"></circle>
              </svg>
            </a>
            <span class="platform-label">Instagram</span>
          </div>

          {/* X (Twitter) */}
          <div className="platform-icon-wrap">
            <a className="platform-icon" href="https://x.com/Poovil_Poovil?t=xaM_oBx_Rv_qLcGgNUOxSQ&amp;s=09" title="X" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
                <circle cx="36" cy="36" r="36" fill="#000"></circle>
                <path d="M20 20h9l7 10 8-10h8L39 33l14 19h-9l-8-11-9 11h-8l14-18z" fill="white"></path>
              </svg>
            </a>
            <span class="platform-label">X</span>
          </div>

          {/* Facebook */}
          <div className="platform-icon-wrap">
            <a className="platform-icon" href="https://www.facebook.com/share/p/15BwtMcna4/" title="Facebook" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
                <circle cx="36" cy="36" r="36" fill="#1877F2"></circle>
                <path d="M40 36h-4v16h-6V36h-3v-6h3v-3c0-4 2-7 7-7h4v6h-3c-1 0-2 .5-2 2v2h5z" fill="white"></path>
              </svg>
            </a>
            <span class="platform-label">Facebook</span>
          </div>

          {/* WhatsApp */}
          <div className="platform-icon-wrap">
            <a className="platform-icon" href="https://chat.whatsapp.com/LjH5WUUvHyf2tfNWgKh0O1" title="WhatsApp" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
                <circle cx="36" cy="36" r="36" fill="#25D366"></circle>
                <path fillRule="evenodd" clipRule="evenodd" d="M36 13C23.3 13 13 23.3 13 36c0 4.7 1.4 9.1 3.7 12.8L13.5 59l10.5-3.2C27.5 57.5 31.6 58.8 36 58.8 48.7 58.8 59 48.5 59 35.8 59 23.1 48.7 13 36 13z" fill="white"></path>
                <path fillRule="evenodd" clipRule="evenodd" d="M36 15.8c-11.1 0-20.2 9.1-20.2 20.2 0 4.4 1.4 8.5 3.9 11.8l-2.5 7.5 7.7-2.5c3.2 2.1 7 3.4 11.1 3.4 11.1 0 20.2-9.1 20.2-20.2S47.1 15.8 36 15.8z" fill="#25D366"></path>
                <path d="M28.3 25.4c-.4-.9-.8-.9-1.2-.9-.3 0-.7 0-1.1 0-.4 0-1 .1-1.5.7-.5.5-2 2-2 4.8s2.1 5.6 2.4 6c.3.4 4 6.4 9.9 8.7 4.9 1.9 5.9 1.6 6.9 1.5 1-.1 3.3-1.3 3.8-2.6.4-1.3.4-2.4.3-2.6-.1-.2-.4-.3-.9-.6-.4-.2-2.7-1.3-3.1-1.5-.4-.2-.7-.2-1 .2-.3.4-1.2 1.5-1.5 1.8-.3.3-.5.4-.9.1-.4-.2-1.8-.7-3.4-2.1-1.3-1.1-2.1-2.5-2.4-2.9-.2-.4 0-.7.2-.9.2-.2.4-.5.7-.7.2-.2.3-.4.5-.7.2-.3.1-.6 0-.8-.1-.2-1-2.5-1.4-3.5z" fill="white"></path>
              </svg>
            </a>
            <span class="platform-label">WhatsApp</span>
          </div>

        </div>
        <p className="platform-hint"><strong>Click on any icon</strong> and you get directed to the respective link</p>

        <div className="connect-cta">
          <p>Are you ready to connect in a more structured setting?</p>
          <button className="btn-book-appointment" onClick={() => setActiveSection('consultants')}>
            Book an Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReachUs;
