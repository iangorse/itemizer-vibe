# ⚡️ This entire application was vibe coded.

# Itemizer-Vibe

Itemizer-Vibe is a modern inventory management web application designed for fast barcode-based booking in and out of items. It is optimized for mobile and desktop, supports product lookup, expiry tracking, and uses IndexedDB for persistent storage. The UI is built with React and Tailwind CSS for a beautiful, responsive experience.

## Features
- **Barcode Booking:** Quickly book items in and out by scanning or entering barcodes.
- **Inventory List:** View all booked-in items, sorted by expiry or FIFO.
- **Product Lookup:** Assign names and expiry dates to barcodes, with auto-fill from Open Food Facts.
- **Expiry Tracking:** See days remaining for each item.
- **Mobile Camera Support:** Scan barcodes using your device camera.
- **Persistent Storage:** All data is saved locally in your browser (IndexedDB).
- **Manual Edit/Remove:** Edit product info or remove items from inventory.
- **Modern UI:** Responsive, mobile-first design using Tailwind CSS.

## How to Use

### 1. Booking In Items
- Go to the main page.
- Scan a barcode using your camera or enter it manually.
- The item is added to your inventory.

### 2. Booking Out Items
- Scan or enter the barcode of the item to book it out.
- The oldest matching item (FIFO) is removed from inventory.

### 3. Product Lookup
- Go to the Product Lookup page.
- Enter a barcode, name, and expiry date to assign info to a product.
- Use the lookup button to auto-fill product info from Open Food Facts.

### 4. Inventory Summary
- Click "Show Inventory Summary" to see a table of all products, counts, and quick actions for lookup and editing.

### 5. Mobile Camera Scanning
- Tap the scan button to use your device camera for barcode input.
- Grant camera permissions if prompted.

### 6. Editing & Removing
- Use the edit and delete buttons in Product Lookup and Inventory to update or remove items.

## Installation & Setup

1. **Install dependencies:**
	```sh
	npm install
	```
2. **Start the development server:**
	```sh
	npm run dev
	```
3. **Open in browser:**
	Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

## Technologies Used
- React
- Vite
- Tailwind CSS
- IndexedDB (via idb)
- Open Food Facts API

## Notes
- All data is stored locally in your browser. No cloud or server required.
- Works best in Chrome, Firefox, or Safari with camera access enabled.

## License
MIT
- For best results, use Chrome, Firefox, or Safari and allow camera access.
- Mobile browsers are fully supported.
