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
    <>
      <h2>Product Lookup</h2>
      <form onSubmit={handleLookupSubmit} className="row g-2 align-items-center mb-4">
        <div className="col-auto">
          <label className="form-label mb-0">Barcode:</label>
        </div>
        <div className="col-auto">
          <input
            type="text"
            value={lookupBarcode}
            onChange={e => setLookupBarcode(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-auto">
          <label className="form-label mb-0">Name:</label>
        </div>
        <div className="col-auto">
          <input
            type="text"
            value={lookupName}
            onChange={e => setLookupName(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-auto">
          <label className="form-label mb-0">Expiry Date:</label>
        </div>
        <div className="col-auto">
          <input
            type="date"
            value={lookupExpiry}
            onChange={handleLookupExpiryChange}
            className="form-control"
          />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-primary">Assign Name & Expiry</button>
        </div>
      </form>
      <h3>Product List</h3>
      <table className="table table-bordered table-striped mt-3">
        <thead className="table-light">
          <tr>
            <th>Barcode</th>
            <th>Name</th>
            <th>Expiry (days)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(productLookup).map(([barcode, info]) => (
            <tr key={barcode}>
              <td>{barcode}</td>
              <td>{info.name}</td>
              <td>{info.expiryDays}</td>
              <td>
                <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => handleEdit(barcode)}>Edit</button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(barcode)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default ProductLookupPage;
