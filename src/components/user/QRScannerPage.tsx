import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, QrCode } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { GlassButton } from '@/components/glass';

export default function QRScannerPage() {
  const navigate = useNavigate();
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const handleScan = () => {
    // Simulate a scan
    setScanned(true);
    setScanResult('orbitpay:transfer:OP123456789');
  };

  const handleConfirm = () => {
    // Navigate to transfer with scanned data
    navigate('/app/transfer', { state: { scannedCode: scanResult } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-emerald-100">
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 text-emerald-800 rotate-180" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-emerald-800">Scan QR Code</h1>
            <p className="text-xs text-emerald-800/60">Scan to pay or receive</p>
          </div>
        </div>
      </div>

      {/* Scanner */}
      <div className="max-w-lg mx-auto px-5 py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-3xl overflow-hidden bg-black aspect-square"
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Scanning Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-4 border-emerald-400 rounded-3xl">
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-xl" />
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-xl" />
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-xl" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-xl" />
            </div>
          </div>

          {/* Scanning Line */}
          <motion.div
            animate={{ y: [0, 250, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
          />

          {/* Scanned Result */}
          {scanned && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-0 left-0 right-0 bg-emerald-500 p-4 text-white text-center"
            >
              <p className="text-sm font-medium">Code Scanned!</p>
              <p className="text-xs opacity-80 mt-1 font-mono">{scanResult}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Manual Entry */}
        <div className="mt-6 text-center">
          <button
            onClick={handleScan}
            className="px-6 py-3 bg-emerald-500 text-white rounded-full font-medium shadow-lg shadow-emerald-500/30"
          >
            Simulate Scan
          </button>
        </div>

        {/* Scanned Data */}
        {scanned && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white rounded-2xl p-5 shadow-lg"
          >
            <h3 className="font-semibold text-emerald-800 mb-4">Payment Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-emerald-50 rounded-xl">
                <span className="text-sm text-emerald-800/60">Recipient</span>
                <span className="text-sm font-medium text-emerald-800">OrbitPay User</span>
              </div>
              <div className="flex justify-between p-3 bg-emerald-50 rounded-xl">
                <span className="text-sm text-emerald-800/60">Reference</span>
                <span className="text-sm font-medium text-emerald-800 font-mono">OP123456789</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-emerald-100 z-50">
        <div className="max-w-lg mx-auto px-5 py-4">
          <GlassButton
            className="w-full"
            disabled={!scanned}
            onClick={handleConfirm}
          >
            {scanned ? 'Confirm & Continue' : 'Scan QR Code First'}
          </GlassButton>
        </div>
      </div>
    </div>
  );
}
