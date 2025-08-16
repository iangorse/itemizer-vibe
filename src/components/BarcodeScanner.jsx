import React, { useRef, useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

function BarcodeScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const divId = 'barcode-scanner-div';
  const [error, setError] = useState('');

  useEffect(() => {
    const html5QrCode = new Html5Qrcode(divId);
    html5QrCode
      .start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 300, height: 300 },
        },
        (decodedText) => {
          onScan(decodedText);
          html5QrCode.stop().then(onClose);
        },
        (errorMessage) => {
          // Ignore scan errors
        }
      )
      .catch((err) => {
        setError('Unable to access camera. Please check permissions and try again.');
      });
    scannerRef.current = html5QrCode;
    return () => {
      html5QrCode.stop().catch(() => {});
      html5QrCode.clear();
    };
  }, [onScan, onClose]);

  return (
    <div className="text-center">
      <div
        id={divId}
        style={{
          width: 300,
          height: 300,
          margin: '0 auto',
          background: '#222',
        }}
      />
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <button
        className="btn btn-secondary mt-3"
        onClick={() => {
          if (scannerRef.current) {
            scannerRef.current.stop().then(onClose);
          } else {
            onClose();
          }
        }}
      >
        Close Scanner
      </button>
    </div>
  );
}

export default BarcodeScanner;
