import React from 'react';
import { useApp } from '../context/AppContext';

const MyBookings = () => {
  const { db, currentUser, setActiveSection } = useApp();

  const mine = db.bookings.filter(b => b.userId === currentUser.id);

  return (
    <div id="myBookingsSection" className="fade-in" style={{ padding: '32px 48px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: '300', marginBottom: '24px' }}>
        My Bookings
      </h2>
      <div id="myBookingsList">
        {mine.length === 0 ? (
          <div className="empty-state">
            <div className="big">📅</div>
            <p>
              No bookings yet.{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('consultants'); }} style={{ color: 'var(--sage)' }}>
                Book a session
              </a>
            </p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Consultant</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {mine.map((b) => (
                <tr key={b.id}>
                  <td>
                    <strong>{b.consultantName}</strong>
                  </td>
                  <td>{b.date}</td>
                  <td>{b.time}</td>
                  <td>
                    <span className={`status-badge ${b.status === 'done' ? 'done' : 'pending'}`}>
                      {b.status === 'done' ? 'Completed' : 'Upcoming'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    {b.note || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
