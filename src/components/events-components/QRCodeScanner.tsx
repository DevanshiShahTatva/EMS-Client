"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface IQRCodeScannerPros {
  getScannedQRValues : (id : string) => void
}

const QRCodeScanner : React.FC<IQRCodeScannerPros> = ( { getScannedQRValues }) => {
  const [scanning, setScanning] = useState(false);
  const [ticket, setTicket] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup scanner when unmounting
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const startScanner = async () => {
    const qrRegionId = "qr-scanner";
    setScanning(true);
    setError(null);
    setTicket(null);

    try {
      html5QrCodeRef.current = new Html5Qrcode(qrRegionId);

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText, result) => {
          try {
            const parsed = JSON.parse(decodedText);
            setTicket(parsed);
            setScanning(false);
            getScannedQRValues(parsed?.id)
            // Stop scanning after a successful read
            html5QrCodeRef.current?.stop().catch(() => {});
          } catch (e) {
            setError("❌ Invalid QR Code Content");
          }
        },
        (scanError) => {
          console.warn("Scanning error:", scanError);
        }
      );
    } catch (err) {
      console.error("Camera error:", err);
      setError("Failed to access the camera. Please allow camera permissions.");
      setScanning(false);
    }
  };

  const stopScanner = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().catch(() => {});
    }
    setScanning(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <button
        onClick={scanning ? stopScanner : startScanner}
        className="text-lg font-semibold mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {scanning ? "Stop Scanner" : "Start Scanner"}
      </button>

      <div id="qr-scanner" ref={scannerRef} className="mx-auto mb-4" />

      {ticket && (
        <div className="mt-4 bg-green-100 p-3 rounded shadow">
          <p className="text-green-800 font-semibold">✅ Ticket Scanned</p>
          <p className="text-sm text-center">Please wait while validating</p>
        </div>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default QRCodeScanner;
