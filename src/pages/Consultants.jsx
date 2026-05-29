import React from 'react';
import { useApp } from '../context/AppContext';

const Consultants = () => {
  const { consultants, setSelectedConsultant, setActiveSection } = useApp();

  const handleSelectConsultant = (c) => {
    setSelectedConsultant(c);
    // Automatically select current date as today or reset select states for new booking
    setActiveSection('booking');
  };

  return (
    <div id="consultantsSection" className="fade-in" style={{ paddingBottom: '48px' }}>
      <div className="page-header">
        <h2>Choose Your Consultant</h2>
        <p>SELECT THE PROFESSIONAL YOU FEEL MOST COMFORTABLE WITH!!</p>
        <p>We believe MENTAL HEALTH is for everyone, Our counseling services welcome people of all ages and genders.</p>
      </div>
      <div className="consultants-grid" id="consultantsGrid">
        {consultants.map((c) => {
          // Adjust images dynamically to match Poovil Psychology clean HTML references
          const displayPhoto = c.id === 'c1' ? '/assets/image_5.jpeg' : c.photo;
          return (
            <div key={c.id} className="consultant-card" onClick={() => handleSelectConsultant(c)}>
              <div className="c-photo" style={{ zIndex: 5 }}>
                <img
                  src={displayPhoto}
                  className="consultant-img"
                  alt={c.name}
                />
              </div>
              <div className="c-body">
                <div className="c-name">{c.name}</div>
                <div className="c-specialty">{c.specialty}</div>
                <div className="c-bio" style={{ whiteSpace: 'pre-line' }}>{c.bio}</div>
                <div className="c-exp">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8aaa95" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                  {c.exp}
                </div>
                <button className="btn-select">Select &amp; Book</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Consultants;
