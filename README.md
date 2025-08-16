# ⚡️ This entire application was vibe coded as an experiment to see how it works. There may be errors or quirks due to this approach.

# Itemizer-Vibe

Itemizer-Vibe is a modern inventory management web application designed for fast barcode-based booking in and out of items. It is optimized for mobile and desktop, supports product lookup, expiry tracking, and uses IndexedDB for persistent storage. The UI is built with React and Tailwind CSS for a beautiful, responsive experience.
> **Note:** The application must be run using **HTTPS**; camera access will not work on HTTP due to browser security restrictions.

## Features


## How to Use

### 1. Booking In Items
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
- IndexedDB (via idb)
- Open Food Facts API

## Notes
- All data is stored locally in your browser. No cloud or server required.
- Works best in Chrome, Firefox, or Safari with camera access enabled.

## License
MIT
- For best results, use Chrome, Firefox, or Safari and allow camera access.
- Mobile browsers are fully supported.
