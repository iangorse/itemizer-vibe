import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [page, setPage] = useState('inventory'); // 'inventory' or 'lookup'
  const [inventory, setInventory] = useState([]);
  const [mode, setMode] = useState('in'); // 'in' for booking in, 'out' for booking out
  const [barcodeInput, setBarcodeInput] = useState('');
  const [productLookup, setProductLookup] = useState({}); // barcode -> { name, expiryDays }
  const [lookupBarcode, setLookupBarcode] = useState('');
  const [lookupName, setLookupName] = useState('');
  const [lookupExpiry, setLookupExpiry] = useState(''); // yyyy-mm-dd
  const barcodeInputRef = useRef(null);

  // Always focus the input on mount, after each submit, and when mode changes
  useEffect(() => {
    if (barcodeInputRef.current && page === 'inventory') {
      barcodeInputRef.current.focus();
    }
  }, [mode, page]);

  const handleBarcodeChange = (e) => {
    setBarcodeInput(e.target.value);
  };

  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    const barcode = barcodeInput.trim();
    if (!barcode) return;
    if (mode === 'in') {
      setInventory((prev) => [...prev, { barcode, bookedIn: new Date() }]);
    } else {
      // FIFO: remove the oldest entry for this barcode
      setInventory((prev) => {
        const idx = prev.findIndex(item => item.barcode === barcode);
        if (idx === -1) return prev;
        return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
      });
    }
    setBarcodeInput('');
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  };

  // Product lookup handlers
  const handleLookupBarcodeChange = (e) => {
    setLookupBarcode(e.target.value);
  };
  const handleLookupNameChange = (e) => {
    setLookupName(e.target.value);
  };
  const handleLookupExpiryChange = (e) => {
    setLookupExpiry(e.target.value);
  };
  const handleLookupSubmit = (e) => {
    e.preventDefault();
    const barcode = lookupBarcode.trim();
    const name = lookupName.trim();
    const expiryDate = lookupExpiry;
    if (!barcode || !name || !expiryDate) return;
    // Calculate days until expiry
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.setHours(0,0,0,0);
    const expiryDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setProductLookup(prev => ({ ...prev, [barcode]: { name, expiryDays } }));
    setLookupBarcode('');
    setLookupName('');
    setLookupExpiry('');
  };

  return (
    <div>
      <h1>Inventory App</h1>
      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => setPage('inventory')} disabled={page === 'inventory'}>Inventory</button>
        <button onClick={() => setPage('lookup')} disabled={page === 'lookup'} style={{ marginLeft: '10px' }}>Product Lookup</button>
      </nav>

      {page === 'inventory' && (
        <>
          <div>
            <button onClick={() => setMode('in')}>Book In</button>
            <button onClick={() => setMode('out')}>Book Out</button>
          </div>
          <form onSubmit={handleBarcodeSubmit} style={{ margin: '20px 0' }}>
            <label>
              Scan or Enter Barcode:
              <input
                type="text"
                value={barcodeInput}
                onChange={handleBarcodeChange}
                ref={barcodeInputRef}
                style={{ marginLeft: '10px', padding: '5px' }}
              />
            </label>
            <button type="submit" style={{ marginLeft: '10px' }}>
              {mode === 'in' ? 'Book In' : 'Book Out'}
            </button>
          </form>

          <h2>Current Inventory</h2>
          <ul>
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
                <li key={idx}>
                  {info?.name || item.barcode} (Days Remaining: {daysRemaining === Number.POSITIVE_INFINITY ? '-' : daysRemaining})
                </li>
              ))}
          </ul>

          <h2>Inventory Summary</h2>
          <table style={{ borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Item Name</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Barcode</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Count</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}></th>
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
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{productLookup[barcode]?.name || '-'}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{barcode}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{count}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {!productLookup[barcode] && (
                      <button onClick={() => {
                        setPage('lookup');
                        setLookupBarcode(barcode);
                      }}>
                        Add to Product Lookup
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {page === 'lookup' && (
        <>
          <h2>Product Lookup</h2>
          <form onSubmit={handleLookupSubmit} style={{ marginBottom: '20px' }}>
            <label>
              Barcode:
              <input
                type="text"
                value={lookupBarcode}
                onChange={handleLookupBarcodeChange}
                style={{ marginLeft: '10px', padding: '5px' }}
              />
            </label>
            <label style={{ marginLeft: '10px' }}>
              Name:
              <input
                type="text"
                value={lookupName}
                onChange={handleLookupNameChange}
                style={{ marginLeft: '10px', padding: '5px' }}
              />
            </label>
            <label style={{ marginLeft: '10px' }}>
              Expiry Date:
              <input
                type="date"
                value={lookupExpiry}
                onChange={handleLookupExpiryChange}
                style={{ marginLeft: '10px', padding: '5px' }}
              />
            </label>
            <button type="submit" style={{ marginLeft: '10px' }}>Assign Name & Expiry</button>
          </form>

          <h3>Product List</h3>
          <table style={{ borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Barcode</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Name</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Expiry (days)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(productLookup).map(([barcode, info]) => (
                <tr key={barcode}>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{barcode}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{info.name}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{info.expiryDays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App
