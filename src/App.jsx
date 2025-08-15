import { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="container py-4">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Itemizer-Vibe</span>
        </div>
      </nav>

      <h1 className="mb-4">Inventory App</h1>
      <p>This is the main app logic.</p>
    </div>
  );
}

export default App;
