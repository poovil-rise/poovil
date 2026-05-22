import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const Blog = () => {
  const { db } = useApp();
  const blogsList = db.blogs || [];
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Close modal on escape keypress
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedBlog(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const parseBold = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: 'var(--sage-dark)', fontWeight: '600' }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const parseMarkdown = (text) => {
    if (!text) return '';
    return text.split('\n\n').map((para, i) => {
      // Check if it's a list (either numbered or bulleted)
      if (para.startsWith('1. ') || para.startsWith('- ') || para.includes('\n1. ') || para.includes('\n- ')) {
        const items = para.split('\n').filter(item => item.trim() !== '');
        const isNumbered = items[0].match(/^\d+\./);
        
        if (isNumbered) {
          return (
            <ol key={i} className="blog-list">
              {items.map((item, j) => {
                const cleanItem = item.replace(/^\d+\.\s*/, '');
                return <li key={j}>{parseBold(cleanItem)}</li>;
              })}
            </ol>
          );
        } else {
          return (
            <ul key={i} className="blog-list">
              {items.map((item, j) => {
                const cleanItem = item.replace(/^-\s*/, '');
                return <li key={j}>{parseBold(cleanItem)}</li>;
              })}
            </ul>
          );
        }
      }
      return <p key={i} className="blog-paragraph">{parseBold(para)}</p>;
    });
  };

  return (
    <div id="blogSection" className="fade-in" style={{ paddingBottom: '64px' }}>
      {/* HERO BANNER - Styled exactly like Services */}
      <div className="services-hero">
        <img id="footerLogoImg" src="/assets/image_2.png" alt="Poovil" />
        <div>
          <h2>The Clarity <em>Space</em></h2>
          <p className="hero-subtitle">Calming thoughts, therapeutic insights, and resources for your wellness journey!!</p>
        </div>
      </div>

      <div className="services-intro">
        <h3>Mental Health &amp; Clarity Articles</h3>
        <p>Explore articles written by our expert consultants to support your mental and emotional growth</p>
      </div>

      {/* ARTICLES GRID */}
      {blogsList.length === 0 ? (
        <div className="empty-state" style={{ margin: '40px auto', maxWidth: '600px' }}>
          <div className="big">📝</div>
          <p>The Clarity Space is currently preparing new articles. Check back soon!</p>
        </div>
      ) : (
        <div className="services-grid" style={{ marginTop: '20px' }}>
          {blogsList.map((blog) => (
            <div 
              className="service-card blog-card-interactive" 
              key={blog.id}
              onClick={() => setSelectedBlog(blog)}
              style={{ cursor: 'pointer' }}
            >
              <div className="svc-icon" style={{ fontSize: '24px' }}>{blog.icon || '📝'}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="blog-category-badge">{blog.specialty}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>{blog.date}</span>
              </div>
              <h4 style={{ margin: '8px 0', fontSize: '20px', lineHeight: '1.4', color: '#4a1f78' }}>
                {blog.title}
              </h4>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                {blog.content.length > 120 ? blog.content.substring(0, 120) + '...' : blog.content}
              </p>
              <div 
                className="blog-read-more" 
                style={{ 
                  fontWeight: '600', 
                  fontSize: '13px', 
                  color: '#6b4490', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px' 
                }}
              >
                Read Article <span style={{ transition: 'transform 0.2s' }}>→</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* READING OVERLAY MODAL */}
      {selectedBlog && (
        <div 
          className="blog-modal-overlay" 
          onClick={() => setSelectedBlog(null)}
        >
          <div 
            className="blog-modal-content" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="blog-modal-close" 
              onClick={() => setSelectedBlog(null)}
              title="Close Article"
            >
              ✕
            </button>
            <div className="blog-modal-header">
              <span className="blog-category-badge">{selectedBlog.specialty}</span>
              <span className="blog-modal-date">{selectedBlog.date}</span>
            </div>
            
            <div className="blog-modal-title-area">
              <div className="blog-modal-icon">{selectedBlog.icon || '📝'}</div>
              <h2 className="blog-modal-title">{selectedBlog.title}</h2>
            </div>
            
            <div className="blog-modal-author">
              <span style={{ color: 'var(--text-muted)' }}>Written by</span>{' '}
              <strong>{selectedBlog.author}</strong>
            </div>

            <div className="blog-modal-body">
              {parseMarkdown(selectedBlog.content)}
            </div>

            <div className="blog-modal-footer">
              <button 
                className="btn-select" 
                onClick={() => setSelectedBlog(null)}
                style={{ maxWidth: '200px', margin: '0 auto' }}
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
