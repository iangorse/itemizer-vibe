import React, { useEffect, useState } from 'react';

function ProductLookupPage({
  productLookup,
  lookupBarcode,
  setLookupBarcode,
  lookupName,
  setLookupName,
  lookupExpiry,
  setLookupExpiry,
  handleLookupSubmit,
  setProductLookup
}) {
  const [editBarcode, setEditBarcode] = useState('');

  useEffect(() => {
    const prefillName = localStorage.getItem('lookupNamePrefill');
    if (prefillName) {
      setLookupName(prefillName);
      localStorage.removeItem('lookupNamePrefill');
    }
  }, []);

  const handleLookupExpiryChange = (e) => {
    setLookupExpiry(e.target.value);
  };

  const handleEdit = (barcode) => {
    setEditBarcode(barcode);
    setLookupBarcode(barcode);
    setLookupName(productLookup[barcode]?.name || '');
    setLookupExpiry('');
  };

  const handleDelete = (barcode) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProductLookup(prev => {
        const copy = { ...prev };
        delete copy[barcode];
        return copy;
      });
      if (editBarcode === barcode) {
        setEditBarcode('');
        setLookupBarcode('');
        setLookupName('');
        setLookupExpiry('');
      }
    }
  };

  return (
    <div className="container-fluid px-2 py-2" style={{ maxWidth: 480, margin: '0 auto' }}>
      <h2 className="mb-3 text-center" style={{ fontSize: '1.2rem' }}>Product Lookup</h2>
      <form onSubmit={handleLookupSubmit} className="mb-4" style={{ background: '#f8f9fa', borderRadius: 8, padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div className="mb-3">
          <label className="form-label mb-1" htmlFor="lookup-barcode">Barcode</label>
          <input
            id="lookup-barcode"
            type="text"
            value={lookupBarcode}
            onChange={e => setLookupBarcode(e.target.value)}
            className="form-control"
            style={{ fontSize: '1rem' }}
            autoComplete="off"
          />
        </div>
        <div className="mb-3">
          <label className="form-label mb-1" htmlFor="lookup-name">Name</label>
          <input
            id="lookup-name"
            type="text"
            value={lookupName}
            onChange={e => setLookupName(e.target.value)}
            className="form-control"
            style={{ fontSize: '1rem' }}
            autoComplete="off"
          />
        </div>
        <div className="mb-3">
          <label className="form-label mb-1" htmlFor="lookup-expiry">Expiry Date</label>
          <input
            id="lookup-expiry"
            type="date"
            value={lookupExpiry}
            onChange={handleLookupExpiryChange}
            className="form-control"
            style={{ fontSize: '1rem' }}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" style={{ fontSize: '1.05rem', padding: '0.6rem 0' }}>Assign Name & Expiry</button>
      </form>
      <h3 className="mb-2 text-center" style={{ fontSize: '1.1rem' }}>Product List</h3>
      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '0.5rem' }}>
        {Object.entries(productLookup).length === 0 ? (
          <div className="text-center text-muted py-3">No products added yet.</div>
        ) : (
          <ul className="list-group" style={{ fontSize: '0.98rem' }}>
            {Object.entries(productLookup).map(([barcode, info]) => (
              <li key={barcode} className="list-group-item d-flex flex-column align-items-start py-2 px-2 mb-2" style={{ borderRadius: 6 }}>
                <div style={{ wordBreak: 'break-word', fontWeight: 500 }}>{info.name || '-'}</div>
                <div className="text-muted" style={{ fontSize: '0.95em', wordBreak: 'break-word' }}>Barcode: {barcode}</div>
                <div className="text-muted" style={{ fontSize: '0.95em' }}>Expiry (days): {info.expiryDays || '-'}</div>
                <div className="d-flex gap-2 mt-2 w-100">
                  <button className="btn btn-outline-secondary btn-sm flex-fill" style={{ minWidth: 0, fontSize: '0.97em' }} onClick={() => handleEdit(barcode)}>Edit</button>
                  <button className="btn btn-outline-danger btn-sm flex-fill" style={{ minWidth: 0, fontSize: '0.97em' }} onClick={() => handleDelete(barcode)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProductLookupPage;
