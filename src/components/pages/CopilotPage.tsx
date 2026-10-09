import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../services/store';
import { askCopilot, CopilotResponse } from '../../services/geminiService';
import {
  Bot,
  Send,
  User,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Languages,
  Mic,
  Volume2,
  Trash2,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}

export const CopilotPage: React.FC = () => {
  const { user, alerts, updateUser, t } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'assistant',
      text:
        user.language === 'hi'
          ? 'नमस्ते! मैं अलर्टस्फेयर इमरजेंसी कोपायलट हूँ। वर्तमान में आपके क्षेत्र में सक्रिय आपदाओं के अनुसार मैं आपको आपातकालीन सुरक्षा, गो-बैग तैयारी और शरण स्थलों की जानकारी दे सकता हूँ। आप क्या जानना चाहते हैं?'
          : user.language === 'mr'
          ? 'नमस्कार! मी अलर्टस्फेयर इमर्जन्सी कोपायलट आहे. आपत्कालीन परिस्थितीमध्ये मी आपल्याला तातडीच्या सुरक्षिततेच्या उपायांबद्दल आणि सुरक्षित निवारण केंद्रांबद्दल मार्गदर्शन करू शकतो. मी आपल्याला कशी मदत करू?'
          : 'Greetings. I am your AlertSphere Emergency Response Copilot. I analyze active official civil defense advisories to give you concise, life-saving safety guidance in simple steps. What is your immediate question or situation?',
      timestamp: 'Just now',
      source: 'AlertSphere Disaster Safety Engine',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickPrompts = [
    {
      en: 'What should I pack in my Go-Bag right now?',
      hi: 'मुझे अपनी आपातकालीन किट (Go-Bag) में अभी क्या रखना चाहिए?',
      mr: 'आपत्कालीन बॅग (Go-Bag) मध्ये त्वरित काय ठेवावे?',
    },
    {
      en: 'My street is starting to flood, what are my immediate steps?',
      hi: 'मेरी सड़क पर पानी भर रहा है, मुझे तुरंत क्या करना चाहिए?',
      mr: 'माझ्या गल्लीत पाणी भरत आहे, मी त्वरित काय करावे?',
    },
    {
      en: 'How to safely turn off main gas and power breakers?',
      hi: 'घर की मुख्य बिजली और गैस सिलेंडर कैसे सुरक्षित बंद करें?',
      mr: 'मुख्य वीज आणि गॅस पुरवठा सुरक्षितपणे कसा बंद करावा?',
    },
    {
      en: 'What are the rules for moving to an evacuation shelter?',
      hi: 'राहत शिविर में जाने के क्या नियम और आवश्यक सावधानियां हैं?',
      mr: 'निवारण केंद्रात जाण्यासाठी काय खबरदारी घ्यावी?',
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const activeContext = alerts.map((a) => ({
        title: a.title,
        severity: a.severity,
        location: a.locationName,
        metrics: a.metrics,
      }));

      const res = await askCopilot(
        text,
        activeContext,
        user.language,
        user.savedLocations[0]?.name || 'Mumbai Urban Area'
      );

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: res.source,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeakingId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeakingId(null);
      window.speechSynthesis.speak(utterance);
      setIsSpeakingId(msgId);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'reset',
        sender: 'assistant',
        text: 'Chat history cleared. How may I assist your safety today?',
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-white">Emergency AI Copilot</h1>
                <span className="bg-teal-500/10 text-teal-400 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-500/20">
                  Multilingual Safety Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ground-truth safety advice mapped to active verified civil alerts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Quick Toggle */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-xs">
              <button
                onClick={() => updateUser({ language: 'en' })}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  user.language === 'en' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => updateUser({ language: 'hi' })}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  user.language === 'hi' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => updateUser({ language: 'mr' })}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  user.language === 'mr' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                }`}
              >
                मराठी
              </button>
            </div>

            <button
              onClick={handleClearChat}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="bg-blue-950/40 border-b border-blue-500/20 px-4 py-2 text-center text-xs text-blue-300">
        <span>In case of trapped persons or life-threatening trauma, call </span>
        <strong className="text-white underline font-bold">National Emergency: 112</strong>
        <span> immediately.</span>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-xl rounded-2xl p-4 shadow-xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <div className="flex items-center gap-2">
                      {msg.source && <span className="text-slate-500">{msg.source}</span>}
                      <button
                        onClick={() => handleSpeak(msg.id, msg.text)}
                        className={`hover:text-cyan-400 transition ${
                          isSpeakingId === msg.id ? 'text-cyan-400 animate-pulse font-bold' : ''
                        }`}
                        title="Read aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
              <span>Emergency Copilot is synthesizing verified safety steps...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="max-w-4xl w-full mx-auto px-4 pb-2">
        <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>Quick Safety Inquiries:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {quickPrompts.map((p, idx) => {
            const label = p[user.language] || p.en;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(label)}
                className="whitespace-nowrap bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-300 transition shrink-0"
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-slate-900 border-t border-slate-800 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="max-w-4xl mx-auto flex items-center gap-3"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              user.language === 'hi'
                ? 'आपातकालीन प्रश्न पूछें (उदा. क्या नल का पानी पीना सुरक्षित है?)...'
                : user.language === 'mr'
                ? 'आपत्कालीन प्रश्न विचारा (उदा. मला सुरक्षित निवारा कुठे मिळेल?)...'
                : 'Ask emergency questions (e.g., Is tap water safe to drink after flooding?)...'
            }
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-cyan-600/30 cursor-pointer"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
