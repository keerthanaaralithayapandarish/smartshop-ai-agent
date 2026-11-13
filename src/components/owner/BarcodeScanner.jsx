import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Loader2, Upload, Sparkles } from 'lucide-react';

const FORMATS = [
  'EAN_13',
  'EAN_8',
  'UPC_A',
  'UPC_E',
  'CODE_128',
  'CODE_39',
  'QR_CODE',
];

export function BarcodeScanner({ onDetected }) {
  const [active, setActive] = useState(false);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);
  const [fileScanning, setFileScanning] = useState(false);
  const regionId = useRef(`owner-barcode-${Math.random().toString(36).slice(2, 8)}`);
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);
  const handledRef = useRef(false);
  const onDetectedRef = useRef(onDetected);
  onDetectedRef.current = onDetected;

  useEffect(() => {
    if (!active) return undefined;
    let cancelled = false;
    handledRef.current = false;
    setStarting(true);
    setError('');

    async function start() {
      try {
        const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode');
        if (cancelled) return;
        const formatsToSupport = FORMATS.map((name) => Html5QrcodeSupportedFormats[name]).filter(
          (value) => value !== undefined
        );
        const scanner = new Html5Qrcode(regionId.current, { formatsToSupport, verbose: false });
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 260, height: 140 } },
          (decodedText) => {
            if (handledRef.current) return;
            handledRef.current = true;
            const code = String(decodedText || '').trim();
            setActive(false);
            if (code) onDetectedRef.current(code);
          },
          () => {}
        );
        if (!cancelled) setStarting(false);
      } catch (err) {
        if (!cancelled) {
          setStarting(false);
          setActive(false);
          setError(err?.message || 'Camera unavailable. Upload an image or type the barcode instead.');
        }
      }
    }

    start();

    return () => {
      cancelled = true;
      const scanner = scannerRef.current;
      scannerRef.current = null;
      if (scanner && scanner.isScanning) {
        scanner.stop().then(() => scanner.clear()).catch(() => {});
      }
    };
  }, [active]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setFileScanning(true);

    try {
      const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode');
      const tempId = `temp-scan-${Date.now()}`;
      const tempDiv = document.createElement('div');
      tempDiv.id = tempId;
      tempDiv.style.display = 'none';
      document.body.appendChild(tempDiv);

      const formatsToSupport = FORMATS.map((name) => Html5QrcodeSupportedFormats[name]).filter(
        (value) => value !== undefined
      );
      const fileScanner = new Html5Qrcode(tempId, { formatsToSupport, verbose: false });
      const decodedText = await fileScanner.scanFile(file, false);

      fileScanner.clear();
      document.body.removeChild(tempDiv);

      const code = String(decodedText || '').trim();
      if (code) {
        onDetectedRef.current(code);
      } else {
        setError('Could not decode a valid barcode from the image.');
      }
    } catch (err) {
      setError(err?.message || 'Could not find a valid EAN-13, EAN-8, UPC-A, or UPC-E barcode in this image.');
    } finally {
      setFileScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActive((value) => !value)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          {active ? <CameraOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5 text-electric-600" />}
          <span>{active ? 'Stop camera' : 'Camera Scanner'}</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={fileScanning}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-60"
        >
          {fileScanning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 text-electric-600" />}
          <span>{fileScanning ? 'Decoding image...' : 'Upload Barcode Image'}</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        <span className="text-[10px] text-slate-400 font-medium">
          Supports EAN-13, EAN-8, UPC-A & UPC-E
        </span>
      </div>

      {active && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950">
          {starting && (
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Starting camera...
            </div>
          )}
          <div id={regionId.current} className="w-full" />
        </div>
      )}

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
}
