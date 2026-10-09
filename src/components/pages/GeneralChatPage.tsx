import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../services/store';
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  ShieldAlert,
  Clock,
  Languages,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const GeneralChatPage: React.FC = () => {
  const {
    generalConversations,
    createGeneralConversation,
    renameGeneralConversation,
    deleteGeneralConversation,
    sendGeneralChatMessage,
    activeChatConversationId,
    setActiveChatConversationId,
    isAiGenerating,
    user,
    updateUser,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Default to first conversation or create one if empty
  const activeConversation =
    generalConversations.find((c) => c.id === activeChatConversationId) ||
    generalConversations[0] ||
    null;

  useEffect(() => {
    if (!activeChatConversationId && generalConversations.length > 0) {
      setActiveChatConversationId(generalConversations[0].id);
    }
  }, [activeChatConversationId, generalConversations]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isAiGenerating) return;

    let targetConvId = activeConversation?.id;
    if (!targetConvId) {
      targetConvId = createGeneralConversation(inputText.slice(0, 24));
    }

    const text = inputText;
    setInputText('');
    await sendGeneralChatMessage(targetConvId, text);
  };

  const handleStartRename = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitleText(currentTitle);
  };

  const handleSaveRename = (id: string) => {
    if (editTitleText.trim()) {
      renameGeneralConversation(id, editTitleText.trim());
    }
    setEditingId(null);
  };

  const promptSuggestions = [
    'How should my family prepare an evacuation Go-Bag?',
    'What are the signs of structural foundation weakening after heavy rain?',
    'How do I test my household water supply for contamination?',
    'What emergency rations have a shelf life exceeding 2 years?',
  ];

  return (
    <div className="h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex overflow-hidden">
      {/* Sidebar - Conversation History */}
      <div
        className={`${
          sidebarOpen ? 'w-80' : 'w-0'
        } transition-all duration-300 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 overflow-hidden relative`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">General AI Chat</h2>
          </div>
          <button
            onClick={() => createGeneralConversation()}
            className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-sm cursor-pointer"
            title="Start new conversation"
          >
            <Plus className="w-4 h-4" />
            <span className="text-[11px] pr-1">New Chat</span>
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-none">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1.5">
            Your Conversations ({generalConversations.length})
          </div>

          {generalConversations.map((conv) => {
            const isActive = activeConversation?.id === conv.id;
            const isEditing = editingId === conv.id;

            return (
              <div
                key={conv.id}
                onClick={() => {
                  if (!isEditing) setActiveChatConversationId(conv.id);
                }}
                className={`group flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/30 font-bold'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                {isEditing ? (
                  <div
                    className="flex items-center gap-1 flex-1 mr-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      value={editTitleText}
                      onChange={(e) => setEditTitleText(e.target.value)}
                      className="bg-slate-950 border border-cyan-500 rounded px-1.5 py-0.5 text-xs text-white flex-1"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveRename(conv.id)}
                      className="text-emerald-400 hover:text-emerald-300 p-0.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-slate-400 hover:text-white p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="truncate flex-1 pr-2">
                    <span className="block truncate">{conv.title}</span>
                    <span className="text-[10px] text-slate-500 block">
                      {new Date(conv.updatedAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}

                {!isEditing && (
                  <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartRename(conv.id, conv.title);
                      }}
                      className="text-slate-400 hover:text-white p-1 rounded"
                      title="Rename"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this conversation?')) {
                          deleteGeneralConversation(conv.id);
                        }
                      }}
                      className="text-slate-400 hover:text-red-400 p-1 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Language:</span>
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px]">
            <button
              onClick={() => updateUser({ language: 'en' })}
              className={`px-2 py-0.5 rounded font-bold ${
                user.language === 'en' ? 'bg-cyan-600 text-white' : 'text-slate-400'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => updateUser({ language: 'hi' })}
              className={`px-2 py-0.5 rounded font-bold ${
                user.language === 'hi' ? 'bg-cyan-600 text-white' : 'text-slate-400'
              }`}
            >
              HI
            </button>
            <button
              onClick={() => updateUser({ language: 'mr' })}
              className={`px-2 py-0.5 rounded font-bold ${
                user.language === 'mr' ? 'bg-cyan-600 text-white' : 'text-slate-400'
              }`}
            >
              MR
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950 relative">
        {/* Chat Top Nav Bar */}
        <div className="bg-slate-900/80 border-b border-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
              title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            <div>
              <h1 className="text-sm font-bold text-white truncate max-w-sm sm:max-w-md">
                {activeConversation?.title || 'General Disaster AI Chat'}
              </h1>
              <p className="text-[10px] text-slate-400">
                Independent safety chat with persistent multi-turn history.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20 font-bold hidden sm:inline">
              Powered by Gemini 3.8 Flash
            </span>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeConversation ? (
            activeConversation.messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
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
                    <div className="whitespace-pre-line">{msg.content}</div>

                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{msg.timestamp}</span>
                      {msg.source && <span className="text-slate-500">{msg.source}</span>}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 text-slate-500">
              <MessageSquare className="w-12 h-12 mx-auto text-slate-600 mb-2" />
              <p>No conversation selected. Click "New Chat" to begin.</p>
            </div>
          )}

          {isAiGenerating && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
                <span>Synthesizing safety guidance...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips */}
        {activeConversation && activeConversation.messages.length <= 2 && (
          <div className="px-4 pb-2">
            <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1.5">
              Suggested Safety Questions:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {promptSuggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(s);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs whitespace-nowrap transition cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Input Box */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about disaster preparedness, emergency supplies, recovery..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isAiGenerating}
              className="px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-cyan-600/30 cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
