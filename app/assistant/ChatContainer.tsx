"use client";

import { useState, useRef, useEffect } from "react";
import { askGroq } from "./actions";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Вітаю!\nЯ ваш персональний помічник. Допоможу знайти україномовний контент, який відповідає вашим вподобанням. Напишіть запит або оберіть шаблон — і разом відкриємо щось нове!" 
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (customMessage?: string) => {
    const userMessage = (customMessage || input).trim();
    if (!userMessage || loading) return;

    setInput("");
    const updatedMessages = [...messages, { role: "user", content: userMessage } as Message];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const res = await askGroq(updatedMessages);
      if (res.error) {
        setMessages(prev => [...prev, { role: "assistant", content: "Вибач, сталася технічна помилка." }]);
      } else if (res.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: res.reply }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Вибач, не вдалося отримати відповідь." }]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "Летсплеєри по S.T.A.L.K.E.R.",
    "Персоналізовані рекомендації",
    "Очистити підписки від російського*",
    "Аналізувати мій YouTube для рекомендацій*"
  ];

  return (
    <div className="flex flex-col flex-1 justify-between mt-4 max-h-[75vh]">
      <div className="flex-1 overflow-y-auto px-6 py-2 space-y-5 no-scrollbar">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="flex items-center gap-2 mb-1 pl-1">
                <span className="text-[14px] font-bold text-blue-900">Помічник</span>
                <span className="text-[11px] text-gray-400 font-medium">11:34</span>
              </div>
            )}
            <div 
              className={`max-w-[90%] rounded-[16px] p-4 text-[14px] leading-relaxed whitespace-pre-line shadow-sm ${
                msg.role === "user" 
                  ? "bg-blue-600 text-white font-medium" 
                  : "bg-blue-50/70 text-blue-950 font-medium border border-blue-50"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-1 pl-1">
              <span className="text-[14px] font-bold text-blue-900">Помічник</span>
            </div>
            <div className="bg-blue-50/70 text-blue-950 rounded-[16px] border border-blue-50 p-4 text-sm flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />

        {/* Template pills below helper greeting */}
        {messages.length === 1 && (
          <div className="flex flex-col items-start gap-2.5 mt-2 pl-1">
            {samplePrompts.map((p, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(p)}
                className="text-[14px] font-bold text-blue-950 bg-gray-100/80 hover:bg-gray-200/80 px-5 py-2.5 rounded-full transition-colors text-left"
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-white mt-auto">
        <span className="block text-[11px] text-gray-800 font-medium pl-2 mb-2">
          *Потрібна авторизація через YouTube для деяких функцій!
        </span>

        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введіть повідомлення."
            className="h-12 flex-1 rounded-[12px] border border-blue-200 bg-white px-4 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all text-gray-800 placeholder-gray-400 font-medium"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="w-12 h-12 rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors disabled:opacity-50 shadow-sm"
            disabled={loading || !input.trim()}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
