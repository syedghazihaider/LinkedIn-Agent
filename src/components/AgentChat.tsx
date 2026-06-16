import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, MessageSquare, AlertCircle, HelpCircle } from 'lucide-react';
import { ChatMessage, OptimizeResponse } from '../types';

interface AgentChatProps {
  contextInfo: OptimizeResponse;
}

export default function AgentChat({ contextInfo }: AgentChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "assistant",
      content: `Hello! I am your Personal LinkedIn AI Agent 🤖 — created by Ghazi Bilgrami.

I have optimized your profile to make you stand out. What would you like to build next?

Would you like 3 more posts, a specific topic, or tips on engaging with your network?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSubmitting]);

  const quickPrompts = [
    { label: "Give me 3 more posts", text: "Please generate 3 more highly engaging LinkedIn posts based on my profile." },
    { label: "Tips on networking", text: "Can you give me specific connection and networking templates to message hiring managers?" },
    { label: "Improve my banner", text: "What graphic style should I choose for my LinkedIn custom banner, and how do I design it?" },
    { label: "Who created you?", text: "Who created this incredible LinkedIn AI Agent?" }
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    if (!customText) {
      setInputText("");
    }
    setErrorText("");

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          contextInfo: contextInfo
        })
      });

      if (!response.ok) {
        throw new Error("Chat api failed to respond.");
      }

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: data.text || "I was unable to formulate a proper response. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorText("There was an issue reaching your AI Agent. Make sure your server is online.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden flex flex-col h-[550px]" id="agent-chat-wrapper">
      {/* Mini Header */}
      <div className="bg-slate-900 text-white px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg flex items-center justify-center font-bold text-xs uppercase shrink-0">
            agent
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
              Ghazi's LinkedIn Advisor Chat
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h4>
            <p className="text-[10px] text-slate-400">Ask for banner formulas, connection lines, or post modifications</p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-slate-800 text-blue-400'
            }`}>
              {m.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
            </div>

            {/* Bubble */}
            <div className="space-y-1">
              <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
              }`}>
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
              <span className="text-[10px] text-slate-400 block px-1 text-right">
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isSubmitting && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-blue-400 flex items-center justify-center shrink-0">
              <Sparkles size={14} className="animate-spin" />
            </div>
            <div className="space-y-1">
              <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-tl-none p-3.5 shadow-xs text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
                <span>Formulating advice...</span>
              </div>
            </div>
          </div>
        )}

        {errorText && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start gap-2 text-xs text-red-700">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{errorText}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies Buttons */}
      <div className="px-5 py-2 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-2 overflow-x-auto">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-center mr-1">
          💡 Quick Prompts:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            disabled={isSubmitting}
            onClick={() => handleSendMessage(qp.text)}
            className="text-[11px] font-semibold text-slate-605 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 px-3 py-1.5 rounded-full shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1"
            id={`quick-reply-btn-${idx}`}
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Submit form */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            className="flex-1 bg-slate-50 border border-slate-250 rounded-lg p-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 placeholder:text-slate-400"
            placeholder="Type your follow-up inquiry here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isSubmitting}
            id="chat-input-field"
          />
          <button
            type="submit"
            disabled={isSubmitting || !inputText.trim()}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg p-2.5 transition-all text-sm font-semibold disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer"
            id="send-chat-btn"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
