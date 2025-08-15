import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1">Itemizer-Vibe</span>
        <div className="navbar-nav">
          <Link
            to="/"
            className={`nav-link${location.pathname === '/' ? ' active' : ''}`}
          >
            Booking
          </Link>
          <Link
            to="/lookup"
            className={`nav-link${
              location.pathname === '/lookup' ? ' active' : ''
            }`}
          >
            Product Lookup
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
