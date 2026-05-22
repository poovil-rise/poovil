import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Login = () => {
  const { login, register, setActiveSection } = useApp();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  
  // Login States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginErr, setLoginErr] = useState('');

  // Register States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regErr, setRegErr] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginErr('');
    if (!loginEmail || !loginPass) {
      setLoginErr('Please fill in all fields');
      return;
    }
    const res = login(loginEmail, loginPass);
    if (!res.success) {
      setLoginErr(res.error);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegErr('');
    if (!regName || !regEmail || !regAge || !regPass) {
      setRegErr('Please fill in all fields');
      return;
    }
    if (regPass.length < 6) {
      setRegErr('Password must be at least 6 characters');
      return;
    }
    const res = register(regName, regEmail, regAge, regPass);
    if (res.success) {
      // Switch tab to login after short delay
      setTimeout(() => {
        setActiveTab('login');
      }, 1000);
    } else {
      setRegErr(res.error);
    }
  };

  return (
    <div className="login-page-bg fade-in">
      <div className="login-card">
        {/* Top Back Action to return to guest mode */}
        <button 
          onClick={() => setActiveSection('about')} 
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'none',
            border: 'none',
            fontSize: '14px',
            color: 'var(--sage)',
            cursor: 'pointer',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          ← Back to Site
        </button>

        <div className="logo-area">
          <img src="/assets/image_0.jpeg" className="logo-img-real" alt="Poovil Logo" />
          <div className="brand-name">POOVIL</div>
          <div className="brand-sub">Psychology &amp; Wellness</div>
        </div>
        
        <div className="tab-switch">
          <button 
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('login'); setLoginErr(''); }}
          >
            Sign In
          </button>
          <button 
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('register'); setRegErr(''); }}
          >
            Register
          </button>
        </div>

        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} id="loginForm">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="you@email.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1.5px solid var(--border)',
                borderRadius: '12px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '15px',
                outline: 'none',
                marginBottom: '16px',
                color: 'var(--text)'
              }}
            />
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1.5px solid var(--border)',
                borderRadius: '12px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '15px',
                outline: 'none',
                marginBottom: '20px',
                color: 'var(--text)'
              }}
            />
            <button type="submit" className="btn-primary">Sign In</button>
            <div className="err" id="loginErr">{loginErr}</div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} id="registerFormDiv" className="register-form" style={{ display: 'block' }}>
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="Your full name"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1.5px solid var(--border)',
                borderRadius: '12px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '15px',
                outline: 'none',
                marginBottom: '14px',
                color: 'var(--text)'
              }}
            />
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="you@email.com"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1.5px solid var(--border)',
                borderRadius: '12px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '15px',
                outline: 'none',
                marginBottom: '14px',
                color: 'var(--text)'
              }}
            />
            <label>Age</label>
            <input 
              type="number" 
              placeholder="Your age"
              min="10"
              max="100"
              value={regAge}
              onChange={(e) => setRegAge(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1.5px solid var(--border)',
                borderRadius: '12px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '15px',
                outline: 'none',
                marginBottom: '14px',
                color: 'var(--text)'
              }}
            />
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Min 6 characters"
              value={regPass}
              onChange={(e) => setRegPass(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1.5px solid var(--border)',
                borderRadius: '12px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '15px',
                outline: 'none',
                marginBottom: '20px',
                color: 'var(--text)'
              }}
            />
            <button type="submit" className="btn-primary">Create Account</button>
            <div className="err" id="regErr">{regErr}</div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
