  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarcodeScanner from './BarcodeScanner';
import { addInventoryItem, removeInventoryItem, getInventory } from '../utils/db';



function InventoryPage({
  inventory,
  productLookup,
  mode,
  setMode,
  barcodeInput,
  setBarcodeInput,
  setInventory,
  setLookupBarcode
}) {
  const navigate = useNavigate();
  const barcodeInputRef = useRef(null);
  const [lookupResult, setLookupResult] = useState({});
  const [loadingBarcode, setLoadingBarcode] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [mode]);

  const handleBarcodeInput = (e) => {
    setBarcodeInput(e.target.value);
  };

  const handleBarcodeSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const barcode = barcodeInput.trim();
    if (!barcode) return;
  // Removed control codes functionality
    if (mode === 'in') {
      await addInventoryItem({ barcode, bookedIn: new Date() });
      const items = await getInventory();
      setInventory(items);
      setBarcodeInput('');
      if (barcodeInputRef.current) barcodeInputRef.current.focus();
    } else {
      let playedErrorSound = false;
      const items = await getInventory();
      const idx = items.findIndex(item => item.barcode === barcode);
      if (idx === -1) {
        setErrorMsg('Error: Item not found in inventory.');
        // Play error sound
        if (!playedErrorSound) {
          try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = ctx.createOscillator();
            const gain = ctx.createGain();
            oscillator.type = 'square';
            oscillator.frequency.value = 220;
            gain.gain.value = 0.3;
            oscillator.connect(gain);
            gain.connect(ctx.destination);
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.25);
            oscillator.onended = () => ctx.close();
          } catch {}
          playedErrorSound = true;
        }
        setBarcodeInput('');
        if (barcodeInputRef.current) barcodeInputRef.current.focus();
        setInventory(items);
        return;
      }
      await removeInventoryItem(items[idx].id);
      const updated = await getInventory();
      setInventory(updated);
      setBarcodeInput('');
      if (barcodeInputRef.current) barcodeInputRef.current.focus();
    }
  };

  const handleLookupBarcode = async (barcode) => {
    setLoadingBarcode(barcode);
    setLookupResult({});
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await res.json();
      if (data.status === 1) {
        setLookupResult({ barcode, name: data.product.product_name || 'Unknown', brand: data.product.brands || '', found: true });
      } else {
        setLookupResult({ barcode, found: false });
      }
    } catch {
      setLookupResult({ barcode, found: false });
    }
    setLoadingBarcode(null);
  };

  const handleScanBarcode = (barcode) => {
    setBarcodeInput(barcode);
    setShowScanner(false);
    setTimeout(() => {
      document.getElementById('barcode-form')?.dispatchEvent(new Event('submit', { bubbles: true }));
    }, 100);
  };

  return (
  <div className="container-fluid px-0 py-2" style={{ maxWidth: 480, marginLeft: '0', marginRight: '0' }}>
  <div style={{ margin: 0, borderRadius: 0, position: 'relative', top: 0, zIndex: 900 }}>
        {mode === 'in' ? (
          <div
            className="alert alert-primary text-center fw-bold py-3 mb-0"
            role="alert"
            style={{ borderRadius: 8, fontSize: '1.15rem', letterSpacing: '1px', cursor: 'pointer', userSelect: 'none', marginBottom: '1.2rem' }}
            onClick={() => { setMode('out'); if (barcodeInputRef.current) barcodeInputRef.current.focus(); }}
            title="Tap to switch to Booking Out Mode"
          >
            Booking In Mode
            <div style={{ fontWeight: 400, fontSize: '0.95rem', color: '#333', opacity: 0.7, marginTop: 2 }}>Tap to change</div>
          </div>
        ) : (
          <div
            className="alert alert-warning text-center fw-bold py-3 mb-0"
            role="alert"
            style={{ borderRadius: 8, fontSize: '1.15rem', letterSpacing: '1px', cursor: 'pointer', userSelect: 'none', marginBottom: '1.2rem' }}
            onClick={() => { setMode('in'); if (barcodeInputRef.current) barcodeInputRef.current.focus(); }}
            title="Tap to switch to Booking In Mode"
          >
            Booking Out Mode
            <div style={{ fontWeight: 400, fontSize: '0.95rem', color: '#333', opacity: 0.7, marginTop: 2 }}>Tap to change</div>
          </div>
        )}
      </div>
  <form id="barcode-form" onSubmit={handleBarcodeSubmit} className="mb-4" style={{ background: '#f8f9fa', borderRadius: 8, padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
  <div className="mb-3">
          <label className="form-label mb-1">{isMobile ? 'Scan Barcode:' : 'Scan or Enter Barcode:'}</label>
          {!isMobile && (
            <input
              type="text"
              value={barcodeInput}
              onChange={handleBarcodeInput}
              className="form-control"
              autoFocus
              ref={barcodeInputRef}
              style={{ fontSize: '1rem' }}
            />
          )}
        </div>
        <div className="d-flex justify-content-center" style={{ marginTop: '1.2rem' }}>
          <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
            style={{ fontSize: '2.2rem', width: '4.2rem', height: '4.2rem', borderRadius: '50%' }}
            onClick={() => setShowScanner(true)}
            aria-label="Scan Barcode"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" fill="currentColor" viewBox="0 0 16 16">
              <rect x="1" y="2" width="1" height="12" rx="0.5"/>
              <rect x="3" y="2" width="2" height="12" rx="0.5"/>
              <rect x="6" y="2" width="1" height="12" rx="0.5"/>
              <rect x="8" y="2" width="2" height="12" rx="0.5"/>
              <rect x="11" y="2" width="1" height="12" rx="0.5"/>
              <rect x="13" y="2" width="1" height="12" rx="0.5"/>
            </svg>
          </button>
        </div>
      </form>
      {errorMsg && (
        <div className="alert alert-danger text-center mt-2" style={{ fontSize: '1rem' }}>{errorMsg}</div>
      )}
      {showScanner && (
        <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Scan Barcode</h5>
                <button type="button" className="btn-close" onClick={() => document.querySelector('.modal .btn-secondary')?.click()}></button>
              </div>
              <div className="modal-body">
                <BarcodeScanner onScan={handleScanBarcode} onClose={() => setShowScanner(false)} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '1rem', marginBottom: '1.2rem' }}>
        <h2 className="mb-3 text-center" style={{ fontSize: '1.1rem' }}>Current Inventory</h2>
        <ul className="list-group mb-2" style={{ fontSize: '0.98rem' }}>
          {inventory.length === 0 ? (
            <li className="list-group-item text-center text-muted py-3">No items booked in.</li>
          ) : (
            inventory
              .map((item, idx) => {
                const info = productLookup[item.barcode];
                let daysRemaining = Number.POSITIVE_INFINITY;
                if (info && typeof info.expiryDays === 'number') {
                  const bookedDate = new Date(item.bookedIn);
                  const today = new Date();
                  daysRemaining = info.expiryDays - Math.floor((today.setHours(0,0,0,0) - bookedDate.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
                }
                return { item, idx, info, daysRemaining };
              })
              .sort((a, b) => a.daysRemaining - b.daysRemaining)
              .map(({ item, idx, info, daysRemaining }) => (
                <li key={idx} className="list-group-item d-flex flex-column align-items-start py-2 px-2 mb-2" style={{ borderRadius: 6 }}>
                  <div style={{ wordBreak: 'break-word', fontWeight: 500 }}>{info?.name || item.barcode}</div>
                  <div className="text-muted" style={{ fontSize: '0.95em', wordBreak: 'break-word' }}>Booked In: {new Date(item.bookedIn).toLocaleString()}</div>
                  <div className="d-flex gap-2 mt-2 w-100">
                    <span className="badge bg-warning text-dark flex-fill d-flex align-items-center justify-content-center" style={{ height: '2.1em', fontSize: '1em' }}>
                      Days Remaining: {daysRemaining === Number.POSITIVE_INFINITY ? '-' : daysRemaining}
                    </span>
                    <button className="btn btn-outline-danger btn-sm flex-fill" style={{ minWidth: 0, fontSize: '0.97em' }} title="Remove item" onClick={async () => {
                      const itemName = info?.name || item.barcode;
                      if (window.confirm(`Are you sure you want to remove '${itemName}' from inventory?`)) {
                        await removeInventoryItem(item.id);
                        const updated = await getInventory();
                        setInventory(updated);
                      }
                    }}>Remove</button>
                  </div>
                </li>
              ))
          )}
        </ul>
      </div>
      <button
        type="button"
        style={{ width: '100%', padding: '0.8em', fontSize: '1.08em', borderRadius: '8px', background: '#bfa14a', color: '#23272f', fontWeight: 700, marginBottom: '1em', boxShadow: '0 2px 8px rgba(191,161,74,0.10)' }}
        onClick={() => setShowSummary(s => !s)}
        aria-expanded={showSummary}
        aria-controls="inventory-summary"
      >
        {showSummary ? 'Hide Inventory Summary' : 'Show Inventory Summary'}
      </button>
      {showSummary && (
        <div id="inventory-summary" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '1rem' }}>
          <h2 className="mb-3 text-center" style={{ fontSize: '1.1rem' }}>Inventory Summary</h2>
          <table className="table table-bordered table-striped mb-0" style={{ fontSize: '0.95rem', tableLayout: 'fixed', width: '100%' }}>
            <thead className="table-light">
              <tr>
                <th style={{ width: '28%' }}>Item Name</th>
                <th style={{ width: '32%' }}>Barcode</th>
                <th style={{ width: '15%' }}>Qty</th>
                <th style={{ width: '25%' }}></th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(
                inventory.reduce((acc, item) => {
                  acc[item.barcode] = (acc[item.barcode] || 0) + 1;
                  return acc;
                }, {})
              ).map(([barcode, count]) => (
                <tr key={barcode}>
                  <td style={{ wordBreak: 'break-word' }}>{productLookup[barcode]?.name || '-'}</td>
                  <td style={{ wordBreak: 'break-word' }}>{barcode}</td>
                  <td>{count}</td>
                  <td>
                    {!productLookup[barcode] && (
                      <div className="d-flex flex-column gap-1">
                        <button className="btn btn-outline-primary btn-sm" style={{ minWidth: 0, padding: '2px 2px', fontSize: '0.88em', whiteSpace: 'nowrap' }} onClick={() => handleLookupBarcode(barcode)} disabled={loadingBarcode === barcode}>
                          {loadingBarcode === barcode ? 'Looking up...' : 'Lookup'}
                        </button>
                        <button className="btn btn-outline-primary btn-sm" style={{ minWidth: 0, padding: '2px 2px', fontSize: '0.88em', whiteSpace: 'nowrap' }} onClick={() => {
                          setLookupBarcode(barcode);
                          navigate('/lookup');
                        }}>
                          Add to Lookup
                        </button>
                        {lookupResult.barcode === barcode && (
                          <div className="mt-1 w-100" style={{ fontSize: '0.95em' }}>
                            {lookupResult.found ? (
                              <span className="text-success">Found: {lookupResult.name} {lookupResult.brand && `(${lookupResult.brand})`}</span>
                            ) : (
                              <span className="text-danger">No product found</span>
                            )}
                          </div>
                        )}
                        {lookupResult.barcode === barcode && lookupResult.found && (
                          <button className="btn btn-outline-success btn-sm mt-1 w-100" style={{ minWidth: 0, padding: '2px 6px', fontSize: '0.95em' }} onClick={() => {
                            setLookupBarcode(barcode);
                            setTimeout(() => {
                              // Use setTimeout to ensure navigation happens after state update
                              navigate('/lookup');
                            }, 0);
                            // Store product name in localStorage for ProductLookupPage to use
                            localStorage.setItem('lookupNamePrefill', lookupResult.name);
                          }}>
                            Auto-Fill Lookup Form
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default InventoryPage;
