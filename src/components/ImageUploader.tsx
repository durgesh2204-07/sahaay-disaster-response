import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  X,
  Image as ImageIcon,
  Check,
  RotateCcw,
  RefreshCw,
  AlertCircle,
  Video,
  Sparkles,
} from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

const SAMPLE_PHOTOS = [
  {
    name: '🌊 Flooded Road',
    url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: '🏚️ Damaged Structure',
    url: 'https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: '🚧 Blocked Highway',
    url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: '🍚 Relief Food Depot',
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: '🚑 Rescue Team',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
  },
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Incident Photo Evidence',
  className = '',
}) => {
  const [showPresets, setShowPresets] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isCapturingFlash, setIsCapturingFlash] = useState(false);
  const [sourceType, setSourceType] = useState<'upload' | 'camera' | 'sample' | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mobileCameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera helper
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Start Camera Stream
  const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    setCameraError(null);
    stopCameraStream();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera stream not supported in this browser environment. Using direct capture fallback.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setIsCameraActive(true);

      // Attach to video element
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((err) => {
            console.warn('Video play error:', err);
          });
        }
      }, 100);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      // Fallback: If WebRTC camera stream is blocked in iframe/permission, fallback to mobile camera input
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access or use the Upload / Direct Camera button below.'
          : 'Could not activate live camera stream. You can capture directly via mobile camera or upload a file.'
      );
      setIsCameraActive(false);
    }
  };

  // Switch facing camera
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Capture Snapshot from Video Stream
  const capturePhoto = () => {
    if (!videoRef.current) return;

    setIsCapturingFlash(true);
    setTimeout(() => setIsCapturingFlash(false), 250);

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw frame to canvas
      ctx.drawImage(video, 0, 0, width, height);

      // Add emergency timestamp watermark
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(10, height - 35, 320, 25);
      ctx.fillStyle = '#14b8a6';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`SAHAAY VERIFIED • ${new Date().toLocaleTimeString()} • GPS SYNCED`, 18, height - 18);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      onChange(dataUrl);
      setSourceType('camera');
      stopCameraStream();
    }
  };

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('File size exceeds 8MB limit. Please select a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
          setSourceType('upload');
          stopCameraStream();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (url: string) => {
    onChange(url);
    setSourceType('sample');
    setShowPresets(false);
    stopCameraStream();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label and Top Action Bar */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5 font-['Outfit']">
          <Camera className="w-4 h-4 text-teal-600" />
          <span>{label}</span>
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="text-[11px] font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200 transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{showPresets ? 'Hide Samples' : 'Sample Photos'}</span>
          </button>
        </div>
      </div>

      {/* Preset Photo Drawer */}
      {showPresets && (
        <div className="p-3.5 bg-slate-900 text-slate-200 border border-slate-800 rounded-2xl space-y-2.5 shadow-lg animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Select standard disaster scenario reference photo:</span>
            </p>
            <button
              type="button"
              onClick={() => setShowPresets(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {SAMPLE_PHOTOS.map((sample) => (
              <button
                key={sample.name}
                type="button"
                onClick={() => handleSelectPreset(sample.url)}
                className={`relative group rounded-xl overflow-hidden border-2 text-left transition-all cursor-pointer ${
                  value === sample.url ? 'border-teal-400 ring-2 ring-teal-400' : 'border-slate-700 hover:border-teal-400'
                }`}
              >
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="w-full h-16 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="p-1.5 bg-slate-950/90 text-white text-[10px] font-extrabold truncate">
                  {sample.name}
                </div>
                {value === sample.url && (
                  <div className="absolute top-1 right-1 bg-teal-500 text-white p-0.5 rounded-full shadow-md">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* LIVE CAMERA CAPTURE VIEWFINDER */}
      {isCameraActive ? (
        <div className="relative rounded-3xl overflow-hidden border-2 border-teal-500 bg-black shadow-2xl space-y-2 animate-fade-in">
          {/* Flash Effect */}
          {isCapturingFlash && (
            <div className="absolute inset-0 bg-white z-50 animate-ping opacity-90" />
          )}

          {/* Video element */}
          <div className="relative aspect-video max-h-[320px] w-full flex items-center justify-center bg-slate-950">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Viewfinder Target Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none border border-white/20 grid grid-cols-3 grid-rows-3">
              <div className="border-r border-b border-white/10" />
              <div className="border-r border-b border-white/10" />
              <div className="border-b border-white/10" />
              <div className="border-r border-b border-white/10" />
              <div className="border-r border-b border-teal-400/40 flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-teal-400/70 rounded-full" />
              </div>
              <div className="border-b border-white/10" />
              <div className="border-r border-white/10" />
              <div className="border-r border-white/10" />
              <div />
            </div>

            {/* Camera Overlay Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-rose-400 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>LIVE CAM ACTIVE</span>
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleFacingMode}
                title="Switch Camera"
                className="p-2 bg-black/60 backdrop-blur-md hover:bg-black/80 text-white rounded-full border border-white/10 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={stopCameraStream}
                title="Close Camera"
                className="p-2 bg-black/60 backdrop-blur-md hover:bg-rose-600 text-white rounded-full border border-white/10 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Camera Controls Bar */}
          <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-t border-slate-800">
            <button
              type="button"
              onClick={stopCameraStream}
              className="text-xs font-bold text-slate-400 hover:text-white px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {/* BIG SHUTTER CAPTURE BUTTON */}
            <button
              type="button"
              onClick={capturePhoto}
              className="flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 font-black text-xs rounded-full shadow-lg shadow-teal-500/30 cursor-pointer transition-all uppercase tracking-wider"
            >
              <div className="w-4 h-4 rounded-full bg-slate-950 border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              </div>
              <span>Click / Capture Photo</span>
            </button>

            <button
              type="button"
              onClick={toggleFacingMode}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 px-3 py-2 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Flip Cam</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* ERROR NOTICE IF CAMERA UNAVAILABLE */}
      {cameraError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold leading-tight">{cameraError}</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => mobileCameraInputRef.current?.click()}
                className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-lg font-bold text-[11px] cursor-pointer"
              >
                📸 Open Native Camera
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 rounded-lg font-bold text-[11px] border border-amber-300 cursor-pointer"
              >
                📁 Choose File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHOTO PREVIEW (IF ATTACHED) */}
      {value && !isCameraActive ? (
        <div className="relative rounded-3xl overflow-hidden border-2 border-teal-500 bg-slate-950 shadow-xl group">
          <img
            src={value}
            alt="Incident Attachment"
            className="w-full h-56 sm:h-64 object-cover"
          />

          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-teal-300 border border-slate-700 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {sourceType === 'camera'
                ? '📸 Live Camera Snapshot'
                : sourceType === 'sample'
                ? '🖼️ Reference Disaster Photo'
                : '📁 Uploaded Image Evidence'}
            </span>
          </div>

          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-wrap items-center justify-center gap-3 p-4">
            <button
              type="button"
              onClick={() => startCamera()}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-black rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
            >
              <Camera className="w-4 h-4" />
              <span>Click / Retake Live Photo</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 text-xs font-black rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Different Image</span>
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-lg flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
            >
              <X className="w-4 h-4" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* DUAL ACTION BUTTONS: CLICK (CAMERA) OR UPLOAD (FILE) */}
      {!value && !isCameraActive && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* OPTION 1: CLICK / TAKE PHOTO WITH CAMERA */}
          <div
            onClick={() => startCamera()}
            className="group border-2 border-teal-200 hover:border-teal-500 bg-gradient-to-br from-teal-50/70 to-emerald-50/50 hover:from-teal-50 hover:to-teal-100/60 rounded-3xl p-5 text-center cursor-pointer transition-all shadow-sm hover:shadow-md flex flex-col items-center justify-center gap-2 relative overflow-hidden"
          >
            <div className="w-12 h-12 bg-teal-600 text-white rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 font-['Outfit'] uppercase tracking-wide flex items-center justify-center gap-1">
                <span>Click / Take Photo</span>
                <span className="text-[10px] bg-teal-700 text-white px-1.5 py-0.5 rounded-full font-bold">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                Activate camera & capture real-time incident photo
              </p>
            </div>
            <button
              type="button"
              className="mt-1 px-3 py-1 bg-teal-700 text-white rounded-xl text-[11px] font-extrabold group-hover:bg-teal-800 transition-colors pointer-events-none"
            >
              Open Camera Viewfinder
            </button>
          </div>

          {/* OPTION 2: UPLOAD IMAGE FILE FROM DEVICE */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group border-2 border-slate-200 hover:border-slate-400 bg-slate-50/80 hover:bg-slate-100 rounded-3xl p-5 text-center cursor-pointer transition-all shadow-sm hover:shadow-md flex flex-col items-center justify-center gap-2 relative overflow-hidden"
          >
            <div className="w-12 h-12 bg-slate-800 text-white rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 font-['Outfit'] uppercase tracking-wide">
                Upload Photo File
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                Browse device gallery or drag & drop (JPG, PNG, WEBP)
              </p>
            </div>
            <button
              type="button"
              className="mt-1 px-3 py-1 bg-slate-200 text-slate-800 rounded-xl text-[11px] font-extrabold group-hover:bg-slate-300 transition-colors pointer-events-none"
            >
              Browse Local Files
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Input for Device Files */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Hidden File Input with native mobile camera capture */}
      <input
        type="file"
        ref={mobileCameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Hidden Canvas for Live Video Snapshot Capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
