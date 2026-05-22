import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const AdminDashboard = () => {
  const { 
    db, 
    setDb, 
    logout, 
    APPS_SCRIPT_URL, 
    showToast,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost
  } = useApp();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'appointments', 'completed', 'blog'
  const [loading, setLoading] = useState(false);

  // Blog Form State
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSpecialty, setBlogSpecialty] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogIcon, setBlogIcon] = useState('🌿');
  const [blogContent, setBlogContent] = useState('');
  const [blogId, setBlogId] = useState(null);
  const [isEditingBlog, setIsEditingBlog] = useState(false);

  const handleBlogSubmit = (e) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogSpecialty.trim() || !blogAuthor.trim() || !blogContent.trim()) {
      showToast('Please fill out all fields');
      return;
    }

    if (isEditingBlog) {
      updateBlogPost(blogId, {
        title: blogTitle,
        specialty: blogSpecialty,
        author: blogAuthor,
        icon: blogIcon,
        content: blogContent
      });
      setIsEditingBlog(false);
      setBlogId(null);
    } else {
      addBlogPost(blogTitle, blogContent, blogAuthor, blogIcon, blogSpecialty);
    }

    // Reset Form
    setBlogTitle('');
    setBlogSpecialty('');
    setBlogAuthor('');
    setBlogIcon('🌿');
    setBlogContent('');
  };

  const handleEditBlog = (blog) => {
    setIsEditingBlog(true);
    setBlogId(blog.id);
    setBlogTitle(blog.title);
    setBlogSpecialty(blog.specialty);
    setBlogAuthor(blog.author);
    setBlogIcon(blog.icon || '🌿');
    setBlogContent(blog.content);
    
    // Scroll to form smoothly
    const element = document.getElementById('blogFormContainer');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeleteBlog = (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteBlogPost(id);
    }
  };

  const handleCancelBlogEdit = () => {
    setIsEditingBlog(false);
    setBlogId(null);
    setBlogTitle('');
    setBlogSpecialty('');
    setBlogAuthor('');
    setBlogIcon('🌿');
    setBlogContent('');
  };
  
  // Apps Script Bookings state
  const [appsScriptBookings, setAppsScriptBookings] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    today: 0
  });

  const fetchLiveBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${APPS_SCRIPT_URL}?action=getBookings`);
      const data = await response.json();
      const bookings = data.bookings || [];
      setAppsScriptBookings(bookings);
      calculateStats(bookings);
    } catch (error) {
      console.warn("Could not fetch live bookings from Sheets, using local bookings fallback:", error);
      // Fallback to local db.bookings
      setAppsScriptBookings(db.bookings);
      calculateStats(db.bookings);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (bookings) => {
    const total = bookings.length;
    const upcoming = bookings.filter(b => b.status === 'pending').length;
    const completed = bookings.filter(b => b.status === 'done').length;
    const todayStr = new Date().toISOString().split('T')[0];
    // Match date formatting. In some datasets it's YYYY-MM-DD, in others it's formatted.
    const today = bookings.filter(b => {
      if (!b.date) return false;
      return (String(b.date) === todayStr || String(b.date).includes(todayStr)) && b.status === 'pending';
    }).length;

    setStats({ total, upcoming, completed, today });
  };

  useEffect(() => {
    fetchLiveBookings();
  }, [db.bookings]);

  const handleMarkDone = async (bookingId) => {
    showToast('Updating booking status...');
    try {
      // 1. Sync with Google Sheets
      await fetch(`${APPS_SCRIPT_URL}?action=updateStatus&bookingId=${bookingId}&status=done`, {
        method: 'GET',
        mode: 'no-cors' // Google script redirection handles no-cors
      });
      
      // 2. Update local state
      setDb(prev => {
        const updatedBookings = prev.bookings.map(b => {
          // Both `id` (local) and `bookingId` (Sheets) might be used
          if (b.id === bookingId || b.bookingId === bookingId) {
            return { ...b, status: 'done' };
          }
          return b;
        });
        return { ...prev, bookings: updatedBookings };
      });

      // Update state immediately for UX
      setAppsScriptBookings(prev => 
        prev.map(b => (b.bookingId === bookingId || b.id === bookingId) ? { ...b, status: 'done' } : b)
      );
      
      showToast('Session marked as completed');
    } catch (error) {
      console.error("Could not update booking status:", error);
      showToast('Could not update status');
    }
  };

  // Filter lists based on source (Apps Script / local fallback)
  const pendingSessions = appsScriptBookings.filter(b => b.status === 'pending')
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
    
  const completedSessions = appsScriptBookings.filter(b => b.status === 'done');

  return (
    <div id="adminApp" className="page active" style={{ flexDirection: 'column', background: 'var(--bg)', minHeight: '100vh' }}>
      <nav>
        <div className="nav-logo" style={{ color: 'var(--sage-dark)' }}>
          POOVIL 
          <span style={{ fontSize: '12px', fontFamily: "'DM Sans', sans-serif", color: 'var(--warm)', marginLeft: '6px', fontWeight: '500' }}>
            ADMIN
          </span>
        </div>
        <div className="nav-links">
          <button className={`nav-link ${activeTab === 'overview' ? 'active-link' : ''}`} onClick={() => setActiveTab('overview')}>
            Overview
          </button>
          <button className={`nav-link ${activeTab === 'appointments' ? 'active-link' : ''}`} onClick={() => setActiveTab('appointments')}>
            Appointments
          </button>
          <button className={`nav-link ${activeTab === 'completed' ? 'active-link' : ''}`} onClick={() => setActiveTab('completed')}>
            Completed
          </button>
          <button className={`nav-link ${activeTab === 'blog' ? 'active-link' : ''}`} onClick={() => setActiveTab('blog')}>
            Clarity Space (Blog)
          </button>
        </div>
        <div className="nav-right">
          <div className="avatar" style={{ background: 'linear-gradient(135deg, var(--warm), #e8a06a)' }}>A</div>
          <button className="logout-btn" onClick={logout}>Sign Out</button>
        </div>
      </nav>

      {activeTab === 'overview' && (
        <div id="adminOverview" className="fade-in" style={{ paddingBottom: '48px' }}>
          <div className="page-header">
            <h2>Admin Dashboard</h2>
            <p>Manage all appointments and client sessions</p>
          </div>
          
          <div style={{ padding: '0 48px', margin: '16px auto', maxWidth: '1100px', width: '100%', textAlign: 'right' }}>
            <button 
              className="complete-btn" 
              onClick={fetchLiveBookings} 
              disabled={loading}
              style={{ background: 'var(--sage)', color: '#fff', borderRadius: '8px', padding: '8px 16px' }}
            >
              {loading ? 'Refreshing...' : '🔄 Refresh Live Data'}
            </button>
          </div>

          <div className="admin-stats" style={{ marginTop: '16px' }} id="adminStats">
            <div className="stat-card">
              <div className="stat-num">{stats.total}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{stats.upcoming}</div>
              <div className="stat-label">Upcoming</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{stats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{stats.today}</div>
              <div className="stat-label">Today's Sessions</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div id="adminAppointments" className="fade-in" style={{ paddingBottom: '48px' }}>
          <div className="page-header">
            <h2>Appointments</h2>
            <p>All upcoming scheduled sessions</p>
          </div>
          <div className="admin-table" style={{ marginTop: '24px' }}>
            {loading ? (
              <div className="empty-state">
                <div className="big">⏳</div>
                <p>Loading appointments...</p>
              </div>
            ) : pendingSessions.length === 0 ? (
              <div className="empty-state">
                <div className="big">🗓️</div>
                <p>No upcoming appointments</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Consultant</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Issue</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingSessions.map((b, i) => (
                    <tr key={b.bookingId || b.id || i}>
                      <td>
                        <strong>{b.clientName}</strong>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{b.clientEmail}</td>
                      <td>{b.clientAge}</td>
                      <td>{b.consultant || b.consultantName}</td>
                      <td>{b.date}</td>
                      <td>{b.time}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{b.issue || b.note || '—'}</td>
                      <td>
                        <button 
                          className="complete-btn" 
                          onClick={() => handleMarkDone(b.bookingId || b.id)}
                        >
                          Mark Done
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'completed' && (
        <div id="adminCompleted" className="fade-in" style={{ paddingBottom: '48px' }}>
          <div className="page-header">
            <h2>Completed Sessions</h2>
            <p>Archive of finished consultations</p>
          </div>
          <div className="admin-table" style={{ marginTop: '24px' }}>
            {loading ? (
              <div className="empty-state">
                <div className="big">⏳</div>
                <p>Loading completed sessions...</p>
              </div>
            ) : completedSessions.length === 0 ? (
              <div className="empty-state">
                <div className="big">✅</div>
                <p>No completed sessions yet</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Consultant</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Issue</th>
                  </tr>
                </thead>
                <tbody>
                  {completedSessions.map((b, i) => (
                    <tr key={b.bookingId || b.id || i}>
                      <td>
                        <strong>{b.clientName}</strong>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{b.clientEmail}</td>
                      <td>{b.clientAge}</td>
                      <td>{b.consultant || b.consultantName}</td>
                      <td>{b.date}</td>
                      <td>{b.time}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{b.issue || b.note || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'blog' && (
        <div id="adminBlog" className="fade-in" style={{ paddingBottom: '64px' }}>
          <div className="page-header">
            <h2>The Clarity Space Blog Management</h2>
            <p>Write, update, and manage wellness articles for your clients</p>
          </div>

          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: '1.2fr 1fr', 
              gap: '32px', 
              padding: '24px 48px', 
              maxWidth: '1100px', 
              margin: '0 auto', 
              width: '100%' 
            }}
          >
            {/* LEFT COLUMN: ARTICLES LIST */}
            <div style={{ background: 'var(--white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: '#4a1f78', marginBottom: '16px', fontWeight: '500' }}>
                Published Articles
              </h3>

              {(db.blogs || []).length === 0 ? (
                <div className="empty-state" style={{ padding: '32px 0' }}>
                  <div className="big">📝</div>
                  <p>No blog articles published yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(db.blogs || []).map((blog) => (
                    <div 
                      key={blog.id} 
                      style={{ 
                        padding: '16px', 
                        borderRadius: '12px', 
                        border: '1px solid var(--border)', 
                        background: '#fcfbfd',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '18px' }}>{blog.icon || '🌿'}</span>
                          <strong style={{ fontSize: '14.5px', color: 'var(--text)' }}>{blog.title}</strong>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '4px' }}>
                          {blog.specialty} • By {blog.author} • {blog.date}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <button 
                          className="complete-btn" 
                          onClick={() => handleEditBlog(blog)}
                          style={{ padding: '6px 10px', fontSize: '12px' }}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="complete-btn" 
                          onClick={() => handleDeleteBlog(blog.id)}
                          style={{ padding: '6px 10px', fontSize: '12px', background: '#ffebee', color: '#c62828' }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: PUBLISHING FORM */}
            <div 
              id="blogFormContainer"
              style={{ 
                background: 'var(--white)', 
                padding: '24px', 
                borderRadius: '16px', 
                border: '1px solid var(--border)',
                textAlign: 'left'
              }}
            >
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: '#4a1f78', marginBottom: '20px', fontWeight: '500' }}>
                {isEditingBlog ? '✏️ Edit Article' : '✍️ Write New Article'}
              </h3>

              <form onSubmit={handleBlogSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>ARTICLE TITLE</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Navigating Relationship Struggles" 
                    value={blogTitle} 
                    onChange={(e) => setBlogTitle(e.target.value)}
                    style={{ padding: '11px', borderRadius: '8px', border: '1.5px solid var(--border)', outline: 'none' }}
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>CATEGORY / SPECIALTY</label>
                    <input 
                      type="text" 
                      placeholder="e.g. CBT &amp; Stress" 
                      value={blogSpecialty} 
                      onChange={(e) => setBlogSpecialty(e.target.value)}
                      style={{ padding: '11px', borderRadius: '8px', border: '1.5px solid var(--border)', outline: 'none' }}
                      required 
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>AUTHOR NAME</label>
                    <select 
                      value={blogAuthor} 
                      onChange={(e) => setBlogAuthor(e.target.value)}
                      style={{ padding: '11px', borderRadius: '8px', border: '1.5px solid var(--border)', outline: 'none', background: 'white' }}
                      required 
                    >
                      <option value="">Select Consultant...</option>
                      <option value="Harishmitha CB">Harishmitha CB</option>
                      <option value="Subiksha Varsa E">Subiksha Varsa E</option>
                      <option value="Koushika P">Koushika P</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>SELECT EMOJI / ICON</label>
                  <select 
                    value={blogIcon} 
                    onChange={(e) => setBlogIcon(e.target.value)}
                    style={{ padding: '11px', borderRadius: '8px', border: '1.5px solid var(--border)', outline: 'none', background: 'white' }}
                  >
                    <option value="🌿">🌿 Mind / Peace</option>
                    <option value="🧠">🧠 CBT / Thoughts</option>
                    <option value="❤️">❤️ Love / Relationships</option>
                    <option value="🧘">🧘 Mindfulness / Meditation</option>
                    <option value="🧭">🧭 Guidance / Compass</option>
                    <option value="🧍">🧍 Individual / Personal</option>
                    <option value="🌱">🌱 Growth / Development</option>
                    <option value="📝">📝 Note / Reflection</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>ARTICLE CONTENT</label>
                  <textarea 
                    rows="8"
                    placeholder="Write your article details here. Use double-newlines to split paragraphs, and use **bold** to highlight key notes." 
                    value={blogContent} 
                    onChange={(e) => setBlogContent(e.target.value)}
                    style={{ 
                      padding: '11px', 
                      borderRadius: '8px', 
                      border: '1.5px solid var(--border)', 
                      outline: 'none', 
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '13.5px',
                      resize: 'vertical',
                      lineHeight: '1.6'
                    }}
                    required 
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <button 
                    type="submit" 
                    className="btn-select" 
                    style={{ padding: '12px', flex: 1 }}
                  >
                    {isEditingBlog ? 'Save Changes ✓' : 'Publish Article 🚀'}
                  </button>
                  {isEditingBlog && (
                    <button 
                      type="button" 
                      onClick={handleCancelBlogEdit}
                      className="complete-btn" 
                      style={{ padding: '12px 18px', background: '#e0e0e0', color: '#616161', borderRadius: '10px' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
