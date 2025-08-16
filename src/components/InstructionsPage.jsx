import React from 'react';

function InstructionsPage() {
  return (
    <div className="container py-3" style={{ maxWidth: 480, margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '1.2rem' }}>How to Use Itemizer-Vibe</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <section style={{ background: '#f8f9fa', borderRadius: 12, padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.6rem' }}>Booking In Products</h3>
          <ul style={{ paddingLeft: 18, marginBottom: 0 }}>
            <li>Tap <b>Booking In</b> in the navigation bar.</li>
            <li>Scan a product barcode using your camera, or enter it manually.</li>
            <li>Item is added to your inventory with the booking date.</li>
            <li>If the barcode matches a product in your lookup, its name and expiry are shown.</li>
          </ul>
        </section>

        <section style={{ background: '#f8f9fa', borderRadius: 12, padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.6rem' }}>Booking Out Products (FIFO)</h3>
          <ul style={{ paddingLeft: 18, marginBottom: 0 }}>
            <li>Tap <b>Booking Out</b> in the navigation bar.</li>
            <li>Scan or enter the barcode of the item to remove.</li>
            <li>FIFO: The oldest matching item is removed first.</li>
            <li>If no match is found, you’ll see a message and inventory remains unchanged.</li>
          </ul>
        </section>

        <section style={{ background: '#f8f9fa', borderRadius: 12, padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.6rem' }}>Product Lookup & API Integration</h3>
          <ul style={{ paddingLeft: 18, marginBottom: 0 }}>
            <li>Go to <b>Product Lookup</b> to assign names and expiry dates to barcodes.</li>
            <li>Enter barcode, name, and expiry manually, or use the lookup button for auto-fill from Open Food Facts API.</li>
            <li>Products in lookup display their name and expiry when booked in/out.</li>
          </ul>
        </section>

        <section style={{ background: '#f8f9fa', borderRadius: 12, padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.6rem' }}>Expiry Tracking</h3>
          <ul style={{ paddingLeft: 18, marginBottom: 0 }}>
            <li>Assign expiry dates to products in lookup.</li>
            <li>Inventory items show days remaining until expiry.</li>
            <li>Expired items are highlighted for easy identification.</li>
          </ul>
        </section>

        <section style={{ background: '#f8f9fa', borderRadius: 12, padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.6rem' }}>Mobile Camera Scanning</h3>
          <ul style={{ paddingLeft: 18, marginBottom: 0 }}>
            <li>Tap the scan button to use your device camera for barcode input.</li>
            <li>Grant camera permissions if prompted.</li>
            <li>Works best in Chrome, Firefox, or Safari with HTTPS enabled.</li>
          </ul>
        </section>

        <section style={{ background: '#f8f9fa', borderRadius: 12, padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.6rem' }}>Inventory List & Lookup Integration</h3>
          <ul style={{ paddingLeft: 18, marginBottom: 0 }}>
            <li>If expiry info is missing for an item, a <b>Lookup</b> button appears instead of "Days Remaining".</li>
            <li>Click <b>Lookup</b> to fetch product info from Open Food Facts and view a popup dialog.</li>
            <li>The popup dialog shows product name, brand, barcode, and <b>ingredients</b> (if available).</li>
            <li>You can auto-fill the lookup form from the dialog.</li>
            <li>The dialog appears even if the inventory summary is closed.</li>
          </ul>
        </section>

        <section style={{ background: '#f8f9fa', borderRadius: 12, padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.6rem' }}>Other Features</h3>
          <ul style={{ paddingLeft: 18, marginBottom: 0 }}>
            <li>Edit or remove items from inventory and product lookup at any time.</li>
            <li>View a summary of all products, counts, and quick actions. <b>The Add button is now removed; add via the popup dialog instead.</b></li>
            <li>All data is stored locally in your browser—no cloud or server required.</li>
          </ul>
        </section>
      </div>

      <p style={{ fontSize: '0.95rem', textAlign: 'center', marginTop: '1.5rem', color: '#555' }}>
        If you have questions or need help, see the README or contact the project maintainer.
      </p>
    </div>
  );
}

export default InstructionsPage;
