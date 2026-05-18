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
      content:
        "Вітаю!\nЯ ваш персональний помічник. Допоможу знайти україномовний контент, який відповідає вашим вподобанням. Напишіть запит або оберіть шаблон — і разом відкриємо щось нове!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
        setMessages((prev) => [...prev, { role: "assistant", content: "Вибач, сталася технічна помилка." }]);
      } else if (res.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: res.reply }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Вибач, не вдалося отримати відповідь." }]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    { label: "Летсплеєри по S.T.A.L.K.E.R.", emoji: "🇺🇸" },
    { label: "Персоналізовані рекомендації", emoji: null },
    { label: "Очистити підписки від російського*", emoji: null },
    { label: "Аналізувати мій YouTube для рекомендацій*", emoji: null },
  ];

  const showSuggestions = messages.length === 1;

  return (
    <div className="flex flex-1 flex-col justify-between gap-4">
      <div className="max-h-[52vh] flex-1 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
            {msg.role === "assistant" && index === 0 ? (
              <div className="mb-1 flex w-full items-center justify-between px-1">
                <span className="text-[14px] font-semibold text-[#0f3a61]">Помічник</span>
                <span className="text-[11px] text-[#9da8b2]">11:34</span>
              </div>
            ) : msg.role === "assistant" ? (
              <span className="mb-1 pl-1 text-[14px] font-semibold text-[#0f3a61]">Помічник</span>
            ) : null}
            <div
              className={`max-w-[90%] whitespace-pre-line rounded-[8px] px-4 py-3 text-[14px] leading-normal ${
                msg.role === "user" ? "bg-[#207cd3] text-white" : "bg-[#d4e7fa] text-[#134c80]"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading ? (
          <div className="rounded-[8px] bg-[#d4e7fa] px-4 py-3 text-sm text-[#134c80]">Думаю…</div>
        ) : null}
        <div ref={messagesEndRef} />

      </div>

      {showSuggestions ? (
        <div className="flex flex-col gap-2">
          {samplePrompts.map((prompt) => (
            <button
              key={prompt.label}
              type="button"
              onClick={() => handleSend(prompt.label)}
              className="flex h-10 w-fit max-w-full items-center gap-2 rounded-[10px] bg-[#ebeff2] px-4 text-left text-[14px] font-bold text-[#0f3a61]"
            >
              {prompt.emoji ? <span>{prompt.emoji}</span> : null}
              <span>{prompt.label}</span>
            </button>
          ))}
          <p className="text-[11px] leading-normal text-[#686e74]">
            *Потрібна авторизація через YouTube для деяких функцій!
          </p>
        </div>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введіть повідомлення."
          className="h-[54px] w-[256px] max-w-[calc(100%-88px)] flex-1 rounded-[8px] border-2 border-[#bbdbf8] bg-white px-4 text-[16px] text-[#0f3a61] outline-none placeholder:text-[#9da8b2]"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-10 w-20 shrink-0 items-center justify-center rounded-[8px] bg-[#207cd3] text-white disabled:opacity-50"
          aria-label="Надіслати"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  );
}
