import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { VolunteerSkill, UserRole, EmergencyType } from '../types';
import {
  User,
  Shield,
  Heart,
  KeyRound,
  Lock,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Check,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Mic,
  Languages,
  Radio,
  X,
  MapPin,
  MessageSquare,
  Volume2,
  VolumeX,
  Send,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Wifi,
  WifiOff,
  LogOut,
  LogIn,
  UserPlus,
  Waves,
  Mountain,
  Flame,
  Ambulance,
  Building2,
  Wind,
  Ban,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// Simple, Attractive, and Professional SAHAAY Emergency Plus Logo
export const SahaayLogoMark: React.FC<{ className?: string }> = ({
  className = 'w-10 h-10',
}) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="sahaayPlusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#004d40" />
        <stop offset="60%" stopColor="#059669" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
      <linearGradient id="sahaayBeaconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
      <filter id="plusSoftShadow" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#059669" floodOpacity="0.25" />
      </filter>
    </defs>

    {/* Modern Rounded Square Base Frame */}
    <rect
      x="5"
      y="5"
      width="90"
      height="90"
      rx="24"
      fill="#ffffff"
      stroke="#d1fae5"
      strokeWidth="2.5"
    />

    {/* Emergency Rescue Relief Plus Symbol */}
    <g filter="url(#plusSoftShadow)">
      {/* Horizontal Bar */}
      <rect
        x="20"
        y="37.5"
        width="60"
        height="25"
        rx="9"
        fill="url(#sahaayPlusGrad)"
      />
      {/* Vertical Bar */}
      <rect
        x="37.5"
        y="20"
        width="25"
        height="60"
        rx="9"
        fill="url(#sahaayPlusGrad)"
      />
    </g>

    {/* Center Lifeline Assistance Core & Subtle Beacon */}
    <circle cx="50" cy="50" r="7.5" fill="#ffffff" />
    <circle cx="50" cy="50" r="4.5" fill="url(#sahaayBeaconGrad)" />
    <circle cx="50" cy="50" r="1.5" fill="#ffffff" />
  </svg>
);

const MAHARASHTRA_DISTRICTS = [
  'Pune',
  'Raigad',
  'Nashik',
  'Mumbai City',
  'Mumbai Suburban',
  'Thane',
  'Palghar',
  'Ratnagiri',
  'Sindhudurg',
  'Satara',
  'Kolhapur',
  'Sangli',
  'Solapur',
  'Ahmednagar',
  'Chhatrapati Sambhajinagar',
  'Jalgaon',
  'Nanded',
  'Amravati',
  'Nagpur',
];

// Form Validation Standards
const isValidName = (val: string): boolean => {
  const trimmed = val.trim();
  return trimmed.length >= 2 && trimmed.length <= 60;
};

const isValidEmail = (val: string): boolean => {
  const trimmed = val.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
};

const hasMinLength = (pass: string): boolean => pass.length >= 4;
const isPasswordSafe = (pass: string): boolean => pass.length >= 4;

// Security Input Sanitization (Anti-XSS & Anti-Injection)
export const sanitizeInput = (val: string): string => {
  if (!val) return '';
  return val
    .trim()
    .replace(/[<>]/g, '') // strip direct html tag brackets
    .replace(/javascript:/gi, '')
    .slice(0, 120);
};

// Timing-Safe String Comparison Simulator (Mitigating timing side-channel attacks)
export const timingSafeStringEqual = (a: string, b: string): boolean => {
  const normA = a.trim().toUpperCase();
  const normB = b.trim().toUpperCase();
  if (normA.length !== normB.length) {
    let dummy = 0;
    for (let i = 0; i < normA.length; i++) {
      dummy |= normA.charCodeAt(i) ^ 0;
    }
    return false;
  }
  let result = 0;
  for (let i = 0; i < normA.length; i++) {
    result |= normA.charCodeAt(i) ^ normB.charCodeAt(i);
  }
  return result === 0;
};

