  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarcodeScanner from './BarcodeScanner';

const CONTROL_CODES = {
  BOOK_IN: 'Book In',
  BOOK_OUT: 'Book Out',
};

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

  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [mode]);

  const handleBarcodeInput = (e) => {
    setBarcodeInput(e.target.value);
  };

  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    const barcode = barcodeInput.trim();
    if (!barcode) return;
    if (barcode === CONTROL_CODES.BOOK_IN) {
      setMode('in');
      setBarcodeInput('');
      if (barcodeInputRef.current) barcodeInputRef.current.focus();
      return;
    }
    if (barcode === CONTROL_CODES.BOOK_OUT) {
      setMode('out');
      setBarcodeInput('');
      if (barcodeInputRef.current) barcodeInputRef.current.focus();
      return;
    }
    if (mode === 'in') {
      setInventory(prev => [...prev, { barcode, bookedIn: new Date() }]);
      setBarcodeInput('');
      if (barcodeInputRef.current) barcodeInputRef.current.focus();
    } else {
      setInventory(prev => {
        const idx = prev.findIndex(item => item.barcode === barcode);
        if (idx === -1) return prev;
        return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
      });
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
    <>
      <div style={{ margin: 0, borderRadius: 0, position: 'relative', top: 0, zIndex: 1020 }}>
        {mode === 'in' ? (
          <div
            className="alert alert-primary text-center fw-bold py-3 mb-0"
            role="alert"
            style={{ borderRadius: 0, fontSize: '1.25rem', letterSpacing: '1px', cursor: 'pointer', userSelect: 'none' }}
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
            style={{ borderRadius: 0, fontSize: '1.25rem', letterSpacing: '1px', cursor: 'pointer', userSelect: 'none' }}
            onClick={() => { setMode('in'); if (barcodeInputRef.current) barcodeInputRef.current.focus(); }}
            title="Tap to switch to Booking In Mode"
          >
            Booking Out Mode
            <div style={{ fontWeight: 400, fontSize: '0.95rem', color: '#333', opacity: 0.7, marginTop: 2 }}>Tap to change</div>
          </div>
        )}
      </div>
      <form id="barcode-form" onSubmit={handleBarcodeSubmit} className="mb-4 row justify-content-center g-2 align-items-center">
        <div className="col-auto">
          <label className="form-label mb-0">{isMobile ? 'Scan Barcode:' : 'Scan or Enter Barcode:'}</label>
        </div>
        {!isMobile && (
          <>
            <div className="col-auto">
              <input
                type="text"
                value={barcodeInput}
                onChange={handleBarcodeInput}
                className="form-control"
                autoFocus
                ref={barcodeInputRef}
              />
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary">
                {mode === 'in' ? 'Book In' : 'Book Out'}
              </button>
            </div>
          </>
        )}
        <div className="col-auto" style={{ marginTop: '1.2rem' }}>
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

      <div className="row">
        <div className="col-md-6">
          <h2 className="mt-4">Current Inventory</h2>
          <ul className="list-group mb-4">
            {inventory
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
                <li key={idx} className="list-group-item" style={{ fontSize: '0.95em', padding: '8px 6px' }}>
                  <div style={{ wordBreak: 'break-word' }}>
                    <span style={{ fontWeight: 500 }}>{info?.name || item.barcode}</span>
                    <div className="text-muted" style={{ fontSize: '0.9em', wordBreak: 'break-word' }}>
                      Booked In: {new Date(item.bookedIn).toLocaleString()}
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-start mt-2 gap-1">
                    <span className="badge bg-warning text-dark mb-1">Days Remaining: {daysRemaining === Number.POSITIVE_INFINITY ? '-' : daysRemaining}</span>
                    <button className="btn btn-outline-danger btn-sm" style={{ padding: '2px 8px', fontSize: '0.95em', minWidth: 0 }} title="Remove item" onClick={() => {
                      setInventory(prev => prev.filter((_, i) => i !== idx));
                    }}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h2 style={{ fontSize: '1.1rem' }}>Inventory Summary</h2>
          <table className="table table-bordered table-striped mt-3 mb-0" style={{ fontSize: '0.95rem', tableLayout: 'fixed', width: '100%' }}>
            <thead className="table-light">
              <tr>
                <th style={{ width: '28%' }}>Item Name</th>
                <th style={{ width: '32%' }}>Barcode</th>
                <th style={{ width: '15%' }}>Count</th>
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
                        <button className="btn btn-outline-primary btn-sm" style={{ minWidth: 0, padding: '2px 6px', fontSize: '0.95em' }} onClick={() => handleLookupBarcode(barcode)} disabled={loadingBarcode === barcode}>
                          {loadingBarcode === barcode ? 'Looking up...' : 'Lookup Barcode'}
                        </button>
                        <button className="btn btn-outline-primary btn-sm" style={{ minWidth: 0, padding: '2px 6px', fontSize: '0.95em' }} onClick={() => {
                          setLookupBarcode(barcode);
                          navigate('/lookup');
                        }}>
                          Add to Product Lookup
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
      </div>
    </>
  );
}

export default InventoryPage;
