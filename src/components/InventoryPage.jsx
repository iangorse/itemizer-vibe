import React from 'react';
import { useNavigate } from 'react-router-dom';

function InventoryPage({
  inventory,
  productLookup,
  mode,
  setMode,
  barcodeInput,
  setBarcodeInput,
  handleBarcodeSubmit,
  setLookupBarcode
}) {
  const navigate = useNavigate();
  return (
    <>
      <div className="mb-3">
        <button className={`btn btn-success me-2${mode === 'in' ? ' active' : ''}`} onClick={() => setMode('in')}>Book In</button>
        <button className={`btn btn-danger${mode === 'out' ? ' active' : ''}`} onClick={() => setMode('out')}>Book Out</button>
      </div>
      <form onSubmit={handleBarcodeSubmit} className="mb-4 row g-2 align-items-center">
        <div className="col-auto">
          <label className="form-label mb-0">Scan or Enter Barcode:</label>
        </div>
        <div className="col-auto">
          <input
            type="text"
            value={barcodeInput}
            onChange={e => setBarcodeInput(e.target.value)}
            className="form-control"
            autoFocus
          />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-primary">
            {mode === 'in' ? 'Book In' : 'Book Out'}
          </button>
        </div>
      </form>

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
              <span>{info?.name || item.barcode}</span>
              <span className="badge bg-warning text-dark">Days Remaining: {daysRemaining === Number.POSITIVE_INFINITY ? '-' : daysRemaining}</span>
            </li>
          ))}
      </ul>

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
                  <button className="btn btn-outline-primary btn-sm" onClick={() => {
                    setLookupBarcode(barcode);
                    navigate('/lookup');
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
  );
}

export default InventoryPage;
