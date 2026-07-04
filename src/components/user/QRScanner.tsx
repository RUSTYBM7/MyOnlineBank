import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Camera, CameraOff, Flashlight, Image, RotateCw, Check, AlertCircle, QrCode } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QRScannerProps {
  onScan?: (data: string) => void
  onClose?: () => void
  isOpen?: boolean
}

export function QRScanner({ onScan, onClose, isOpen = true }: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [torchOn, setTorchOn] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setHasPermission(true)
        setIsScanning(true)
      }
    } catch (err) {
      console.error('Camera error:', err)
      setHasPermission(false)
      setError('Unable to access camera. Please check permissions.')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    setIsScanning(false)
    setTorchOn(false)
  }, [])

  const toggleTorch = useCallback(() => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0]
      if (track && 'getCapabilities' in track) {
        const capabilities = track.getCapabilities() as MediaTrackCapabilities & { torch?: boolean }
        if (capabilities.torch) {
          track.applyConstraints({
            advanced: [{ torch: !torchOn } as MediaTrackConstraintSet]
          } as MediaConstraints)
          setTorchOn(!torchOn)
        }
      }
    }
  }, [torchOn])

  // QR Code detection simulation
  const simulateScan = useCallback(() => {
    if (isScanning) {
      // Simulate QR code detection
      const mockQRData = `orbitpay://transfer?amount=100&to=account_123456&from=user_789&memo=Payment`
      setScannedData(mockQRData)
      setIsScanning(false)
      stopCamera()
      onScan?.(mockQRData)
    }
  }, [isScanning, stopCamera, onScan])

  useEffect(() => {
    if (isOpen) {
      startCamera()
    }
    return () => {
      stopCamera()
    }
  }, [isOpen, startCamera, stopCamera])

  const parseQRData = (data: string) => {
    try {
      if (data.startsWith('orbitpay://')) {
        const params = new URLSearchParams(data.replace('orbitpay://', ''))
        return {
          type: params.get('type') || 'transfer',
          amount: params.get('amount'),
          to: params.get('to'),
          from: params.get('from'),
          memo: params.get('memo')
        }
      }
      return { raw: data }
    } catch {
      return { raw: data }
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col"
    >
      {/* Header */}
      <div className="p-4 bg-black/50 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <QrCode className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Scan QR Code</h2>
            <p className="text-white/60 text-sm">Point camera at QR code</p>
          </div>
        </div>
        <button
          onClick={() => {
            stopCamera()
            onClose?.()
          }}
          className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Camera Feed */}
        {hasPermission ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Darkened corners */}
              <div className="absolute inset-0 bg-black/50" />
              {/* Scanning window */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
                <div className="absolute inset-0 border-2 border-emerald-400/50 rounded-2xl" />
                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />
                {/* Scanning line */}
                {isScanning && (
                  <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-white p-8">
            {error ? (
              <>
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={startCamera}
                  className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium"
                >
                  Try Again
                </button>
              </>
            ) : (
              <>
                <Camera className="w-16 h-16 mx-auto mb-4 text-white/40" />
                <p className="text-white/60">Starting camera...</p>
              </>
            )}
          </div>
        )}

        {/* Scanned Result */}
        {scannedData && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-x-4 bottom-24 bg-white rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">QR Code Scanned!</h3>
                <p className="text-sm text-gray-500">Data extracted successfully</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-xs text-gray-500 mb-2">Scanned Data</p>
              <p className="font-mono text-sm text-gray-700 break-all">{scannedData}</p>
            </div>

            {parseQRData(scannedData).type && (
              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-xs text-emerald-600 mb-2">Parsed Information</p>
                <div className="space-y-1 text-sm">
                  {parseQRData(scannedData).amount && (
                    <p><span className="text-gray-500">Amount:</span> ${parseQRData(scannedData).amount}</p>
                  )}
                  {parseQRData(scannedData).memo && (
                    <p><span className="text-gray-500">Memo:</span> {parseQRData(scannedData).memo}</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setScannedData(null)
                  startCamera()
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2"
              >
                <RotateCw className="w-4 h-4" />
                Scan Again
              </button>
              <button
                onClick={() => {
                  stopCamera()
                  onClose?.()
                }}
                className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-medium"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-black/50 backdrop-blur-sm flex items-center justify-center gap-6">
        <button
          onClick={toggleTorch}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center transition-colors",
            torchOn ? "bg-emerald-500 text-white" : "bg-white/10 text-white"
          )}
        >
          <Flashlight className="w-6 h-6" />
        </button>
        <button
          onClick={simulateScan}
          disabled={!isScanning}
          className="w-14 h-14 rounded-full bg-white flex items-center justify-center disabled:opacity-50"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-500" />
        </button>
        <button
          onClick={() => {
            stopCamera()
            onClose?.()
          }}
          className="w-14 h-14 rounded-full flex items-center justify-center"
        >
          <Image className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  )
}

export default QRScanner
