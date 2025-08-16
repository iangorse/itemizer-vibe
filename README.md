# Itemizer-Vibe

## Description

Itemizer-Vibe is a barcode-based inventory management application built with React and Vite. It allows you to book items in and out of inventory by scanning their barcodes using your device's camera or by manual entry. The app supports FIFO booking out, product lookup with expiry tracking, persistent storage, and a mobile-friendly interface.

## Features
- Book items in and out by scanning or entering barcodes
- FIFO booking out (first-in, first-out)
- Product lookup: assign names and expiry dates to barcodes
- Lookup unknown barcodes via Open Food Facts API
- Inventory summary and item count
- Manual item removal and editing
- Mobile camera barcode scanning (ZXing and html5-qrcode supported)
- Control codes to switch between booking in/out
- Confirmation dialogs for destructive actions
- Responsive, mobile-optimized UI
- Data stored in browser localStorage

## How to Use

1. **Booking In/Out**
	- Use the main page to scan or enter a barcode.
	- Select "Booking In" or "Booking Out" mode (tap the mode banner to switch).
	- Scan a barcode with your camera (tap the scan button) or enter manually.
	- Booking In adds the item to inventory; Booking Out removes the oldest matching item.
	- If you try to book out an item that does not exist, an error message and sound will play.

2. **Product Lookup**
	- Go to the Product Lookup page to assign a name and expiry date to a barcode.
	- Fill in the barcode, name, and expiry date, then submit.
	- After assigning, you will be redirected to the main page.
	- You can edit or delete lookup entries from the list.

3. **Inventory Summary**
	- View all items currently booked in, with names, barcodes, and days remaining until expiry.
	- Remove items manually if needed.

4. **Barcode Scanning**
	- Tap the scan button to open the camera scanner.
	- Grant camera permissions if prompted.
	- Hold the barcode steady in front of the camera; scanning is automatic.

5. **Control Codes**
	- Enter "Book In" or "Book Out" in the barcode field to switch modes quickly.

## Setup & Development

1. Install dependencies:
	```sh
	npm install
	```
2. Start the development server:
	```sh
	npm run dev
	```
3. Open your browser to the local server URL (default: http://localhost:5173)

## Notes
- All data is stored locally in your browser and will persist between sessions.
- For best results, use Chrome, Firefox, or Safari and allow camera access.
- Mobile browsers are fully supported.
