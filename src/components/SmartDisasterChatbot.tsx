import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Phone,
  CornerDownLeft,
  RefreshCw,
  Zap,
  X,
  MessageSquare,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  actionSuggestion?: {
    label: string;
    actionTab: string;
  };
  timestamp: string;
}

interface SmartDisasterChatbotProps {
  setCurrentTab: (tab: string) => void;
}

const QUICK_PROMPTS = [
  { label: '🚨 Report SOS', query: 'How do I report an immediate emergency or flood?' },
  { label: '📍 Shelters', query: 'Where can I find safe relief shelters and food?' },
  { label: '📞 Helplines', query: 'What are the official disaster helplines and NDRF numbers?' },
  { label: '🌊 Flood Safety', query: 'What should I do immediately during severe flooding?' },
  { label: '🩹 First-Aid', query: 'Give me rapid first-aid steps for injury and bleeding.' },
];

export const SmartDisasterChatbot: React.FC<SmartDisasterChatbotProps> = ({ setCurrentTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "👋 Hi! I'm your **SAHAAY AI Assistant**. Ask me about emergency SOS reports, shelters, disaster helplines, or immediate first-aid guidance.",
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-sahaay-chatbot', handleOpen);
    return () => window.removeEventListener('open-sahaay-chatbot', handleOpen);
  }, []);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/disaster-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Emergency assistance is active. Dial 112 for immediate crisis.',
        actionSuggestion: data.actionSuggestion,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const botFallback: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: "🚨 **Immediate Alert:** Dial **112** (ERSS) or **108** (Ambulance). Tap below to submit a live SOS emergency dispatch.",
        actionSuggestion: { label: '🆘 Launch Emergency SOS', actionTab: 'report_emergency' },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botFallback]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Docked Floating Action Button at Corner when collapsed
  if (!isOpen) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 bg-gradient-to-r from-teal-800 to-teal-700 hover:from-teal-700 hover:to-teal-600 text-white pl-3 pr-4 py-2.5 sm:py-3 rounded-full shadow-2xl hover:shadow-teal-900/40 border border-teal-400/40 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          title="Open SAHAAY AI Crisis Assistant"
          aria-label="Open AI Assistant"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center font-black shadow-inner">
              <Bot className="w-4.5 h-4.5 text-slate-950" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-teal-800 rounded-full animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-teal-800 rounded-full" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-black text-white font-['Outfit'] flex items-center gap-1.5 leading-tight">
              <span>SAHAAY AI</span>
              <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.2 rounded font-mono font-bold">24/7</span>
            </div>
            <div className="text-[10px] text-teal-200 font-medium">Ask Help & Helplines</div>
          </div>
          <Sparkles className="w-4 h-4 text-teal-300 group-hover:rotate-12 transition-transform shrink-0" />
        </button>
      </div>
    );
  }

  // Floating Corner Popover Window when open
  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-50 w-[94vw] sm:w-[410px] h-[520px] max-h-[82vh] rounded-3xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col text-left animate-fade-in transition-all duration-200">
      {/* Small, Slim Header */}
      <div className="bg-slate-900 px-3.5 py-3 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-xs shrink-0">
            <Bot className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <h3 className="text-xs font-black text-white font-['Outfit']">
                SAHAAY AI Assistant
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <span className="text-[10px] text-teal-300/90 font-mono">Disaster Q&A • 24/7 Live</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setCurrentTab('emergency_contacts');
              setIsOpen(false);
            }}
            title="Direct Helplines"
            className="text-[10px] font-bold bg-rose-600/90 hover:bg-rose-600 text-white px-2 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer shrink-0"
          >
            <Phone className="w-2.5 h-2.5" />
            <span>112 Helplines</span>
          </button>
          <button
            onClick={() => setIsOpen(false)}
            title="Minimize Chatbot"
            aria-label="Close Chatbot"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Suggestion Chips (Compact single row) */}
      <div className="bg-slate-50 border-b border-slate-200 px-2.5 py-1.5 overflow-x-auto flex items-center gap-1.5 scrollbar-none shrink-0">
        <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0 flex items-center gap-0.5">
          <Zap className="w-2.5 h-2.5 text-amber-500" /> Ask:
        </span>
        {QUICK_PROMPTS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(item.query)}
            disabled={isLoading}
            className="shrink-0 text-[10px] font-semibold text-slate-700 hover:text-teal-900 bg-white hover:bg-teal-50 px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="p-3 flex-1 overflow-y-auto space-y-2.5 bg-gradient-to-b from-slate-50/50 to-white text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-6 h-6 rounded-lg bg-teal-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Sparkles className="w-3 h-3 text-teal-200" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl p-2.5 text-xs leading-relaxed shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-teal-700 text-white rounded-tr-xs'
                  : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
              }`}
            >
              <div className="whitespace-pre-line space-y-1 font-medium">
                {msg.text}
              </div>

              {msg.actionSuggestion && (
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setCurrentTab(msg.actionSuggestion!.actionTab);
                      setIsOpen(false);
                    }}
                    className="px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold rounded-lg shadow-2xs flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                  >
                    <span>{msg.actionSuggestion.label}</span>
                    <CornerDownLeft className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}

              <div
                className={`text-[9px] mt-1 font-mono ${
                  msg.sender === 'user' ? 'text-teal-200 text-right' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <User className="w-3 h-3 text-slate-200" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 justify-start items-center text-xs text-slate-500">
            <div className="w-6 h-6 rounded-lg bg-teal-800 text-white flex items-center justify-center shrink-0 shadow-xs">
              <RefreshCw className="w-3 h-3 text-teal-200 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-ping"></span>
              <span className="text-[11px] font-semibold text-slate-600">Assisting...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar (Compact) */}
      <div className="p-2 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask: 'nearest shelter', 'how to report flood'..."
          className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-2xs transition-all cursor-pointer disabled:cursor-not-allowed shrink-0 active:scale-95"
        >
          <span>Ask</span>
          <Send className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
