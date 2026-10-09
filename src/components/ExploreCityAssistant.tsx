import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  Square, 
  X, 
  Sparkles, 
  RefreshCw, 
  ExternalLink,
  Languages,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { sendAssistantChatMessage, AssistantChatResponse } from '../services/geminiService';
import { NavigationPage, PlaceCategory } from '../types';

export type AssistantLanguage = 'en-IN' | 'hi-IN' | 'mr-IN';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
  action?: any;
  sources?: Array<{ name: string; url: string }>;
}

interface Props {
  activeTab: NavigationPage;
  setActiveTab: (tab: NavigationPage) => void;
  onFilterCategory?: (category: PlaceCategory | 'all') => void;
  onSearchQuery?: (query: string) => void;
  onOpenReportDraft?: (draft: { title?: string; description?: string; category?: string }) => void;
}

export const ExploreCityAssistant: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  onFilterCategory,
  onSearchQuery,
  onOpenReportDraft,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<AssistantLanguage>('en-IN');
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState(false); // default OFF per prompt

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Suggested prompts per language
  const suggestedPromptsByLang: Record<AssistantLanguage, string[]> = {
    'en-IN': [
      'Plan a Pune heritage and food tour under ₹500',
      'Explain the Maratha history of Shaniwar Wada',
      'Best places for authentic Misal Pav on FC Road',
      'How to explore Koregaon Park on a budget?'
    ],
    'hi-IN': [
      'पुणे में ₹500 के अंदर हेरिटेज और स्ट्रीट फूड ट्रिप बताओ',
      'शनिवार वाडा और पेशवाओं का इतिहास समझाओ',
      'एफसी रोड पर सबसे अच्छी मिसळ कहाँ मिलेगी?',
      'पुणे में आज घूमने के लिए क्या सलाह है?'
    ],
    'mr-IN': [
      'पुण्यात ₹५०० च्या बजेटमध्ये ऐतिहासिक ठिकाणं आणि मिसळ सुचव',
      'शनिवार वाड्याचा पेशवेकालीन इतिहास सांगा',
      'एफसी रोडवर कॉलेज कट्टा आणि नाश्ता कुठे चांगला मिळतो?',
      'पुण्यातील स्थानिक रस्ते निरीक्षणाचा रिपोर्ट कसा करावा?'
    ],
  };

  // Welcome message when opened for the first time
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-001',
          role: 'assistant',
          text:
            language === 'mr-IN'
              ? 'नमस्कार! मी एक्सप्लोर सिटी असिस्टंट आहे. शनिवार वाडा, एफसी रोडची खाद्यसंस्कृती, पाताळेश्वर लेणी किंवा बजेट अ‍ॅडव्हेंचरबद्दल मला मराठीत काहीही विचारा.'
              : language === 'hi-IN'
              ? 'नमस्ते! मैं एक्सप्लोर सिटी पुणे असिस्टेंट हूँ। शनिवार वाडा, एफसी रोड का खान-पान, पातालेश्वर गुफा या बजट यात्रा के बारे में मुझसे पूछिए!'
              : 'Namaskar! I am your Explore City Pune Assistant. Ask me to plan a heritage walk, recommend authentic Puneri misal, compare places, or prepare an itinerary under ₹500!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedPrompts: suggestedPromptsByLang[language],
        },
      ]);
    }
  }, [language]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Cleanup speech synthesis and recognition on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Web Speech API: Voice Recognition
  const toggleVoiceInput = () => {
    setVoiceError(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError('Voice input is not supported by your current browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = language;
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputMessage(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setVoiceError('Microphone permission denied. Please allow microphone access.');
        } else {
          setVoiceError(`Voice recognition error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      setVoiceError(err.message || 'Failed to start speech recognition.');
      setIsListening(false);
    }
  };

  // Browser-native SpeechSynthesis
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isMuted) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 1.0;

    // Try finding matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(language.split('-')[0]));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Execute application actions returned by Gemini
  const handleExecuteAction = (action: any) => {
    if (!action || action.type === 'none') return;

    if (action.targetTab) {
      setActiveTab(action.targetTab as NavigationPage);
    }

    if (action.type === 'filter_category' && action.payload?.category && onFilterCategory) {
      onFilterCategory(action.payload.category as PlaceCategory);
      setActiveTab('places');
    }

    if (action.type === 'search_places' && action.payload?.searchQuery && onSearchQuery) {
      onSearchQuery(action.payload.searchQuery);
      setActiveTab('places');
    }

    if (action.type === 'draft_report' && action.payload?.reportDraft && onOpenReportDraft) {
      onOpenReportDraft(action.payload.reportDraft);
    }
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isProcessing) return;

    stopSpeaking();

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      const history = messages.slice(-4).map(m => ({
        role: m.role,
        text: m.text,
      }));

      const res: AssistantChatResponse = await sendAssistantChatMessage({
        message: query,
        history,
        language,
        currentTab: activeTab,
      });

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: res.suggestedPrompts,
        action: res.action,
        sources: res.sources,
      };

      setMessages(prev => [...prev, assistantMsg]);

      // If action is attached, execute it
      if (res.action && res.action.type !== 'none') {
        handleExecuteAction(res.action);
      }

      // If autoplay speech is enabled
      if (autoPlayAudio && !isMuted) {
        speakText(res.reply);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: 'Sorry, I encountered an issue processing your request. Please try again or check your connection.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear chat with confirmation
  const handleClearChat = () => {
    if (window.confirm('Clear your conversation history with Explore City Assistant?')) {
      stopSpeaking();
      setMessages([
        {
          id: 'welcome-fresh',
          role: 'assistant',
          text:
            language === 'mr-IN'
              ? 'संभाषण रीसेट झाले. शनिवार वाडा, एफसी रोड किंवा बजेट ट्रिपबद्दल मला काहीही विचारा.'
              : language === 'hi-IN'
              ? 'बातचीत रीसेट हो गई है। पुणे हेरिटेज या एडवेंचर के बारे में पूछिए!'
              : 'Conversation reset. How can I assist your Pune adventure today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedPrompts: suggestedPromptsByLang[language],
        },
      ]);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-[2000]">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Explore City Assistant"
            className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-amber-500 via-brand-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 font-bold rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95 border border-white/20"
          >
            <div className="relative">
              <Bot className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse border-2 border-slate-950" />
            </div>
            <span className="text-xs tracking-wide font-heading">
              Explore City Assistant
            </span>
          </button>
        ) : null}
      </div>

      {/* Floating Assistant Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-[2500] w-[calc(100vw-2rem)] sm:w-[440px] h-[580px] max-h-[85vh] bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          
          {/* Header */}
          <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-cyan-500 p-0.5 shadow-glow-amber">
                <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-white font-heading">
                  Explore City Assistant
                </h3>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Gemini 3.8 Flash • Pune Edition
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Voice controls */}
              {isSpeaking ? (
                <button
                  onClick={stopSpeaking}
                  title="Stop speaking"
                  className="p-1.5 text-amber-400 hover:text-white rounded-lg hover:bg-slate-700/50"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              ) : (
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  title={isMuted ? 'Unmute voice output' : 'Mute voice output'}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              )}

              {/* Clear chat */}
              <button
                onClick={handleClearChat}
                title="Clear conversation"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              {/* Close */}
              <button
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Language Selector Bar */}
          <div className="px-3 py-1.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1 text-slate-400">
              <Languages className="w-3.5 h-3.5 text-amber-400" />
              <span>Language:</span>
            </div>
            <div className="flex items-center gap-1">
              {(
                [
                  { code: 'en-IN', label: 'English' },
                  { code: 'hi-IN', label: 'हिंदी' },
                  { code: 'mr-IN', label: 'मराठी' },
                ] as const
              ).map(l => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                    language === l.code
                      ? 'bg-amber-500 text-slate-950 shadow-glow-amber'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none shadow-md'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Actions pill inside message */}
                  {msg.action && msg.action.type !== 'none' && (
                    <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Triggered: {msg.action.type.replace('_', ' ')}
                      </span>
                      <button
                        onClick={() => handleExecuteAction(msg.action)}
                        className="px-2 py-0.5 bg-amber-500 text-slate-950 font-bold rounded text-[9px] hover:bg-amber-400 transition"
                      >
                        View Tab ↗
                      </button>
                    </div>
                  )}

                  {/* Grounding Source Citation */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-1 border-t border-slate-700/50 flex flex-wrap gap-1 text-[9px] text-slate-400">
                      <span>Source:</span>
                      {msg.sources.map((s, idx) => (
                        <a
                          key={idx}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline flex items-center gap-0.5"
                        >
                          {s.name} <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1 px-1 text-[9px] text-slate-500">
                  <span>{msg.timestamp}</span>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="text-slate-400 hover:text-amber-400 flex items-center gap-0.5"
                      title="Read aloud"
                    >
                      <Volume2 className="w-2.5 h-2.5" /> Speak
                    </button>
                  )}
                </div>

                {/* Suggested Follow-up Prompts */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.suggestedPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-[10px] bg-slate-800/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 rounded-full px-2.5 py-1 text-left transition"
                      >
                        💡 {prompt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-center gap-2 text-xs text-amber-400 font-medium bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50 max-w-xs">
                <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                <span>Thinking via Gemini 3.8 Flash...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Voice Error Notice */}
          {voiceError && (
            <div className="px-3 py-1 bg-rose-950/80 border-t border-rose-800/80 text-rose-300 text-[10px] flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
              <span>{voiceError}</span>
            </div>
          )}

          {/* Input Controls */}
          <div className="p-3 bg-slate-950/80 border-t border-slate-800">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-xl px-2 py-1.5 focus-within:border-amber-400 transition">
              {/* Voice Input Mic Button */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2 rounded-lg transition ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Editable Text Input */}
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={
                  language === 'mr-IN'
                    ? 'पुण्याबद्दल काहीही विचारा किंवा बोला...'
                    : language === 'hi-IN'
                    ? 'पुणे के बारे में कुछ भी पूछें या बोलें...'
                    : 'Ask about Pune heritage, food, or plan a trip...'
                }
                className="w-full bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none"
              />

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isProcessing}
                className="p-2 bg-amber-500 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 rounded-lg font-bold transition shadow-glow-amber disabled:shadow-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-bar: Autoplay voice toggle & privacy disclaimer */}
            <div className="flex items-center justify-between text-[9px] text-slate-500 mt-1.5 px-1">
              <label className="flex items-center gap-1 cursor-pointer hover:text-slate-400">
                <input
                  type="checkbox"
                  checked={autoPlayAudio}
                  onChange={(e) => setAutoPlayAudio(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0 w-3 h-3"
                />
                <span>Voice Autoplay (OFF by default)</span>
              </label>

              <span>Zero paid APIs • Pune Edition</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
