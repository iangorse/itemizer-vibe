import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import InventoryPage from './InventoryPage';
import ProductLookupPage from './ProductLookupPage';
import { getInventory, addInventoryItem, removeInventoryItem, getProductLookup, setProductLookupItem, removeProductLookupItem } from '../utils/db';

function AppRouter() {
  const [inventory, setInventory] = useState([]);
  const [mode, setMode] = useState('in');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [productLookup, setProductLookup] = useState({});
  const [lookupBarcode, setLookupBarcode] = useState('');
  const [lookupName, setLookupName] = useState('');
  const [lookupExpiry, setLookupExpiry] = useState('');
  const barcodeInputRef = useRef(null);

  // Load inventory and productLookup from IndexedDB on mount
  useEffect(() => {
    getInventory().then(items => setInventory(items));
    getProductLookup().then(lookups => {
      // Convert array to object keyed by barcode
      const lookupObj = {};
      lookups.forEach(item => { lookupObj[item.barcode] = item; });
      setProductLookup(lookupObj);
    });
  }, []);

  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [mode]);

  const handleBarcodeSubmit = async (e) => {
    e.preventDefault();
    const barcode = barcodeInput.trim();
    if (!barcode) return;
    if (mode === 'in') {
      const item = { barcode, bookedIn: new Date() };
      await addInventoryItem(item);
      const items = await getInventory();
      setInventory(items);
    } else {
      // Remove first matching item (FIFO)
      const items = await getInventory();
      const idx = items.findIndex(item => item.barcode === barcode);
      if (idx !== -1) {
        await removeInventoryItem(items[idx].id);
        const updated = await getInventory();
        setInventory(updated);
      } else {
        setInventory(items); // No change
      }
    }
    setBarcodeInput('');
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  };

  const handleLookupSubmit = async (e) => {
    e.preventDefault();
    const barcode = lookupBarcode.trim();
    const name = lookupName.trim();
    const expiryDate = lookupExpiry;
    if (!barcode || !name || !expiryDate) return;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.setHours(0,0,0,0);
    const expiryDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const item = { barcode, name, expiryDays };
    await setProductLookupItem(item);
    const lookups = await getProductLookup();
    const lookupObj = {};
    lookups.forEach(i => { lookupObj[i.barcode] = i; });
    setProductLookup(lookupObj);
    setLookupBarcode('');
    setLookupName('');
    setLookupExpiry('');
  };

  return (
    <Router basename="/itemizer-vibe">
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
                setInventory={setInventory}
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
                setProductLookup={setProductLookup}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default AppRouter;
