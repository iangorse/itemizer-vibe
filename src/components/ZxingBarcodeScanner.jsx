import React, { useRef, useEffect, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

function ZxingBarcodeScanner({ onScan, onClose }) {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    codeReaderRef.current = new BrowserMultiFormatReader();
    codeReaderRef.current.decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
      if (!active) return;
      if (result) {
        onScan(result.getText());
        if (codeReaderRef.current && typeof codeReaderRef.current.reset === 'function') {
          codeReaderRef.current.reset();
        }
        onClose();
      }
    }).catch((err) => {
      setError('Unable to access camera. Please check permissions, use a supported browser, and try again.');
    });
    return () => {
      active = false;
      if (codeReaderRef.current && typeof codeReaderRef.current.reset === 'function') {
        codeReaderRef.current.reset();
      }
    };
  }, [onScan, onClose]);

  return (
    <div className="text-center">
      <video ref={videoRef} style={{ width: 300, height: 300, background: '#222' }} autoPlay playsInline />
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <button className="btn btn-secondary mt-3" onClick={() => {
        if (codeReaderRef.current && typeof codeReaderRef.current.reset === 'function') {
          codeReaderRef.current.reset();
        }
        onClose();
      }}>Close Scanner</button>
      <div className="mt-2 text-muted" style={{ fontSize: '0.9em' }}>
        If you see a blank screen, ensure camera permissions are granted.<br />
        <strong>How to fix:</strong><br />
        - Make sure you are using Chrome, Firefox, or Safari (not in-app browsers).<br />
        - If prompted, allow camera access.<br />
        - If not prompted, check your browser settings and enable camera permissions for this site.<br />
        <a href="https://support.google.com/chrome/answer/2693767" target="_blank" rel="noopener noreferrer">Help: Enable camera in Chrome</a><br />
        <a href="https://support.mozilla.org/en-US/kb/how-manage-your-camera-and-microphone-permissions" target="_blank" rel="noopener noreferrer">Help: Enable camera in Firefox</a><br />
        <a href="https://support.apple.com/en-gb/guide/safari/sfri40734/mac" target="_blank" rel="noopener noreferrer">Help: Enable camera in Safari</a>
      </div>
    </div>
  );
}

export default ZxingBarcodeScanner;