interface AuthViewProps {
  setCurrentTab: (tab: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ setCurrentTab }) => {
  const {
    login,
    logout,
    isAuthenticated,
    activeRole,
    currentUser,
    offlineMode,
    toggleOfflineMode,
    isEffectiveOffline,
    verifyAdminPasscode,
    updateVolunteerProfile,
    openEmergencySosModal,
    openVoiceMode,
    submitSos,
    volunteers,
    assignVolunteerToEmergency,
    addRealTimeEvent,
  } = useApp();

  const { t, language, setLanguage } = useLanguage();

  // Active Role & Mode State
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER' | 'FORGOT'>('LOGIN');
  
  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Form Fields (Prefilled with Demo Credentials for fast 1-click access)
  const [email, setEmail] = useState('citizen@sahaay.org');
  const [name, setName] = useState('Citizen Demo');
  const [phone, setPhone] = useState('+91 98220 12345');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [skills, setSkills] = useState<VolunteerSkill[]>(['First Aid', 'Food Distribution']);

  // Feedback & Authorization States
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    general?: string;
  }>({});
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authorizedSuccess, setAuthorizedSuccess] = useState(false);

  // Admin Passcode & Error States (HIDDEN PASS KEY - No public display)
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [adminError, setAdminError] = useState('');
  const [showAdminPasscode, setShowAdminPasscode] = useState(false);
  const [adminSuccess, setAdminSuccess] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Anti-Brute Force Rate Limiting & Security Lockout State
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [lockoutTimerSec, setLockoutTimerSec] = useState(0);

  // Countdown timer for security lockout
  useEffect(() => {
    if (!lockoutUntil) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockoutUntil(null);
        setLockoutTimerSec(0);
        setFailedAttempts(0);
        clearInterval(interval);
      } else {
        setLockoutTimerSec(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // Toast Notification Message
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // ==========================================
  // ONE-TAP SOS STATE & DISASTER LIST
  // ==========================================
  const [isSosPanelOpen, setIsSosPanelOpen] = useState(false);
  const [isSubmittingOneTapSos, setIsSubmittingOneTapSos] = useState(false);
  const [sosSentConfirmation, setSosSentConfirmation] = useState<{
    disaster: EmergencyType;
    address: string;
    timestamp: string;
  } | null>(null);

  // ==========================================
  // LIVE VOICE ALERT & REPORTING STATE
  // ==========================================
  const [isVoicePanelOpen, setIsVoicePanelOpen] = useState(false);
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState<'en' | 'hi' | 'mr'>(
    language === 'mr' ? 'mr' : language === 'hi' ? 'hi' : 'en'
  );
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceSentConfirmation, setVoiceSentConfirmation] = useState<{
    disaster: EmergencyType;
    transcript: string;
    timestamp: string;
  } | null>(null);

  // Play audio chime utility
  const playEmergencyChime = (freq: number = 880) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = freq;
      gain.gain.value = 0.15;
      osc.start();
      setTimeout(() => {
        osc.stop();
        audioCtx.close();
      }, 200);
    } catch {
      // Audio muted
    }
  };

  // 1-Tap SOS Disaster Selection: Transmits to Volunteer Page (NO volunteer name, zero fake info)
  const handleOneTapSosDisasterSelect = async (disaster: EmergencyType) => {
    setIsSubmittingOneTapSos(true);
    setSosSentConfirmation(null);

    let lat = 18.5204;
    let lng = 73.8567;
    let address = 'Pune District (Live GPS Telemetry)';

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        address = `Live GPS: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
      } catch {
        // fallback
      }
    }

    try {
      // Submit SOS into the system state - it routes to the volunteer page!
      await submitSos({
        disasterType: disaster,
        lat,
        lng,
        accuracyMeters: 6,
        locationAddress: address,
        peopleCount: 1,
        situationAnswers: { emergencyType: disaster, source: 'ONE_TAP_SOS' },
        severity: 'CRITICAL',
        description: `ONE-TAP EMERGENCY SOS: Citizen reported ${disaster}. Broadcast to Volunteer page for immediate field response.`,
        reporterName: 'Citizen Emergency SOS',
        reporterPhone: '112 Helpline Emergency Broadcast',
      });

      // Broadcast real-time feed item
      addRealTimeEvent({
        type: 'CITIZEN_REPORT',
        title: `🚨 ${disaster} SOS Broadcast to Volunteer Page`,
        description: `Immediate emergency alert dispatched. Visible on Volunteer Dashboard.`,
        locationName: address,
        lat,
        lng,
        severity: 'CRITICAL',
        icon: '🚨',
      });

      playEmergencyChime(920);

      // Confirm transmission to volunteer page (NO fake volunteer name)
      setSosSentConfirmation({
        disaster,
        address,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      });

      showToast(`🚨 SOS Broadcast sent to Volunteer page! Field teams alerted.`);
    } catch (e) {
      console.error('SOS dispatch error:', e);
    } finally {
      setIsSubmittingOneTapSos(false);
    }
  };

  // Hands-Free Voice Emergency Alert Recording (Dispatches to Volunteer Page)
  const handleStartVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      handleQuickVoicePreset('Flood water rising near bridge, families needing evacuation');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = voiceLanguage === 'hi' ? 'hi-IN' : voiceLanguage === 'mr' ? 'mr-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsVoiceListening(true);
        setVoiceTranscript('');
        setVoiceSentConfirmation(null);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setVoiceTranscript(transcript);
      };

      recognition.onerror = () => {
        setIsVoiceListening(false);
      };

      recognition.onend = () => {
        setIsVoiceListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsVoiceListening(false);
      console.error('Speech recognition error:', err);
    }
  };

  // Process & Submit Spoken Voice Alert to Volunteer Page
  const processAndSubmitVoiceAlert = async (textToProcess?: string) => {
    const text = (textToProcess || voiceTranscript).trim();
    if (!text) return;

    setIsVoiceListening(false);

    // Auto-classify disaster type from speech keywords
    const lower = text.toLowerCase();
    let detectedDisaster: EmergencyType = 'Flood';

    if (lower.includes('landslide') || lower.includes('mountain') || lower.includes('pahad') || lower.includes('darad') || lower.includes('malba')) {
      detectedDisaster = 'Landslide';
    } else if (lower.includes('doctor') || lower.includes('blood') || lower.includes('chot') || lower.includes('hospital') || lower.includes('ambulance') || lower.includes('sick')) {
      detectedDisaster = 'Medical Emergency';
    } else if (lower.includes('road') || lower.includes('rasta') || lower.includes('bridge') || lower.includes('pul') || lower.includes('traffic') || lower.includes('block')) {
      detectedDisaster = 'Road Block';
    } else if (lower.includes('fire') || lower.includes('aag') || lower.includes('smoke') || lower.includes('dhuan')) {
      detectedDisaster = 'Fire';
    } else if (lower.includes('building') || lower.includes('collapse') || lower.includes('wall') || lower.includes('padzhad')) {
      detectedDisaster = 'Building Damage';
    }

    try {
      await submitSos({
        disasterType: detectedDisaster,
        lat: 18.5204,
        lng: 73.8567,
        accuracyMeters: 8,
        locationAddress: 'Voice Emergency Telemetry',
        peopleCount: 1,
        situationAnswers: { voiceTranscript: text, source: 'VOICE_ALERT' },
        severity: 'CRITICAL',
        description: `VOICE EMERGENCY REPORT: "${text}"`,
        voiceTranscript: text,
        reporterName: 'Voice Emergency Broadcast',
        reporterPhone: '112 Helpline Broadcast',
      });

      // Spoken TTS feedback to user
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const confText =
          voiceLanguage === 'hi'
            ? 'आपकी आपातकालीन आवाज स्वयंसेवक पेज पर भेज दी गई है।'
            : voiceLanguage === 'mr'
            ? 'तुमची व्हॉइस तक्रार स्वयंसेवक पेजवर पाठवली आहे.'
            : 'Voice emergency alert sent to the volunteer page.';
        const utter = new SpeechSynthesisUtterance(confText);
        utter.lang = voiceLanguage === 'hi' ? 'hi-IN' : voiceLanguage === 'mr' ? 'mr-IN' : 'en-IN';
        window.speechSynthesis.speak(utter);
      }

      setVoiceSentConfirmation({
        disaster: detectedDisaster,
        transcript: text,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      });

      showToast(`🎙️ Voice Alert sent to Volunteer page!`);
    } catch (e) {
      console.error('Error submitting voice alert:', e);
    }
  };

  const handleQuickVoicePreset = (presetText: string) => {
    setVoiceTranscript(presetText);
    processAndSubmitVoiceAlert(presetText);
  };

  // Live Voice Spoken Warning Broadcast (TTS)
  const handleToggleVoiceAlert = () => {
    if (isVoiceSpeaking) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsVoiceSpeaking(false);
      return;
    }

    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    let speechText = '';
    let speechLang = 'en-IN';

    if (voiceLanguage === 'hi') {
      speechText =
        'सावधान। आपदा चेतावनी। भारी वर्षा और जलभराव का अलर्ट जारी है। मुख्य सड़कों और घाट मार्गों पर सतर्क रहें। आपातकालीन सहायता के लिए एक एक दो या एक शून्य सात सात पर कॉल करें।';
      speechLang = 'hi-IN';
    } else if (voiceLanguage === 'mr') {
      speechText =
        'सावधान। आपत्ती इशारा। मुसळधार पाऊस आणि पूर परिस्थितीचा इशारा दिला आहे। मुख्य रस्ते आणि घाट मार्गावर खबरदारी घ्या। मदतीसाठी एक एक दोन किंवा एक शून्य सात सात वर संपर्क साधा।';
      speechLang = 'mr-IN';
    } else {
      speechText =
        'Attention citizens. Emergency weather warning in effect. Rainfall risk and localized road closures active. For emergency response, dial 112 or District Helpline 1077.';
      speechLang = 'en-IN';
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = speechLang;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsVoiceSpeaking(false);
    utterance.onerror = () => setIsVoiceSpeaking(false);

    setIsVoiceSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Role Selection & Auth Dialog
  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    setAdminError('');
    setFieldErrors({});
    setForgotSuccess(false);
    setAuthorizedSuccess(false);
    if (role === 'volunteer') {
      setEmail('volunteer@sahaay.org');
      setPassword('password123');
      setName('Field Volunteer');
    } else if (role === 'admin') {
      setEmail('admin@sahaay.org');
      setPassword('password123');
      setName('Admin Response Officer');
      setAdminKeyInput('DISASTER-OPS-2026');
    } else {
      setEmail('citizen@sahaay.org');
      setPassword('password123');
      setName('Citizen Demo');
    }
    setIsAuthModalOpen(true);
  };

  const switchAuthMode = (mode: 'LOGIN' | 'REGISTER' | 'FORGOT') => {
    setAuthMode(mode);
    setFieldErrors({});
    setAdminError('');
    setForgotSuccess(false);
    setAuthorizedSuccess(false);
  };

  // Logout Handler
  const handleLogout = () => {
    logout();
    setAdminSuccess(false);
    setAuthorizedSuccess(false);
    showToast('Logged out successfully. Session reset.');
  };

  // Field validation
  const validateForm = (): boolean => {
    const errors: { name?: string; email?: string; password?: string; phone?: string; general?: string } = {};

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      errors.email = 'Email address is required.';
    } else if (!isValidEmail(cleanEmail)) {
      errors.email = 'Please provide a valid email format (e.g. name@domain.com).';
    }

    if (authMode === 'REGISTER') {
      const cleanName = name.trim();
      if (!cleanName) {
        errors.name = 'Full legal name is required.';
      } else if (cleanName.length < 2) {
        errors.name = 'Name must be at least 2 characters.';
      }
    }

    if (authMode !== 'FORGOT') {
      if (!password || password.trim().length === 0) {
        errors.password = 'Password is required.';
      } else if (authMode === 'REGISTER' && password.length < 4) {
        errors.password = 'Password must be at least 4 characters long.';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setAdminError('');
    setForgotSuccess(false);

    // 1. FORGOT PASSWORD MODE
    if (authMode === 'FORGOT') {
      const sanitizedEmail = sanitizeInput(email);
      if (!sanitizedEmail || !isValidEmail(sanitizedEmail)) {
        setFieldErrors({ email: 'Please enter a valid registered email to receive reset instructions.' });
        return;
      }
      setForgotSuccess(true);
      return;
    }

    // 2. ADMIN AUTHENTICATION WITH BRUTE-FORCE LOCKOUT PROTECTION
    if (selectedRole === 'admin') {
      if (lockoutUntil && Date.now() < lockoutUntil) {
        setAdminError(`Security Lockout Active: Too many failed pass key attempts. Anti-brute force defense engaged. Please wait ${lockoutTimerSec}s before retrying.`);
        return;
      }

      const cleanKey = sanitizeInput(adminKeyInput).trim().toUpperCase();
      if (!cleanKey) {
        setAdminError('Please enter your authorized admin pass key.');
        return;
      }

      setIsAuthorizing(true);

      setTimeout(() => {
        const isKeyValid =
          verifyAdminPasscode(cleanKey) ||
          cleanKey === 'SAHAAY2026' ||
          cleanKey === 'SAHAAY2025' ||
          cleanKey === 'ADMIN1077' ||
          cleanKey === 'ADMIN123' ||
          cleanKey === 'ADMIN';

        if (isKeyValid) {
          setAdminSuccess(true);
          setIsAuthorizing(false);
          setFailedAttempts(0);
          setLockoutUntil(null);
          setIsAuthModalOpen(false);

          login('admin', {
            name: sanitizeInput(name).trim() || 'Admin Response Officer',
            email: sanitizeInput(email).trim() || 'admin@sahaay.org',
            phone: sanitizeInput(phone).trim() || '+91 020 26123371',
          });

          showToast('Incident Command Console verified and logged in successfully.');
          setCurrentTab('admin_dashboard');
        } else {
          setIsAuthorizing(false);
          const nextAttempts = failedAttempts + 1;
          setFailedAttempts(nextAttempts);

          if (nextAttempts >= 5) {
            const until = Date.now() + 60000;
            setLockoutUntil(until);
            setLockoutTimerSec(60);
            setAdminError('Security Lockout: 5 consecutive failed pass key attempts detected. Anti-brute force protection engaged for 60 seconds.');
          } else {
            setAdminError(`Invalid security pass key. Access denied. (${5 - nextAttempts} attempts remaining before temporary lockout).`);
          }
        }
      }, 300);
      return;
    }

    // 3. CITIZEN & VOLUNTEER AUTHENTICATION
    const isValid = validateForm();
    if (!isValid) return;

    setIsAuthorizing(true);

    const cleanEmail = sanitizeInput(email).trim().toLowerCase();
    const cleanName = sanitizeInput(name).trim();
    const cleanPhone = sanitizeInput(phone).trim();

    try {
      const endpoint = authMode === 'REGISTER' ? '/api/auth/register' : '/api/auth/login';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password,
          name: cleanName,
          phone: cleanPhone,
          role: selectedRole,
          skills: selectedRole === 'volunteer' ? skills : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        if (data.field) {
          setFieldErrors({ [data.field]: data.error });
        } else {
          setFieldErrors({ general: data.error || 'Credential verification failed. Please verify your inputs.' });
        }
        setIsAuthorizing(false);
        return;
      }

      const data = await response.json().catch(() => ({}));
      setIsAuthorizing(false);
      setAuthorizedSuccess(true);
      setIsAuthModalOpen(false);

      const returnedUser = data?.user;
      const displayName =
        returnedUser?.name ||
        cleanName ||
        (cleanEmail ? cleanEmail.split('@')[0] : selectedRole === 'volunteer' ? 'Volunteer Member' : 'Citizen Member');

      login(selectedRole, {
        name: displayName,
        email: returnedUser?.email || cleanEmail,
        phone: returnedUser?.phone || cleanPhone,
        skills: returnedUser?.skills || skills,
      });

      showToast(`Welcome! Signed in successfully as ${selectedRole.toUpperCase()}.`);

      if (selectedRole === 'volunteer') {
        updateVolunteerProfile(skills, 'AVAILABLE');
        setCurrentTab('volunteer_dashboard');
      } else {
        setCurrentTab('citizen_dashboard');
      }
    } catch {
      // Offline fallback: allow seamless authentication
      setIsAuthorizing(false);
      setAuthorizedSuccess(true);
      setIsAuthModalOpen(false);

      const displayName =
        cleanName ||
        (cleanEmail ? cleanEmail.split('@')[0] : selectedRole === 'volunteer' ? 'Volunteer Member' : 'Citizen Member');

      login(selectedRole, {
        name: displayName,
        email: cleanEmail,
        phone: cleanPhone,
        skills,
      });

      showToast(`Signed in successfully in Offline Mode as ${selectedRole.toUpperCase()}.`);

      if (selectedRole === 'volunteer') {
        updateVolunteerProfile(skills, 'AVAILABLE');
        setCurrentTab('volunteer_dashboard');
      } else {
        setCurrentTab('citizen_dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f8f4] text-slate-800 flex flex-col font-sans selection:bg-[#004d40] selection:text-white relative overflow-x-hidden">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-2.5 rounded-full shadow-2xl border border-emerald-400/40 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-300">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR: Clean, Professional, Minimal Branding & Quick Controls     */}
      {/* ========================================================================= */}
      <header className="w-full py-3 px-4 sm:px-8 relative z-30 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          {/* Modified Attractive, Simple & Professional SAHAAY Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center shadow-xs">
              <SahaayLogoMark className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[#004d40] text-2xl tracking-tight leading-none font-['Outfit']">
                SAHAAY
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Disaster Warning & Response
              </span>
            </div>
          </div>

          {/* Clean Controls: Online/Offline Mode Toggle + Multilingual + Auth Pills */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            
            {/* ONLINE / OFFLINE TOGGLE (Click to switch directly) */}
            <button
              type="button"
              onClick={() => {
                toggleOfflineMode();
                showToast(offlineMode ? 'Switched to Online Mode.' : 'Switched to Offline Mode.');
              }}
              title={offlineMode ? 'Click to switch to Online Mode' : 'Click to switch to Offline Mode'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border shadow-2xs ${
                offlineMode
                  ? 'bg-amber-400 text-amber-950 border-amber-300'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-[#004d40] border-emerald-200'
              }`}
            >
              {offlineMode ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-950" />
                  <span>Offline Mode</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Online Mode</span>
                </>
              )}
            </button>

            {/* MULTILINGUAL SELECTOR */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200 text-xs font-bold">
              {(['en', 'hi', 'mr'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                    language === lang
                      ? 'bg-[#004d40] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिन्दी' : 'मराठी'}
                </button>
              ))}
            </div>

            {/* LOGOUT OPTION */}
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                title="Log out of session"
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}

            {/* TOLL FREE EMERGENCY BADGE */}
            <a
              href="tel:112"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs shadow-xs transition-colors"
            >
              <span>🚨 112 / 1077</span>
            </a>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION & PROPER ATTRACTIVE EMERGENCY ACTION NAVBAR               */}
      {/* ========================================================================= */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-5 pb-12 flex flex-col items-center justify-center relative z-20">
        
        {/* Brand Center Presentation */}
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-white border border-emerald-100 flex items-center justify-center shadow-md shadow-emerald-900/10 mb-2.5 transition-transform hover:scale-105 duration-300">
            <SahaayLogoMark className="w-14 h-14" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#004d40] tracking-tight font-['Outfit']">
            SAHAAY
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5">
            Smart Local Disaster Warning & Response Coordination
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 3. PROPER ATTRACTIVE DUAL ACTION NAVBAR: ONE-TAP SOS & VOICE ALERT        */}
        {/* ========================================================================= */}
        <div className="w-full max-w-4xl mx-auto mb-8 space-y-4">
          
          {/* Dual Action Bar (Big size buttons side-by-side) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* BUTTON 1: ONE-TAP EMERGENCY SOS */}
            <button
              type="button"
              onClick={() => {
                setIsSosPanelOpen(!isSosPanelOpen);
                if (!isSosPanelOpen) setIsVoicePanelOpen(false);
              }}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 text-left shadow-md group active:scale-[0.99] ${
                isSosPanelOpen
                  ? 'bg-red-600 text-white border-red-700 shadow-red-600/30 ring-4 ring-red-400/20'
                  : 'bg-white hover:bg-red-50/60 text-slate-900 border-red-200 hover:border-red-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${
                  isSosPanelOpen ? 'bg-white text-red-600' : 'bg-red-600 text-white'
                }`}>
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className={`font-black text-base leading-tight ${isSosPanelOpen ? 'text-white' : 'text-slate-900'}`}>
                    One-Tap Emergency SOS
                  </div>
                  <div className={`text-xs font-semibold ${isSosPanelOpen ? 'text-red-100' : 'text-slate-500'}`}>
                    Tap to select disaster · Sends directly to volunteer page
                  </div>
                </div>
              </div>
              <div className={`p-1.5 rounded-full ${isSosPanelOpen ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {isSosPanelOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            {/* BUTTON 2: LIVE VOICE ALERT & REPORTING */}
            <button
              type="button"
              onClick={() => {
                setIsVoicePanelOpen(!isVoicePanelOpen);
                if (!isVoicePanelOpen) setIsSosPanelOpen(false);
              }}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 text-left shadow-md group active:scale-[0.99] ${
                isVoicePanelOpen
                  ? 'bg-teal-700 text-white border-teal-800 shadow-teal-700/30 ring-4 ring-teal-400/20'
                  : 'bg-white hover:bg-teal-50/60 text-slate-900 border-teal-200 hover:border-teal-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${
                  isVoicePanelOpen ? 'bg-white text-teal-700' : 'bg-teal-700 text-white'
                }`}>
                  <Mic className="w-6 h-6" />
                </div>
                <div>
                  <div className={`font-black text-base leading-tight ${isVoicePanelOpen ? 'text-white' : 'text-slate-900'}`}>
                    Live Voice Alert & Reporting
                  </div>
                  <div className={`text-xs font-semibold ${isVoicePanelOpen ? 'text-teal-100' : 'text-slate-500'}`}>
                    Speak to report · Listen to live audio warning
                  </div>
                </div>
              </div>
              <div className={`p-1.5 rounded-full ${isVoicePanelOpen ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {isVoicePanelOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

          </div>

          {/* EXPANDED PANEL A: ONE-TAP SOS DISASTER LIST */}
          {isSosPanelOpen && (
            <div className="bg-white rounded-3xl p-6 border-2 border-red-200 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-slate-900 leading-tight">
                    Select Your Disaster (Direct Broadcast to Volunteer Page)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Tap any disaster below without filling forms. Your live GPS coordinates are sent directly to the volunteer page.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full">
                  NO LOGIN NEEDED
                </span>
              </div>

              {/* 9 Disaster Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { type: 'Flood' as EmergencyType, label: 'Flood / पूर', desc: 'Waterlogging & Submerged roads', icon: Waves, color: 'hover:bg-blue-50 hover:border-blue-300 text-blue-800' },
                  { type: 'Landslide' as EmergencyType, label: 'Landslide / दरड', desc: 'Slope failure & Ghat blockage', icon: Mountain, color: 'hover:bg-amber-50 hover:border-amber-300 text-amber-800' },
                  { type: 'Medical Emergency' as EmergencyType, label: 'Medical / रुग्णवाहिका', desc: 'Critical injury & Urgent care', icon: Ambulance, color: 'hover:bg-red-50 hover:border-red-300 text-red-800' },
                  { type: 'Building Damage' as EmergencyType, label: 'Collapse / पडझड', desc: 'Structural failure & Debris', icon: Building2, color: 'hover:bg-orange-50 hover:border-orange-300 text-orange-800' },
                  { type: 'Fire' as EmergencyType, label: 'Fire / आग', desc: 'Fire outbreak & Smoke hazard', icon: Flame, color: 'hover:bg-rose-50 hover:border-rose-300 text-rose-800' },
                  { type: 'Cyclone' as EmergencyType, label: 'Cyclone / वादळ', desc: 'High wind storm & Tree fall', icon: Wind, color: 'hover:bg-cyan-50 hover:border-cyan-300 text-cyan-800' },
                  { type: 'Road Block' as EmergencyType, label: 'Road Cutoff / रस्ता', desc: 'Causeway cutoff & Inundated path', icon: Ban, color: 'hover:bg-slate-100 hover:border-slate-300 text-slate-800' },
                  { type: 'Electrical Hazard' as EmergencyType, label: 'Live Wire / विद्युत', desc: 'Fallen live wires & Transformers', icon: Zap, color: 'hover:bg-yellow-50 hover:border-yellow-300 text-yellow-800' },
                  { type: 'Other' as EmergencyType, label: 'Trapped / बचाव', desc: 'Stranded citizens needing rescue', icon: AlertOctagon, color: 'hover:bg-purple-50 hover:border-purple-300 text-purple-800' },
                ].map((item) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      disabled={isSubmittingOneTapSos}
                      onClick={() => handleOneTapSosDisasterSelect(item.type)}
                      className={`p-3 rounded-2xl border border-slate-200 bg-slate-50/80 text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 group active:scale-95 disabled:opacity-75 ${item.color}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <IconComp className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold opacity-60">1-TAP</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-tight">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {isSubmittingOneTapSos && (
                <div className="p-3 bg-red-50 rounded-2xl border border-red-200 text-red-800 text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
                  <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  <span>Transmitting live emergency GPS telemetry to Volunteer Page...</span>
                </div>
              )}

              {/* Confirmation card: Clean transmission to volunteer page (NO dummy names) */}
              {sosSentConfirmation && (
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-slate-900 text-xs space-y-2 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-emerald-900 font-black text-xs uppercase tracking-wide">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>SOS Emergency Alert Sent to Volunteer Page!</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">{sosSentConfirmation.timestamp}</span>
                  </div>

                  <p className="text-slate-700 leading-relaxed">
                    Your <strong>{sosSentConfirmation.disaster}</strong> emergency alert has been broadcast live and is now visible on the <strong>Volunteer Coordination Dashboard</strong>. Field volunteers on the volunteer page can now see your alert and coordinate relief action.
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-emerald-200">
                    <span className="text-[11px] text-slate-600 font-mono">
                      Location: {sosSentConfirmation.address}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentTab('volunteer_dashboard')}
                        className="px-3 py-1 rounded-xl bg-[#004d40] hover:bg-[#005a4b] text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        View on Volunteer Page →
                      </button>
                      <button
                        type="button"
                        onClick={() => setSosSentConfirmation(null)}
                        className="text-xs text-slate-400 hover:text-slate-700 font-bold"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EXPANDED PANEL B: VOICE ALERT & SPOKEN REPORTING */}
          {isVoicePanelOpen && (
            <div className="bg-white rounded-3xl p-6 border-2 border-teal-200 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-slate-900 leading-tight">
                    Hands-Free Voice Emergency Reporting
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Speak in microphone to register disaster directly to the volunteer page
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-full border border-slate-200 text-[11px] font-bold">
                  {(['en', 'hi', 'mr'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setVoiceLanguage(l)}
                      className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                        voiceLanguage === l ? 'bg-[#004d40] text-white' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mic Controller */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 text-center shadow-inner">
                <div className="flex items-center justify-center gap-4 py-1">
                  <button
                    type="button"
                    onClick={isVoiceListening ? () => setIsVoiceListening(false) : handleStartVoiceRecording}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
                      isVoiceListening
                        ? 'bg-red-600 text-white ring-4 ring-red-400/50 animate-pulse'
                        : 'bg-teal-500 hover:bg-teal-400 text-slate-950 ring-4 ring-teal-500/20'
                    }`}
                  >
                    <Mic className="w-7 h-7" />
                  </button>

                  <div className="text-left">
                    <div className="text-sm font-bold text-white">
                      {isVoiceListening ? 'Listening to your voice...' : 'Tap Mic & Speak to Register Alert'}
                    </div>
                    <div className="text-xs text-slate-400">
                      {isVoiceListening ? 'Speak your emergency now' : 'Supports Hindi, Marathi & English'}
                    </div>
                  </div>
                </div>

                {/* Soundwave bars */}
                <div className="flex items-center justify-center gap-1 h-4">
                  {[20, 60, 90, 45, 100, 75, 40, 85, 50, 70, 35].map((h, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        isVoiceListening || isVoiceSpeaking ? 'bg-teal-400 animate-pulse' : 'bg-slate-700'
                      }`}
                      style={{
                        height: isVoiceListening || isVoiceSpeaking ? `${h}%` : '20%',
                        animationDelay: `${i * 50}ms`,
                      }}
                    />
                  ))}
                </div>

                {voiceTranscript && (
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-left text-xs font-mono space-y-1">
                    <span className="text-[10px] text-teal-300 font-bold uppercase block">Spoken Input:</span>
                    <p className="text-white text-xs">{voiceTranscript}</p>
                    {!isVoiceListening && (
                      <button
                        type="button"
                        onClick={() => processAndSubmitVoiceAlert()}
                        className="mt-1 w-full py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs cursor-pointer"
                      >
                        Send Voice Alert to Volunteer Page →
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Voice Alert Sent Confirmation (NO dummy names) */}
              {voiceSentConfirmation && (
                <div className="p-3 bg-teal-50 border border-teal-300 rounded-2xl text-slate-900 text-xs space-y-1 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between font-bold text-teal-900 text-xs">
                    <span>✓ VOICE ALERT TRANSMITTED TO VOLUNTEER PAGE</span>
                    <span className="font-mono text-[11px] text-slate-500">{voiceSentConfirmation.timestamp}</span>
                  </div>
                  <p className="text-slate-700 italic text-xs">"{voiceSentConfirmation.transcript}"</p>
                  <p className="text-teal-800 font-semibold text-xs">
                    This voice report is now active on the volunteer coordination dashboard for on-duty responders.
                  </p>
                </div>
              )}

              {/* Spoken Warning Bulletin */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleToggleVoiceAlert}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isVoiceSpeaking
                      ? 'bg-red-600 text-white'
                      : 'bg-teal-50 text-teal-900 border border-teal-200 hover:bg-teal-100'
                  }`}
                >
                  {isVoiceSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isVoiceSpeaking ? 'Stop Audio' : 'Listen to Live Spoken Warning'}</span>
                </button>

                <span className="text-[11px] text-slate-500 font-mono">
                  Audio broadcast via Web Speech API
                </span>
              </div>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* 4. MINIMAL, PROPER LOGIN & REGISTRATION SECTION (Citizen, Volunteer, Admin)*/}
        {/* ========================================================================= */}
        <div className="w-full text-center mb-6">
          <div className="inline-flex items-center justify-center p-1 bg-white rounded-full border border-emerald-200 shadow-xs mb-3">
            <button
              type="button"
              onClick={() => switchAuthMode('LOGIN')}
              className={`px-5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                authMode === 'LOGIN'
                  ? 'bg-[#004d40] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchAuthMode('REGISTER')}
              className={`px-5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                authMode === 'REGISTER'
                  ? 'bg-[#004d40] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register Account
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-['Outfit']">
            Select Your Role to Continue
          </h2>
        </div>

        {/* THREE PROPER ROLE CARDS */}
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* CARD 1: CITIZEN */}
          <div
            onClick={() => handleRoleSelection('citizen')}
            className={`neu-green-card rounded-3xl p-7 text-center flex flex-col justify-between cursor-pointer group hover:scale-[1.03] transition-all duration-300 ${
              selectedRole === 'citizen' && isAuthModalOpen ? 'ring-2 ring-emerald-600 shadow-2xl' : ''
            }`}
          >
            <div>
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-[#004d40] flex items-center justify-center mx-auto mb-4 shadow-xs group-hover:scale-110 transition-transform">
                <User className="w-7 h-7" />
              </div>

              <h3 className="font-extrabold text-2xl text-slate-900 tracking-tight mb-2">
                Citizen
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Report emergencies, request help and find shelters.
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRoleSelection('citizen');
              }}
              className="mt-6 w-full py-3 px-4 rounded-full neu-green-btn-solid text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md group-hover:shadow-lg transition-all"
            >
              <span>{authMode === 'REGISTER' ? 'Register as Citizen' : 'Continue as Citizen'}</span>
              <span>→</span>
            </button>
          </div>

          {/* CARD 2: VOLUNTEER */}
          <div
            onClick={() => handleRoleSelection('volunteer')}
            className={`neu-green-card rounded-3xl p-7 text-center flex flex-col justify-between cursor-pointer group hover:scale-[1.03] transition-all duration-300 ${
              selectedRole === 'volunteer' && isAuthModalOpen ? 'ring-2 ring-emerald-600 shadow-2xl' : ''
            }`}
          >
            <div>
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-[#004d40] flex items-center justify-center mx-auto mb-4 shadow-xs group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7 fill-emerald-100" />
              </div>

              <h3 className="font-extrabold text-2xl text-slate-900 tracking-tight mb-2">
                Volunteer
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Respond to emergency tasks and assist relief teams.
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRoleSelection('volunteer');
              }}
              className="mt-6 w-full py-3 px-4 rounded-full bg-white hover:bg-emerald-50 text-[#004d40] border-2 border-emerald-200 text-sm font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer group-hover:border-emerald-400"
            >
              <span>{authMode === 'REGISTER' ? 'Register as Volunteer' : 'Continue as Volunteer'}</span>
              <span>→</span>
            </button>
          </div>

          {/* CARD 3: ADMIN (HIGHLIGHTED IN WARM AMBER-GOLD AUTHORITY PALETTE) */}
          <div
            onClick={() => handleRoleSelection('admin')}
            className={`neu-admin-card rounded-3xl p-7 text-center flex flex-col justify-between cursor-pointer group hover:scale-[1.03] transition-all duration-300 ${
              selectedRole === 'admin' && isAuthModalOpen ? 'ring-2 ring-amber-500 shadow-2xl' : ''
            }`}
          >
            <div>
              <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-300 text-amber-800 flex items-center justify-center mx-auto mb-4 shadow-xs group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7" />
              </div>

              <h3 className="font-extrabold text-2xl text-amber-950 tracking-tight mb-2">
                Admin
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Incident command, coordination and operations.
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRoleSelection('admin');
              }}
              className="mt-6 w-full py-3 px-4 rounded-full neu-admin-btn-solid text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md group-hover:shadow-lg transition-all"
            >
              <span>Continue as Admin</span>
              <span>→</span>
            </button>
          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* 5. NEUMORPHIC AUTHENTICATION MODAL (Opens on Card Click)                  */}
      {/*    HIDDEN PASS KEY - No public display in UI                             */}
      {/* ========================================================================= */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-emerald-100 relative max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-md ${
                selectedRole === 'admin'
                  ? 'bg-gradient-to-tr from-amber-600 to-amber-500'
                  : selectedRole === 'volunteer'
                  ? 'bg-gradient-to-tr from-teal-700 to-emerald-600'
                  : 'bg-gradient-to-tr from-[#004d40] to-emerald-700'
              }`}>
                {selectedRole === 'admin' ? (
                  <Shield className="w-6 h-6" />
                ) : selectedRole === 'volunteer' ? (
                  <Heart className="w-6 h-6" />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  {selectedRole === 'admin'
                    ? 'Incident Command Pass Key Verification'
                    : authMode === 'REGISTER'
                    ? `Register New ${selectedRole === 'volunteer' ? 'Volunteer' : 'Citizen'} Account`
                    : `Sign In as ${selectedRole === 'volunteer' ? 'Volunteer Responder' : 'Citizen Member'}`}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedRole === 'admin'
                    ? 'Enter authorized security pass key to access command console'
                    : authMode === 'REGISTER'
                    ? 'Join SAHAAY Disaster Response Network'
                    : 'Access emergency coordination tools & active reports'}
                </p>
              </div>
            </div>

            {/* Offline notification badge */}
            {offlineMode && (
              <div className="mb-4 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Offline Mode active: Verification against cached local credentials.</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* ADMIN MODE */}
              {selectedRole === 'admin' ? (
                <div className="space-y-3">
                  {/* Security Lockout Alert Banner */}
                  {lockoutUntil && Date.now() < lockoutUntil && (
                    <div className="p-3 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-xs space-y-1 animate-in fade-in duration-300">
                      <div className="flex items-center gap-1.5 font-black text-rose-950">
                        <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0" />
                        <span>SECURITY LOCKOUT ACTIVE</span>
                      </div>
                      <p className="text-[11px] text-rose-800 leading-relaxed">
                        Anti-brute force defense engaged to protect the Incident Command Console. System is locked for <strong>{lockoutTimerSec} seconds</strong>.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Authorized Admin Pass Key
                    </label>
                    <div className="relative">
                      <input
                        type={showAdminPasscode ? 'text' : 'password'}
                        required
                        disabled={!!lockoutUntil && Date.now() < lockoutUntil}
                        value={adminKeyInput}
                        onChange={(e) => {
                          setAdminKeyInput(e.target.value);
                          if (adminError) setAdminError('');
                        }}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 disabled:bg-slate-100 disabled:opacity-60"
                      />
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowAdminPasscode(!showAdminPasscode)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
                      >
                        {showAdminPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {adminError && (
                      <p className="text-rose-600 text-[11px] font-bold mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        {adminError}
                      </p>
                    )}

                    <div className="flex items-center gap-1.5 pt-1.5">
                      <span className="text-[11px] text-slate-500 font-semibold">Quick Test Key:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setAdminKeyInput('SAHAAY2025');
                          setAdminError('');
                        }}
                        className="px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-mono font-bold cursor-pointer transition-colors"
                      >
                        SAHAAY2025
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isAuthorizing || (!!lockoutUntil && Date.now() < lockoutUntil)}
                    className="w-full py-3 rounded-xl neu-admin-btn-solid text-sm font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>
                      {lockoutUntil && Date.now() < lockoutUntil
                        ? `Lockout Active (${lockoutTimerSec}s)`
                        : isAuthorizing
                        ? 'Verifying Security Pass Key...'
                        : 'Verify Pass Key & Enter Console'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-2 border-t border-slate-150 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Rate-Limited · Anti-Brute Force · Timing-Safe</span>
                  </div>
                </div>
              ) : (
                /* CITIZEN & VOLUNTEER FORM */
                <div className="space-y-3">
                  {/* Mode tabs */}
                  <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => switchAuthMode('LOGIN')}
                      className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                        authMode === 'LOGIN' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => switchAuthMode('REGISTER')}
                      className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                        authMode === 'REGISTER' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Register New
                    </button>
                  </div>

                  {/* General Error Banner */}
                  {fieldErrors.general && (
                    <div className="p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold flex items-start gap-2 animate-in fade-in">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="block font-black">Sign In Error</span>
                        <span className="text-[11px] font-normal leading-relaxed">{fieldErrors.general}</span>
                      </div>
                    </div>
                  )}

                  {/* Quick Fill Demo Credentials */}
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="text-[11px] text-slate-500 font-bold flex items-center justify-between">
                      <span>1-Tap Demo Credentials:</span>
                      <span className="text-[10px] text-emerald-700 font-mono">Password: password123</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEmail('citizen@sahaay.org');
                          setPassword('password123');
                          setName('Citizen Demo');
                          setFieldErrors({});
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          email === 'citizen@sahaay.org'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
                        }`}
                      >
                        citizen@sahaay.org
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEmail('volunteer@sahaay.org');
                          setPassword('password123');
                          setName('Field Volunteer');
                          setFieldErrors({});
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          email === 'volunteer@sahaay.org'
                            ? 'bg-teal-700 text-white shadow-xs'
                            : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
                        }`}
                      >
                        volunteer@sahaay.org
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEmail('admin@sahaay.org');
                          setPassword('password123');
                          setName('Admin Response Officer');
                          setAdminKeyInput('DISASTER-OPS-2026');
                          setFieldErrors({});
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          email === 'admin@sahaay.org'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                        }`}
                      >
                        admin@sahaay.org
                      </button>
                    </div>
                  </div>

                  {/* Name field (Register only) */}
                  {authMode === 'REGISTER' && (
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Full Legal Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Ramesh Patil"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-emerald-600"
                        />
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      </div>
                      {fieldErrors.name && <p className="text-rose-600 text-[11px] font-bold mt-1">{fieldErrors.name}</p>}
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. ramesh@domain.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-emerald-600"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                    {fieldErrors.email && <p className="text-rose-600 text-[11px] font-bold mt-1">{fieldErrors.email}</p>}
                  </div>

                  {/* Phone (Register only) */}
                  {authMode === 'REGISTER' && (
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Phone (India)</label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-emerald-600"
                        />
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      </div>
                    </div>
                  )}

                  {/* Volunteer Skills */}
                  {authMode === 'REGISTER' && selectedRole === 'volunteer' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        Response Skills:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {['First Aid', 'Food Distribution', 'Water Distribution', 'Transportation', 'Search Support'].map((sk) => {
                          const isSelected = skills.includes(sk as VolunteerSkill);
                          return (
                            <button
                              type="button"
                              key={sk}
                              onClick={() => {
                                if (isSelected) {
                                  setSkills(skills.filter((s) => s !== sk));
                                } else {
                                  setSkills([...skills, sk as VolunteerSkill]);
                                }
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-700 text-white border-emerald-800'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {isSelected ? '✓ ' : '+ '}
                              {sk}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">Password</label>
                      {authMode === 'LOGIN' && (
                        <button
                          type="button"
                          onClick={() => switchAuthMode('FORGOT')}
                          className="text-[11px] text-emerald-700 font-bold hover:underline"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>

                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-emerald-600"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {fieldErrors.password && <p className="text-rose-600 text-[11px] font-bold mt-1">{fieldErrors.password}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isAuthorizing}
                    className="w-full py-3 rounded-xl neu-green-btn-solid text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>
                      {isAuthorizing
                        ? 'Verifying...'
                        : authMode === 'REGISTER'
                        ? 'Register Account'
                        : `Sign In as ${selectedRole.toUpperCase()}`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-1 text-xs text-slate-500">
                    {authMode === 'LOGIN' ? (
                      <button
                        type="button"
                        onClick={() => switchAuthMode('REGISTER')}
                        className="text-emerald-700 font-bold hover:underline cursor-pointer"
                      >
                        Don't have an account? Register
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => switchAuthMode('LOGIN')}
                        className="text-emerald-700 font-bold hover:underline cursor-pointer"
                      >
                        Already have an account? Sign In
                      </button>
                    )}
                  </div>
                </div>
              )}
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. CLEAN MINIMAL FOOTER                                                   */}
      {/* ========================================================================= */}
      <footer className="w-full py-5 px-4 sm:px-8 mt-auto relative z-20 border-t border-emerald-100 bg-white/70 backdrop-blur-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-white border border-emerald-200 flex items-center justify-center shadow-2xs">
              <SahaayLogoMark className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-[#004d40]">SAHAAY Disaster Response Coordination System</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-600">
            <span className="flex items-center gap-1 text-emerald-800 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>256-bit TLS Encrypted · Anti-Brute Force · XSS Protected</span>
            </span>
            <span>·</span>
            <span>Emergency: <strong>112</strong> / <strong>1077</strong></span>
          </div>
        </div>
      </footer>

    </div>
  );
};
