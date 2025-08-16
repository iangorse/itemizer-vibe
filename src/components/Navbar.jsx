import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => setMenuOpen(open => !open);
  const handleClose = () => setMenuOpen(false);

  return (
    <nav className="navbar navbar-dark bg-primary" style={{ marginBottom: 0, minHeight: '44px', padding: '0.2rem 0' }}>
      <div className="container-fluid" style={{ padding: '0 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="navbar-brand mb-0 h1" style={{ fontSize: '1.1rem', padding: 0 }}>Itemizer-Vibe</span>
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
      <div
        className="navbar-nav"
        style={{
          position: 'absolute',
          top: '44px',
          left: 0,
          width: '100%',
          background: '#0d6efd',
          zIndex: 1000,
          display: menuOpen ? 'flex' : 'none',
          flexDirection: 'column',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          boxShadow: menuOpen ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
        }}
        onClick={handleClose}
      >
        <Link
          to="/"
          className={`nav-link${location.pathname === '/' ? ' active' : ''}`}
          style={{ fontSize: '1rem', padding: '0.5rem 0.5rem', color: '#fff' }}
        >
          Booking
        </Link>
        <Link
          to="/lookup"
          className={`nav-link${location.pathname === '/lookup' ? ' active' : ''}`}
          style={{ fontSize: '1rem', padding: '0.5rem 0.5rem', color: '#fff' }}
        >
          Product Lookup
        </Link>
        <Link
          to="/instructions"
          className={`nav-link${location.pathname === '/instructions' ? ' active' : ''}`}
          style={{ fontSize: '1rem', padding: '0.5rem 0.5rem', color: '#fff' }}
        >
          Instructions
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
