import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary" style={{ marginBottom: 0, minHeight: '44px', padding: '0.2rem 0' }}>
      <div className="container-fluid" style={{ padding: '0 0.5rem' }}>
        <span className="navbar-brand mb-0 h1" style={{ fontSize: '1.1rem', padding: 0 }}>Itemizer-Vibe</span>
        <div className="navbar-nav" style={{ gap: '0.5rem' }}>
          <Link
            to="/"
            className={`nav-link${location.pathname === '/' ? ' active' : ''}`}
            style={{ fontSize: '1rem', padding: '0.2rem 0.5rem' }}
          >
            Booking
          </Link>
          <Link
            to="/lookup"
            className={`nav-link${location.pathname === '/lookup' ? ' active' : ''}`}
            style={{ fontSize: '1rem', padding: '0.2rem 0.5rem' }}
          >
            Product Lookup
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
