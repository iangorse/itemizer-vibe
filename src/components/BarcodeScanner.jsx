import React, { useRef, useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

function BarcodeScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const divId = 'barcode-scanner-div';
  const [error, setError] = useState('');

  const runningRef = useRef(false);
  useEffect(() => {
    let html5QrCode = null;
    if (document.getElementById(divId)) {
      html5QrCode = new Html5Qrcode(divId);
      html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          if (runningRef.current) {
            // Play beep sound
            try {
              const ctx = new (window.AudioContext || window.webkitAudioContext)();
              const oscillator = ctx.createOscillator();
              const gain = ctx.createGain();
              oscillator.type = 'sine';
              oscillator.frequency.value = 880;
              gain.gain.value = 0.2;
              oscillator.connect(gain);
              gain.connect(ctx.destination);
              oscillator.start();
              oscillator.stop(ctx.currentTime + 0.15);
              oscillator.onended = () => ctx.close();
            } catch {}
            runningRef.current = false;
            html5QrCode.stop().then(() => {
              html5QrCode.clear();
              scannerRef.current = null;
              onScan(decodedText);
            });
          }
        },
        (errorMessage) => {
          // Ignore scan errors
        }
      ).then(() => {
        runningRef.current = true;
      }).catch((err) => {
        setError('Unable to access camera. Please check permissions and try again.');
      });
      scannerRef.current = html5QrCode;
    }
    return () => {
      if (scannerRef.current) {
        if (runningRef.current) {
          scannerRef.current.stop().catch(() => {});
        }
        scannerRef.current.clear();
        runningRef.current = false;
        scannerRef.current = null;
      }
      // Always clear the div
      const el = document.getElementById(divId);
      if (el) el.innerHTML = '';
    };
  }, [onScan, onClose]);

  return (
    <div className="text-center">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minHeight: '340px',
        }}
      >
        <div
          id={divId}
          style={{
            width: '400px',
            height: '300px',
            maxWidth: '100%',
            background: '#222',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        />
      </div>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <button
        className="btn btn-secondary mt-3"
        onClick={() => {
          if (scannerRef.current && runningRef.current) {
            runningRef.current = false;
            scannerRef.current.stop().then(() => {
              scannerRef.current.clear();
              scannerRef.current = null;
              onClose();
            });
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
