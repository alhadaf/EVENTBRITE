import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, Scan, CheckCircle, XCircle, Users, Clock } from 'lucide-react';
import QRCode from 'react-qr-code';

interface QRScannerProps {
  onScan: (qrCode: string) => void;
  isActive: boolean;
  onToggleScanner: () => void;
  sessionStats: {
    totalScans: number;
    successfulScans: number;
    duplicateScans: number;
    sessionDuration: string;
  };
}

export const QRScanner: React.FC<QRScannerProps> = ({
  onScan,
  isActive,
  onToggleScanner,
  sessionStats,
}) => {
  const [lastScanResult, setLastScanResult] = useState<{
    success: boolean;
    message: string;
    attendeeName?: string;
  } | null>(null);
  const [manualCode, setManualCode] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error('Camera access error:', err));
    }
    
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive]);

  const handleManualScan = () => {
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      setManualCode('');
      // Mock response for demo
      setLastScanResult({
        success: true,
        message: 'Check-in successful!',
        attendeeName: 'John Doe'
      });
    }
  };

  const mockScan = () => {
    const mockCodes = [
      'ATT-001-EVENT-123',
      'ATT-002-EVENT-123',
      'ATT-003-EVENT-123'
    ];
    const randomCode = mockCodes[Math.floor(Math.random() * mockCodes.length)];
    onScan(randomCode);
    setLastScanResult({
      success: true,
      message: 'Check-in successful!',
      attendeeName: 'Demo Attendee'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">QR Code Check-in</h2>
          <p className="text-gray-500 mt-1">Scan attendee QR codes for quick check-in</p>
        </div>
        <button
          onClick={onToggleScanner}
          className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
            isActive
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isActive ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
          <span>{isActive ? 'Stop Scanner' : 'Start Scanner'}</span>
        </button>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <Scan className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Total Scans</p>
              <p className="text-xl font-bold text-gray-900">{sessionStats.totalScans}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Successful</p>
              <p className="text-xl font-bold text-green-600">{sessionStats.successfulScans}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-sm text-gray-500">Duplicates</p>
              <p className="text-xl font-bold text-orange-600">{sessionStats.duplicateScans}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Session Time</p>
              <p className="text-xl font-bold text-purple-600">{sessionStats.sessionDuration}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner Interface */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Camera Scanner</h3>
          
          <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
            {isActive ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Camera is off</p>
                  <p className="text-sm text-gray-500 mt-2">Click "Start Scanner" to begin</p>
                </div>
              </div>
            )}
            
            {isActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br"></div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={mockScan}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            disabled={!isActive}
          >
            Simulate QR Scan (Demo)
          </button>
        </div>

        {/* Manual Entry & Results */}
        <div className="space-y-6">
          {/* Manual Entry */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Entry</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code or Attendee ID
                </label>
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Enter QR code or attendee ID"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleManualScan}
                className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Manual Check-in
              </button>
            </div>
          </div>

          {/* Last Scan Result */}
          {lastScanResult && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Last Scan Result</h3>
              <div className={`p-4 rounded-lg ${
                lastScanResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center space-x-3">
                  {lastScanResult.success ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                  <div>
                    <p className={`font-medium ${
                      lastScanResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {lastScanResult.message}
                    </p>
                    {lastScanResult.attendeeName && (
                      <p className="text-sm text-gray-600 mt-1">
                        Attendee: {lastScanResult.attendeeName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sample QR Code */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample QR Code</h3>
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <QRCode value="ATT-001-EVENT-123" size={120} />
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center mt-2">ATT-001-EVENT-123</p>
          </div>
        </div>
      </div>
    </div>
  );
};