import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import InventoryPage from './InventoryPage';
import ProductLookupPage from './ProductLookupPage';

function getLocal(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function AppRouter() {
  const [inventory, setInventory] = useState(() => getLocal('inventory', []));
  const [mode, setMode] = useState('in');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [productLookup, setProductLookup] = useState(() => getLocal('productLookup', {}));
  const [lookupBarcode, setLookupBarcode] = useState('');
  const [lookupName, setLookupName] = useState('');
  const [lookupExpiry, setLookupExpiry] = useState('');
  const barcodeInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('productLookup', JSON.stringify(productLookup));
  }, [productLookup]);

  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [mode]);

  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    const barcode = barcodeInput.trim();
    if (!barcode) return;
    if (mode === 'in') {
      setInventory((prev) => [...prev, { barcode, bookedIn: new Date() }]);
    } else {
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

  const handleLookupSubmit = (e) => {
    e.preventDefault();
    const barcode = lookupBarcode.trim();
    const name = lookupName.trim();
    const expiryDate = lookupExpiry;
    if (!barcode || !name || !expiryDate) return;
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
    <Router>
      <Navbar />
      <div className="container py-4">
        <Routes>
          <Route
            path="/"
            element={
              <InventoryPage
                inventory={inventory}
                productLookup={productLookup}
                mode={mode}
                setMode={setMode}
                barcodeInput={barcodeInput}
                setBarcodeInput={setBarcodeInput}
                handleBarcodeSubmit={handleBarcodeSubmit}
                setLookupBarcode={setLookupBarcode}
              />
            }
          />
          <Route
            path="/lookup"
            element={
              <ProductLookupPage
                productLookup={productLookup}
                lookupBarcode={lookupBarcode}
                setLookupBarcode={setLookupBarcode}
                lookupName={lookupName}
                setLookupName={setLookupName}
                lookupExpiry={lookupExpiry}
                setLookupExpiry={setLookupExpiry}
                handleLookupSubmit={handleLookupSubmit}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default AppRouter;
