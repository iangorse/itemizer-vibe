import React from 'react';

function ProductLookupPage({
  productLookup,
  lookupBarcode,
  setLookupBarcode,
  lookupName,
  setLookupName,
  lookupExpiry,
  setLookupExpiry,
  handleLookupSubmit
}) {
  const handleLookupExpiryChange = (e) => {
    setLookupExpiry(e.target.value);
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
          </tr>
        </thead>
        <tbody>
          {Object.entries(productLookup).map(([barcode, info]) => (
            <tr key={barcode}>
              <td>{barcode}</td>
              <td>{info.name}</td>
              <td>{info.expiryDays}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default ProductLookupPage;
