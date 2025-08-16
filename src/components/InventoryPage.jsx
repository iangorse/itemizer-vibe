import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  return (
    <>
      {mode === 'in' ? (
        <div className="alert alert-success text-center fw-bold" role="alert">
          Booking In Mode
        </div>
      ) : (
        <div className="alert alert-danger text-center fw-bold" role="alert">
          Booking Out Mode
        </div>
      )}

      <div className="mb-3">
        <button className={`btn btn-success me-2${mode === 'in' ? ' active' : ''}`} onClick={() => { setMode('in'); if (barcodeInputRef.current) barcodeInputRef.current.focus(); }}>Book In</button>
        <button className={`btn btn-danger${mode === 'out' ? ' active' : ''}`} onClick={() => { setMode('out'); if (barcodeInputRef.current) barcodeInputRef.current.focus(); }}>Book Out</button>
      </div>
      <form onSubmit={handleBarcodeSubmit} className="mb-4 row justify-content-center g-2 align-items-center">
        <div className="col-auto">
          <label className="form-label mb-0">Scan or Enter Barcode:</label>
        </div>
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
      </form>

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
                <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <span>{info?.name || item.barcode}</span>
                    <span className="ms-2 text-muted" style={{ fontSize: '0.9em' }}>
                      Booked In: {new Date(item.bookedIn).toLocaleString()}
                    </span>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="badge bg-warning text-dark me-2">Days Remaining: {daysRemaining === Number.POSITIVE_INFINITY ? '-' : daysRemaining}</span>
                    <button className="btn btn-outline-danger btn-sm" title="Remove item" onClick={() => {
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
          <h2>Inventory Summary</h2>
          <table className="table table-bordered table-striped mt-3">
            <thead className="table-light">
              <tr>
                <th>Item Name</th>
                <th>Barcode</th>
                <th>Count</th>
                <th></th>
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
                  <td>{productLookup[barcode]?.name || '-'}</td>
                  <td>{barcode}</td>
                  <td>{count}</td>
                  <td>
                    {!productLookup[barcode] && (
                      <>
                        <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleLookupBarcode(barcode)} disabled={loadingBarcode === barcode}>
                          {loadingBarcode === barcode ? 'Looking up...' : 'Lookup Barcode'}
                        </button>
                        <button className="btn btn-outline-primary btn-sm" onClick={() => {
                          setLookupBarcode(barcode);
                          navigate('/lookup');
                        }}>
                          Add to Product Lookup
                        </button>
                        {lookupResult.barcode === barcode && (
                          <div className="mt-2">
                            {lookupResult.found ? (
                              <span className="text-success">Found: {lookupResult.name} {lookupResult.brand && `(${lookupResult.brand})`}</span>
                            ) : (
                              <span className="text-danger">No product found</span>
                            )}
                          </div>
                        )}
                        {lookupResult.barcode === barcode && lookupResult.found && (
                          <button className="btn btn-outline-success btn-sm mt-2" onClick={() => {
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
                      </>
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
