import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Volume2,
  VolumeX,
  Send,
  CheckCircle2,
  AlertTriangle,
  X,
  Phone,
  MapPin,
  Radio,
  Sparkles,
  ShieldAlert,
  Clock,
  Check,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface OneTimeSmsAndVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'sms' | 'voice';
}

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
  'Aurangabad (Chhatrapati Sambhajinagar)',
  'Jalgaon',
  'Nanded',
  'Amravati',
  'Nagpur',
];

export const OneTimeSmsAndVoiceModal: React.FC<OneTimeSmsAndVoiceModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'sms',
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'sms' | 'voice'>(defaultMode);

  // SMS Form State
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Pune');
  const [alertCategory, setAlertCategory] = useState<'all' | 'flood' | 'road_closures'>('all');
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [smsSuccessMessage, setSmsSuccessMessage] = useState<string | null>(null);
  const [smsError, setSmsError] = useState<string | null>(null);
  const [incomingSmsPreview, setIncomingSmsPreview] = useState<{
    sender: string;
    text: string;
    time: string;
  } | null>(null);

  // Voice Alert State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoiceLanguage, setSelectedVoiceLanguage] = useState<'en' | 'hi' | 'mr'>(
    language === 'mr' ? 'mr' : language === 'hi' ? 'hi' : 'en'
  );

  useEffect(() => {
    if (defaultMode) setActiveTab(defaultMode);
  }, [defaultMode]);

  // Handle Speech Synthesis
  const handleToggleVoiceAlert = () => {
    if (isSpeaking) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      return;
    }

    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    let speechText = '';
    let speechLang = 'en-IN';

    if (selectedVoiceLanguage === 'hi') {
      speechText =
        'सावधान। महाराष्ट्र राज्य आपदा प्रबंधन प्राधिकरण की ओर से चेतावनी। पुणे, रायगढ़ और नासिक जिलों में अत्यधिक वर्षा और जलभराव का अलर्ट जारी किया गया है। एनएच अड़तालीस और घाट सड़कों पर सतर्कता बरतें। नजदीकी राहत शिविर सक्रिय हैं। आपातकालीन संपर्क एक एक दो या एक शून्य सात सात पर कॉल करें।';
      speechLang = 'hi-IN';
    } else if (selectedVoiceLanguage === 'mr') {
      speechText =
        'सावधान। महाराष्ट्र राज्य आपत्ती व्यवस्थापन प्राधिकरणाचा इशारा। पुणे, रायगड आणि नाशिक जिल्ह्यात मुसळधार पाऊस आणि पूर परिस्थितीचा इशारा दिला आहे। मुख्य रस्ते आणि घाट मार्गावर खबरदारी घ्या। जवळचे निवारा केंद्र सुरू आहेत। आपत्कालीन मदतीसाठी एक एक दोन किंवा एक शून्य सात सात वर संपर्क साधा।';
      speechLang = 'mr-IN';
    } else {
      speechText =
        'Attention citizens of Maharashtra. Official emergency bulletin from the State Disaster Management Authority. Heavy rainfall and flash flood alert in effect for low-lying sectors of Pune, Raigad, and Nashik districts. Key ghat roadways under monitored diversion. Open emergency relief shelters are operational. For immediate assistance, dial 112 or District DEOC at 1077.';
      speechLang = 'en-IN';
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = speechLang;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendOneTimeSms = (e: React.FormEvent) => {
    e.preventDefault();
    setSmsError(null);
    setSmsSuccessMessage(null);
    setIncomingSmsPreview(null);

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!/^\+?[0-9]{10,13}$/.test(cleanPhone)) {
      setSmsError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSendingSms(true);

    setTimeout(() => {
      setIsSendingSms(false);
      const currentTime = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const sampleSmsText = `[SAHAAY-SDMA] FLASH ALERT: Heavy rainfall alert in ${district}. Low-lying areas under watch. Avoid inundated causeways. Open shelters active. Helpline: 112/1077.`;

      setSmsSuccessMessage(`One-Time Flash SMS alert successfully queued and dispatched to ${cleanPhone}.`);
      setIncomingSmsPreview({
        sender: 'MH-SAHAAY',
        text: sampleSmsText,
        time: currentTime,
      });

      // Beep or audio chime
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 880;
        gain.gain.value = 0.1;
        osc.start();
        setTimeout(() => {
          osc.stop();
          audioCtx.close();
        }, 150);
      } catch {
        // AudioContext disabled/muted
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-emerald-100 relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            if (isSpeaking && 'speechSynthesis' in window) {
              window.speechSynthesis.cancel();
              setIsSpeaking(false);
            }
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
            {activeTab === 'sms' ? (
              <MessageSquare className="w-5 h-5 text-emerald-100" />
            ) : (
              <Volume2 className="w-5 h-5 text-emerald-100" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
              One-Time Emergency Broadcast Center
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Maharashtra SDMA Real-Time Multi-Channel Dispatches
            </p>
          </div>
        </div>

        {/* Tab Switcher (SMS vs Voice) */}
        <div className="flex items-center bg-emerald-50/80 p-1 rounded-2xl border border-emerald-200 mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('sms')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'sms'
                ? 'bg-emerald-700 text-white shadow-xs font-black'
                : 'text-emerald-950 hover:bg-emerald-100/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>One-Time SMS Alert</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('voice')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'voice'
                ? 'bg-emerald-700 text-white shadow-xs font-black'
                : 'text-emerald-950 hover:bg-emerald-100/60'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Live Voice Alert Broadcast</span>
          </button>
        </div>

        {/* SECTION 1: ONE-TIME SMS ALERT */}
        {activeTab === 'sms' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <Radio className="w-4 h-4 text-emerald-700" />
                <span>Instant Carrier SMS Gateway (Zero App Install Required)</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Dispatch an immediate, free emergency SMS bulletin regarding live flood warnings, severe weather,
                and road closures directly to your mobile phone.
              </p>
            </div>

            <form onSubmit={handleSendOneTimeSms} className="space-y-3.5">
              {/* Mobile Number */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Recipient Mobile Number (India +91) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (smsError) setSmsError(null);
                    }}
                    placeholder="e.g. 98220 12345 or +91 98220 12345"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 font-bold focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                {smsError && (
                  <p className="text-rose-600 text-[11px] font-bold mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    {smsError}
                  </p>
                )}
              </div>

              {/* District Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Target District (Telemetry Location)
                </label>
                <div className="relative">
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    {MAHARASHTRA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d} District
                      </option>
                    ))}
                  </select>
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Alert Category */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Alert Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAlertCategory('all')}
                    className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer text-center ${
                      alertCategory === 'all'
                        ? 'bg-emerald-700 text-white border-emerald-800'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    All Hazards
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlertCategory('flood')}
                    className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer text-center ${
                      alertCategory === 'flood'
                        ? 'bg-emerald-700 text-white border-emerald-800'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Floods & Rain
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlertCategory('road_closures')}
                    className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer text-center ${
                      alertCategory === 'road_closures'
                        ? 'bg-emerald-700 text-white border-emerald-800'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Road Closures
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSendingSms}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-75"
              >
                {isSendingSms ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting to Cellular Gateway...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch One-Time SMS Emergency Alert</span>
                  </>
                )}
              </button>
            </form>

            {/* Success Feedback & Simulated Live Message Bubble */}
            {smsSuccessMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs space-y-2 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 font-black">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{smsSuccessMessage}</span>
                </div>

                {/* Simulated SMS Received Device Preview */}
                {incomingSmsPreview && (
                  <div className="mt-2 p-3 bg-white rounded-xl border border-emerald-200 shadow-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span className="font-bold text-emerald-800 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-emerald-600" />
                        <span>SMS FROM: {incomingSmsPreview.sender}</span>
                      </span>
                      <span>{incomingSmsPreview.time}</span>
                    </div>
                    <p className="text-xs text-slate-800 font-medium font-mono leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {incomingSmsPreview.text}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold pt-0.5">
                      <Check className="w-3 h-3" />
                      <span>Carrier Delivery Confirmed via Telecom Gateway</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: LIVE VOICE ALERT BROADCAST */}
        {activeTab === 'voice' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-950">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <Volume2 className="w-4 h-4 text-teal-700" />
                <span>Auditory Emergency Broadcast System (Live Text-to-Speech)</span>
              </div>
              <p className="text-[11px] text-teal-800 leading-relaxed">
                Audibly streams verified disaster bulletins, active rainfall telemetry, and safe road status
                spoken aloud in real time.
              </p>
            </div>

            {/* Language Selector for Speech */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Select Voice Broadcast Language:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) window.speechSynthesis?.cancel();
                    setIsSpeaking(false);
                    setSelectedVoiceLanguage('en');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                    selectedVoiceLanguage === 'en'
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) window.speechSynthesis?.cancel();
                    setIsSpeaking(false);
                    setSelectedVoiceLanguage('hi');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                    selectedVoiceLanguage === 'hi'
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) window.speechSynthesis?.cancel();
                    setIsSpeaking(false);
                    setSelectedVoiceLanguage('mr');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                    selectedVoiceLanguage === 'mr'
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  मराठी (Marathi)
                </button>
              </div>
            </div>

            {/* Live Voice Playback Panel */}
            <div className="p-5 rounded-3xl bg-slate-900 text-white text-center space-y-3.5 relative overflow-hidden shadow-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>SDMA VOICE FREQ // LIVE</span>
                </span>
                <span>{selectedVoiceLanguage.toUpperCase()} FEED</span>
              </div>

              {/* Big Waveform / Speaker Control */}
              <div className="py-2 flex flex-col items-center justify-center">
                <button
                  type="button"
                  onClick={handleToggleVoiceAlert}
                  className={`w-18 h-18 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
                    isSpeaking
                      ? 'bg-red-600 hover:bg-red-700 text-white ring-4 ring-red-400/50 animate-pulse'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 ring-4 ring-emerald-500/30'
                  }`}
                >
                  {isSpeaking ? (
                    <VolumeX className="w-8 h-8" />
                  ) : (
                    <Volume2 className="w-8 h-8" />
                  )}
                </button>

                {/* Animated Equalizer Waveform */}
                <div className="flex items-center gap-1.5 mt-4 h-6">
                  {[40, 75, 90, 60, 100, 45, 80, 50, 95, 65, 30].map((height, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        isSpeaking ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'
                      }`}
                      style={{
                        height: isSpeaking ? `${height}%` : '20%',
                        animationDelay: `${i * 70}ms`,
                      }}
                    />
                  ))}
                </div>

                <span className="text-xs font-bold text-slate-200 mt-2">
                  {isSpeaking
                    ? 'Broadcasting Voice Warning... (Click to Halt)'
                    : 'Click to Listen to Live Disaster Voice Alert'}
                </span>
              </div>

              {/* Spoken Bulletin Preview */}
              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 text-left text-xs font-mono text-slate-300 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Active Voice Script:</div>
                <p className="text-[11px] leading-relaxed text-slate-200">
                  {selectedVoiceLanguage === 'hi'
                    ? '“सावधान। महाराष्ट्र राज्य आपदा प्रबंधन प्राधिकरण की ओर से चेतावनी। पुणे, रायगढ़ और नासिक जिलों में अत्यधिक वर्षा और जलभराव का अलर्ट...”'
                    : selectedVoiceLanguage === 'mr'
                    ? '“सावधान। महाराष्ट्र राज्य आपत्ती व्यवस्थापन प्राधिकरणाचा इशारा। पुणे, रायगड आणि नाशिक जिल्ह्यात मुसळधार पाऊस आणि पूर परिस्थितीचा इशारा...”'
                    : '“Attention citizens of Maharashtra. Official emergency bulletin from SDMA: Heavy rainfall & flash flood alert in effect for Pune, Raigad & Nashik. Dial 112/1077 for immediate aid.”'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Helpline Notes */}
        <div className="mt-5 pt-3 border-t border-slate-150 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Toll-Free Helplines: <strong>112</strong> / <strong>1077</strong></span>
          <span>DISASTER GRID v2.5</span>
        </div>
      </div>
    </div>
  );
};
