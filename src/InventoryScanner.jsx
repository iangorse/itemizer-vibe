import { BrowserMultiFormatReader } from '@zxing/browser';
import { useEffect, useRef } from 'react';

function InventoryScanner({ onScan, mode }) {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();
    codeReaderRef.current.decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
      if (result) {
        onScan(result.getText());
      }
    });
    return () => {
      codeReaderRef.current.reset();
    };
  }, [onScan, mode]);

  return (
    <div>
      <h3>Scan Barcode ({mode === 'in' ? 'Book In' : 'Book Out'})</h3>
      <video ref={videoRef} style={{ width: '300px', border: '1px solid #ccc' }} />
    </div>
  );
}

export default InventoryScanner;
