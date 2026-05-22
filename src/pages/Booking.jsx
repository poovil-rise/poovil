import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const Booking = () => {
  const {
    currentUser,
    selectedConsultant,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
    addBooking,
    db,
    showToast,
    setActiveSection
  } = useApp();

  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [note, setNote] = useState('');

  // Auto-fill details for logged-in users
  useEffect(() => {
    if (currentUser && currentUser.name !== 'Guest') {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setAge(currentUser.age || '');
    } else {
      setName('');
      setEmail('');
      setAge('');
    }
  }, [currentUser]);

  // If no consultant selected, redirect to consultants grid
  useEffect(() => {
    if (!selectedConsultant) {
      setActiveSection('consultants');
    }
  }, [selectedConsultant, setActiveSection]);

  if (!selectedConsultant) return null;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const changeMonth = (dir) => {
    let nextMonth = calMonth + dir;
    let nextYear = calYear;
    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear++;
    } else if (nextMonth < 0) {
      nextMonth = 11;
      nextYear--;
    }
    setCalMonth(nextMonth);
    setCalYear(nextYear);
  };

  const getBookingsForConsultant = (cid, dateStr) => {
    return db.bookings.filter(b => b.consultantId === cid && b.date === dateStr && b.status !== 'cancelled');
  };

  // Generate calendar days
  const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const calendarDays = [];
  // Empty blocks before the first day of month
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push({ type: 'empty', label: i });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(calYear, calMonth, d);
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isPast = dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isToday = dateObj.toDateString() === today.toDateString();

    const bookings = getBookingsForConsultant(selectedConsultant.id, dateStr);
    const totalSlots = selectedConsultant.slots ? selectedConsultant.slots.length : 0;
    const isFull = bookings.length >= totalSlots && totalSlots > 0;
    const hasSlots = !isPast && !isFull && totalSlots > 0;
    const isSelected = selectedDate === dateStr;

    calendarDays.push({
      type: 'day',
      dayNum: d,
      dateStr,
      isPast,
      isToday,
      isFull,
      hasSlots,
      isSelected
    });
  }

  const handleDaySelect = (day) => {
    if (day.isPast || day.isFull) return;
    setSelectedDate(day.dateStr);
    setSelectedSlot(null); // Reset slot
    setNote('');
  };

  // Fetch slots based on selection
  const bookedSlots = selectedDate
    ? getBookingsForConsultant(selectedConsultant.id, selectedDate).map(b => b.time)
    : [];

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !age) {
      showToast('Please fill in your details');
      return;
    }
    if (!note) {
      showToast('Please describe your issue — this helps us prepare for your session');
      return;
    }

    const success = addBooking(name, email, age, note);
    if (success) {
      // Clear forms
      setNote('');
      setSelectedDate(null);
      setSelectedSlot(null);
      // Route to My Bookings
      setActiveSection('mybookings');
    }
  };

  // Format date display title (e.g. "May 21, 2026")
  let slotTitle = 'Select a Date';
  if (selectedDate) {
    const [yr, mo, dy] = selectedDate.split('-');
    const mName = shortMonths[parseInt(mo) - 1];
    slotTitle = `${mName} ${parseInt(dy)}, ${yr}`;
  }

  return (
    <div id="bookingSection" className="fade-in" style={{ paddingBottom: '48px' }}>
      <div className="page-header">
        <h2>Schedule Your Session</h2>
        <p id="bookingSubtitle">Booking with {selectedConsultant.name}</p>
      </div>
      <div className="booking-layout">
        <div className="calendar-section">
          <div className="cal-header">
            <button className="cal-nav" onClick={() => changeMonth(-1)}>‹</button>
            <div className="cal-title" id="calTitle">{months[calMonth]} {calYear}</div>
            <button className="cal-nav" onClick={() => changeMonth(1)}>›</button>
          </div>
          <div className="cal-grid" id="calGrid">
            {/* Week Headers */}
            {daysOfWeek.map((day, idx) => (
              <div key={`header-${idx}`} className="cal-day-name">{day}</div>
            ))}
            {/* Calendar Days */}
            {calendarDays.map((cell, idx) => {
              if (cell.type === 'empty') {
                return <div key={`empty-${idx}`} className="cal-day empty" />;
              }

              let cls = 'cal-day';
              if (cell.isPast) cls += ' past';
              else if (cell.isFull) cls += ' full';
              else if (cell.isSelected) cls += ' selected-day';
              else if (cell.hasSlots) cls += ' has-slots';
              if (cell.isToday) cls += ' today';

              return (
                <div
                  key={`day-${cell.dayNum}`}
                  className={cls}
                  onClick={() => handleDaySelect(cell)}
                >
                  {cell.dayNum}
                </div>
              );
            })}
          </div>
          <div className="slot-legend">
            <div className="legend-item"><div className="dot" style={{ background: '#e8f2ec' }} /> Available</div>
            <div className="legend-item"><div className="dot" style={{ background: '#4a7c59' }} /> Selected</div>
            <div className="legend-item"><div className="dot" style={{ background: '#fdecea' }} /> Fully Booked</div>
          </div>
        </div>

        <div className="slots-section">
          <h3 id="slotDateTitle">{slotTitle}</h3>
          <div id="slotsContainer">
            {!selectedDate ? (
              <div style={{ color: 'var(--text-light)', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
                Please select a date from the calendar
              </div>
            ) : (
              <div className="slots-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                {selectedConsultant.slots.map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  const isChosen = selectedSlot === slot;
                  return (
                    <div
                      key={slot}
                      className={`time-slot ${isBooked ? 'booked' : isChosen ? 'chosen-slot' : 'available'}`}
                      onClick={() => !isBooked && handleSlotSelect(slot)}
                      style={{ cursor: isBooked ? 'not-allowed' : 'pointer' }}
                    >
                      <span>{slot}</span>
                      <span className="slot-status" style={{ color: isBooked ? 'var(--red)' : isChosen ? 'var(--sage-dark)' : 'var(--text-light)' }}>
                        {isBooked ? 'Booked' : isChosen ? 'Selected' : 'Available'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {selectedSlot && selectedDate && (
            <div className="booking-form" id="bookingFormDiv" style={{ display: 'block', marginTop: '24px' }}>
              <h4>Confirm Your Booking</h4>
              <div className="summary-box" id="bookingSummary">
                <strong>Consultant:</strong> {selectedConsultant.name}
                <br />
                <strong>Date:</strong> {selectedDate}
                <br />
                <strong>Time:</strong> {selectedSlot}
              </div>
              <form onSubmit={handleSubmit}>
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid var(--border)',
                    borderRadius: '12px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '15px',
                    color: 'var(--text)',
                    background: 'var(--white)',
                    outline: 'none',
                    marginBottom: '12px'
                  }}
                />
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid var(--border)',
                    borderRadius: '12px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '15px',
                    color: 'var(--text)',
                    background: 'var(--white)',
                    outline: 'none',
                    marginBottom: '12px'
                  }}
                />
                <label>Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid var(--border)',
                    borderRadius: '12px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '15px',
                    color: 'var(--text)',
                    background: 'var(--white)',
                    outline: 'none',
                    marginBottom: '12px'
                  }}
                />
                <label>
                  Describe Your Issue <span style={{ color: 'var(--red)' }}>*</span>{' '}
                  <span style={{ fontSize: '11px', color: 'var(--text-light)', textTransform: 'none', fontWeight: 400 }}>
                    (in simple words)
                  </span>
                </label>
                <textarea
                  placeholder="e.g. I feel very anxious in social situations, I have been feeling sad for weeks, I am having trouble sleeping..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid var(--border)',
                    borderRadius: '12px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '15px',
                    color: 'var(--text)',
                    background: 'var(--white)',
                    outline: 'none',
                    transition: 'border-color .2s',
                    marginBottom: '16px',
                    minHeight: '90px',
                    resize: 'vertical'
                  }}
                />
                <button type="submit" className="btn-primary">
                  Confirm Booking
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
