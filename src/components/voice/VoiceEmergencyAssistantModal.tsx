import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Sparkles,
  AlertTriangle,
  Shield,
  Home,
  CheckCircle2,
  Radio,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmergencyType } from '../../types';

interface VoiceEmergencyAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (view: string) => void;
}

export const VoiceEmergencyAssistantModal: React.FC<VoiceEmergencyAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { openEmergencySosModal, submitSos, userLocation, userLocationAddress, userLocationAccuracy } = useApp();

  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [detectedAction, setDetectedAction] = useState<{
    type: 'SOS' | 'SHELTER' | 'REPORT' | 'WEATHER' | 'MAP';
    emergencyType?: EmergencyType;
    label: string;
    description: string;
  } | null>(null);
  const [micVolume, setMicVolume] = useState<number>(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [autoDispatchCountdown, setAutoDispatchCountdown] = useState<number | null>(null);

  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<any>(null);
  const isOpenRef = useRef<boolean>(isOpen);

  isOpenRef.current = isOpen;

  // Intent Analyzer for disaster & emergency words (English & Hindi / Indian English)
  const analyzeIntent = useCallback((text: string) => {
    const lower = text.toLowerCase();

    // 1. Flood / Water rescue
    if (
      lower.includes('flood') ||
      lower.includes('water') ||
      lower.includes('paani') ||
      lower.includes('drown') ||
      lower.includes('submerged') ||
      lower.includes('river')
    ) {
      setDetectedAction({
        type: 'SOS',
        emergencyType: 'Flood',
        label: '🌊 Flood Rescue Squad Dispatch',
        description: 'Water submergence detected. Dispatching Flood Rescue Taskforce Alpha.',
      });
      return;
    }

    // 2. Fire Outbreak
    if (
      lower.includes('fire') ||
      lower.includes('aag') ||
      lower.includes('smoke') ||
      lower.includes('burn') ||
      lower.includes('dhua')
    ) {
      setDetectedAction({
        type: 'SOS',
        emergencyType: 'Fire',
        label: '🔥 Fire Evacuation Squad Dispatch',
        description: 'Fire emergency detected. Mobilizing fire & burn triage volunteers.',
      });
      return;
    }

    // 3. Medical Emergency
    if (
      lower.includes('medical') ||
      lower.includes('doctor') ||
      lower.includes('ambulance') ||
      lower.includes('injured') ||
      lower.includes('heart') ||
      lower.includes('blood') ||
      lower.includes('chot') ||
      lower.includes('hospital')
    ) {
      setDetectedAction({
        type: 'SOS',
        emergencyType: 'Medical Emergency',
        label: '🚑 Trauma Paramedic Unit Dispatch',
        description: 'Medical distress detected. Alerting emergency medical responder team.',
      });
      return;
    }

    // 4. Building Damage / Structural Collapse
    if (
      lower.includes('building') ||
      lower.includes('collapse') ||
      lower.includes('debris') ||
      lower.includes('wall') ||
      lower.includes('structure') ||
      lower.includes('gira')
    ) {
      setDetectedAction({
        type: 'SOS',
        emergencyType: 'Building Damage',
        label: '🏚️ Structural Search & Rescue Dispatch',
        description: 'Collapse emergency detected. Dispatching heavy search and extrication squad.',
      });
      return;
    }

    // 5. General SOS / Emergency
    if (
      lower.includes('sos') ||
      lower.includes('emergency') ||
      lower.includes('bachao') ||
      lower.includes('save') ||
      lower.includes('help') ||
      lower.includes('khatra') ||
      lower.includes('madad') ||
      lower.includes('trapped')
    ) {
      setDetectedAction({
        type: 'SOS',
        emergencyType: 'Other',
        label: '🚨 Immediate Priority SOS Dispatch',
        description: 'Distress call recognized. Dispatching all nearest volunteer taskforces.',
      });
      return;
    }

    // 6. Shelters & Relief Camps
    if (
      lower.includes('shelter') ||
      lower.includes('camp') ||
      lower.includes('relief') ||
      lower.includes('rahat') ||
      lower.includes('food') ||
      lower.includes('khana') ||
      lower.includes('stay')
    ) {
      setDetectedAction({
        type: 'SHELTER',
        label: '⛺ Navigate to Nearest Shelter',
        description: 'Locating verified community relief centers with available capacity.',
      });
      return;
    }

    // 7. Incident Map
    if (lower.includes('map') || lower.includes('locate') || lower.includes('naksha') || lower.includes('danger')) {
      setDetectedAction({
        type: 'MAP',
        label: '🗺️ Open 3D Disaster & Danger Map',
        description: 'Displaying real-time danger perimeters, beacons, and evacuation corridors.',
      });
      return;
    }

    // 8. Weather
    if (lower.includes('weather') || lower.includes('rain') || lower.includes('forecast') || lower.includes('cyclone')) {
      setDetectedAction({
        type: 'WEATHER',
        label: '🌧️ Open Live Radar & Weather Alerts',
        description: 'Pulling meteorological radar and precipitation alerts.',
      });
      return;
    }
  }, []);

  // Stop all audio capture & speech recognition safely
  const stopListening = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }

    setIsListening(false);
    setMicVolume(0);
  }, []);

  // Start AudioContext volume analysis to display real-time live bouncing wave bars
  const setupAudioVolumeMeter = async (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        if (!analyserRef.current || !isOpenRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        setMicVolume(normalized);

        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (e) {
      console.warn('Audio volume meter error (ignorable):', e);
    }
  };

  // Start SpeechRecognition + Microphone with resilient fail-safe error handling
  const startListening = useCallback(async () => {
    setPermissionError(null);

    // 1. Request microphone permission explicitly
    let stream: MediaStream | null = null;
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
        });
        mediaStreamRef.current = stream;
        setupAudioVolumeMeter(stream);
      }
    } catch (err: any) {
      console.warn('Microphone permission request note:', err);
      // Even if mic stream is blocked or in an iframe, we continue to allow Web Speech or quick trigger chips
      setPermissionError(
        'Microphone permission is needed. Click "Allow" in browser, or tap any emergency command chip below.'
      );
    }

    // 2. Initialize Web Speech Recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setIsListening(false);
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      // Use Indian English or default to browser language for best accent compatibility
      recognition.lang = navigator.language || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setPermissionError(null);
      };

      recognition.onresult = (event: any) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript + ' ';
        }
        const clean = fullTranscript.trim();
        if (clean) {
          setTranscript(clean);
          analyzeIntent(clean);
        }
      };

      recognition.onerror = (event: any) => {
        // 'no-speech' is a benign browser timeout event when the user is silent; DO NOT stop listening!
        if (event.error === 'no-speech') {
          return;
        }

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setPermissionError('Microphone access blocked. Please allow mic in browser settings.');
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        // Automatically restart speech recognition while modal is open
        if (isOpenRef.current && isListening) {
          setTimeout(() => {
            if (isOpenRef.current) {
              try {
                recognition.start();
              } catch {}
            }
          }, 250);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch (err) {
      console.warn('Could not launch speech recognition directly:', err);
      setIsListening(false);
    }
  }, [analyzeIntent, isListening]);

  // Manage modal open / close lifecycle
  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setDetectedAction(null);
      setAutoDispatchCountdown(null);
      startListening();
    } else {
      stopListening();
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    }

    return () => {
      stopListening();
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [isOpen]);

  // Trigger Action Execution
  const executeAction = useCallback(async () => {
    if (!detectedAction) return;

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    if (detectedAction.type === 'SOS') {
      stopListening();
      onClose();

      const eventType = detectedAction.emergencyType || 'Other';
      const lat = userLocation?.lat || 18.5204;
      const lng = userLocation?.lng || 73.8567;
      const accuracy = userLocationAccuracy || 10;
      const address = userLocationAddress || 'Near Current Location, Pune';

      await submitSos({
        disasterType: eventType,
        lat,
        lng,
        accuracyMeters: accuracy,
        locationAddress: address,
        peopleCount: 1,
        situationAnswers: {
          voiceDispatched: true,
          transcript,
        },
        severity: 'CRITICAL',
        description: `VOICE SOS: "${transcript || eventType}". Direct rescue dispatch requested via voice command.`,
        voiceTranscript: transcript,
      });

      // Open SOS Modal to show the active verified dispatch card
      openEmergencySosModal(eventType);
    } else if (detectedAction.type === 'SHELTER') {
      stopListening();
      onClose();
      if (onNavigate) onNavigate('shelters');
    } else if (detectedAction.type === 'MAP') {
      stopListening();
      onClose();
      if (onNavigate) onNavigate('community_map');
    } else if (detectedAction.type === 'WEATHER') {
      stopListening();
      onClose();
      if (onNavigate) onNavigate('weather');
    } else if (detectedAction.type === 'REPORT') {
      stopListening();
      onClose();
      if (onNavigate) onNavigate('report_emergency');
    }
  }, [
    detectedAction,
    transcript,
    userLocation,
    userLocationAddress,
    userLocationAccuracy,
    submitSos,
    openEmergencySosModal,
    onNavigate,
    onClose,
    stopListening,
  ]);

  // If SOS intent is detected, start a 4-second auto-dispatch countdown
  useEffect(() => {
    if (detectedAction && detectedAction.type === 'SOS' && autoDispatchCountdown === null) {
      setAutoDispatchCountdown(4);

      countdownIntervalRef.current = setInterval(() => {
        setAutoDispatchCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
            executeAction();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [detectedAction, executeAction, autoDispatchCountdown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start sm:justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto overscroll-contain py-4 sm:py-6">
      <div className="relative w-full max-w-lg max-h-[92vh] sm:max-h-[88vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-indigo-500/40 flex flex-col overflow-hidden my-auto shrink-0 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Sticky Modal Header */}
        <div className="shrink-0 px-4 sm:px-5 py-3.5 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white flex items-center justify-between shadow-md z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-300 animate-pulse" />
            <span className="font-black text-xs sm:text-sm tracking-wide uppercase">
              SAHAAY Voice SOS & AI Dispatch
            </span>
          </div>
          <button
            onClick={() => {
              stopListening();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto overscroll-contain text-center space-y-4 modal-scroll-area min-h-0 pb-8 touch-pan-y">
          {/* Status Badge */}
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-black text-xs uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Voice Emergency AI Assistant</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Speak Your Emergency Now
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Say <strong className="text-red-600">"SOS"</strong>, <strong className="text-blue-600">"Flood"</strong>,{' '}
            <strong className="text-orange-600">"Fire"</strong>, <strong className="text-rose-600">"Doctor"</strong>, or{' '}
            <strong className="text-teal-600">"Shelter"</strong>.
          </p>

        {/* Real-time Bouncing Waveform & Mic Button */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center mb-3">
            {/* Pulsing Aura */}
            {isListening && (
              <>
                <div
                  className="absolute rounded-full bg-red-500/20 transition-all duration-100"
                  style={{
                    width: `${90 + micVolume * 0.8}px`,
                    height: `${90 + micVolume * 0.8}px`,
                  }}
                ></div>
                <div
                  className="absolute rounded-full bg-red-500/30 transition-all duration-75"
                  style={{
                    width: `${75 + micVolume * 0.5}px`,
                    height: `${75 + micVolume * 0.5}px`,
                  }}
                ></div>
              </>
            )}

            <button
              onClick={isListening ? stopListening : startListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all cursor-pointer active:scale-95 ${
                isListening
                  ? 'bg-gradient-to-tr from-red-600 via-rose-600 to-red-700 text-white ring-4 ring-red-500/40 shadow-red-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {isListening ? (
                <Mic className="w-9 h-9 animate-bounce" />
              ) : (
                <MicOff className="w-9 h-9 text-slate-400" />
              )}
            </button>
          </div>

          {/* Real-Time Live Decibel Audio Visualizer Bars */}
          <div className="flex items-center gap-1.5 h-7 mt-1">
            {[20, 45, 80, 100, 75, 40, 60, 90, 30].map((baseHeight, idx) => {
              const dynamicHeight = isListening ? Math.max(6, (micVolume / 100) * baseHeight) : 4;
              return (
                <div
                  key={idx}
                  className={`w-1.5 rounded-full transition-all duration-75 ${
                    isListening
                      ? micVolume > 15
                        ? 'bg-rose-500 shadow-xs shadow-rose-500'
                        : 'bg-red-400'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                  style={{ height: `${dynamicHeight}px` }}
                ></div>
              );
            })}
          </div>

          <div className="text-xs font-extrabold mt-2 flex items-center gap-1.5">
            {isListening ? (
              <span className="text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                Microphone Active • Listening in real-time...
              </span>
            ) : (
              <span className="text-slate-500">
                Microphone paused. Click icon to resume voice detection.
              </span>
            )}
          </div>
        </div>

        {/* Live Detected Speech Box */}
        <div className="min-h-[68px] p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left mb-4">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between mb-1">
            <span>Voice Speech Transcript:</span>
            {transcript && <span className="text-emerald-600 font-bold">✓ Audio Heard</span>}
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 italic break-words">
            {transcript ? `"${transcript}"` : 'Listening for words like "Emergency", "Flood rescue", "Doctor", "Fire"...'}
          </p>
        </div>

        {/* Detected Action Confirmation Banner */}
        {detectedAction && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 via-rose-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/40 border-2 border-red-500/50 text-left mb-4 shadow-sm animate-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-black text-red-700 dark:text-red-300 uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Recognized Voice Command
                </span>
                <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                  {detectedAction.label}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {detectedAction.description}
                </p>
              </div>

              <div className="shrink-0 flex flex-col items-end gap-1">
                <button
                  onClick={executeAction}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <span>Dispatch Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                {autoDispatchCountdown !== null && autoDispatchCountdown > 0 && (
                  <span className="text-[10px] font-mono font-bold text-red-600 animate-pulse">
                    Auto in {autoDispatchCountdown}s
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Permission Note or Notice */}
        {permissionError && (
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl text-[11px] text-amber-800 dark:text-amber-200 text-left mb-3">
            ⚠️ {permissionError}
          </div>
        )}

        {/* Instant 1-Tap Trigger Chips (Guarantees users can trigger voice commands in all environments) */}
        <div className="text-left pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 block mb-2">
            Tap to test voice command phrases directly:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {[
              { text: 'Emergency SOS', icon: '🚨' },
              { text: 'Flood Rescue', icon: '🌊' },
              { text: 'Fire Outbreak', icon: '🔥' },
              { text: 'Need Doctor', icon: '🚑' },
              { text: 'Building Collapse', icon: '🏚️' },
              { text: 'Find Shelter', icon: '⛺' },
            ].map((chip) => (
              <button
                key={chip.text}
                type="button"
                onClick={() => {
                  setTranscript(chip.text);
                  analyzeIntent(chip.text);
                }}
                className="text-[11px] font-bold py-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <span>{chip.icon}</span>
                <span className="truncate">{chip.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Direct Helpline Shortcut */}
        <div className="pt-2 text-center">
          <a
            href="tel:112"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
          >
            <span>🚨</span> Direct Dial National Emergency Helpline (112)
          </a>
        </div>
      </div>
    </div>
  </div>
  );
};
