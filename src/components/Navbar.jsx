import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleToggle = () => setMenuOpen(open => !open);
  const handleClose = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <nav className="navbar navbar-dark bg-primary" style={{ marginBottom: 0, minHeight: '44px', padding: '0.2rem 0' }}>
      <div className="container-fluid" style={{ padding: '0 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <Link to="/" className="navbar-brand mb-0 h1" style={{ fontSize: '1.1rem', padding: 0, cursor: 'pointer', textDecoration: 'none', color: '#fff' }}>Itemizer-Vibe</Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          style={{ border: 'none', background: 'transparent', color: '#fff', fontSize: '1.5rem', padding: '0.2rem 0.5rem', display: 'flex', alignItems: 'center' }}
          onClick={handleToggle}
        >
          <span style={{ display: 'inline-block', width: 24, height: 24 }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </span>
        </button>
      </div>
      {menuOpen && (
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            top: '44px',
            right: '8px',
            minWidth: '180px',
            background: '#fff',
            borderRadius: '10px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            zIndex: 1000,
            padding: '0.5rem 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >
          <Link
            to="/"
            className={`nav-link${location.pathname === '/' ? ' active' : ''}`}
            style={{ fontSize: '1rem', padding: '0.7rem 1.2rem', color: '#222', textDecoration: 'none', borderBottom: '1px solid #eee' }}
            onClick={handleClose}
          >
            Booking
          </Link>
          <Link
            to="/lookup"
            className={`nav-link${location.pathname === '/lookup' ? ' active' : ''}`}
            style={{ fontSize: '1rem', padding: '0.7rem 1.2rem', color: '#222', textDecoration: 'none', borderBottom: '1px solid #eee' }}
            onClick={handleClose}
          >
            Product Lookup
          </Link>
          <Link
            to="/instructions"
            className={`nav-link${location.pathname === '/instructions' ? ' active' : ''}`}
            style={{ fontSize: '1rem', padding: '0.7rem 1.2rem', color: '#222', textDecoration: 'none' }}
            onClick={handleClose}
          >
            Instructions
          </Link>
          <div style={{ padding: '0.5em 1.2em', borderTop: '1px solid #eee' }}>
            <ThemeSwitcher />
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
