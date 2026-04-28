"use client";

import { useState } from "react";
import Link from "next/link";

export default function AddChannelPage() {
  const [submitted, setSubmitted] = useState(false);
  const [url, setUrl] = useState("");
  const [about, setAbout] = useState("");
  const [topic, setTopic] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !about || !topic) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white min-h-screen font-sans text-gray-900 max-w-md mx-auto relative shadow-xl px-6 pt-24 flex flex-col items-start gap-5">
        <h1 className="text-[28px] font-bold text-blue-900">Дякуємо!</h1>
        
        <div className="flex flex-col gap-1 text-gray-800 text-[14px] leading-relaxed">
          <p className="font-bold">Канал успішно надіслано на розгляд.</p>
          <p>Після перевірки модераторами він може з&apos;явитися на сайті. Ви можете відстежувати статус у своєму акаунті.</p>
          <p>Разом популяризуємо український контент!</p>
        </div>

        <button 
          onClick={() => setSubmitted(false)}
          className="w-full h-12 rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center shadow-sm transition-all mt-4"
        >
          Зрозуміло!
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 max-w-md mx-auto relative shadow-xl px-6 pt-6 flex flex-col pb-10 justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[24px] font-bold text-blue-900 pl-1">Додати ютуб-канал</h1>
          <Link href="/" aria-label="Закрити" className="p-2 -mr-2 text-gray-900 hover:opacity-70 transition-opacity">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Link>
        </div>

        <div className="flex flex-col gap-1 text-[13px] text-gray-800 font-medium pl-1 leading-relaxed">
          <p className="font-bold">Увага: розглядаються лише україномовні канали, російськомовні не додаються!</p>
          <p>Перевірте, чи каналу ще немає на сайті. Статус запиту можна відстежувати в акаунті.</p>
        </div>

        <form className="flex flex-col gap-5 mt-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-[14px] text-gray-700 font-medium pl-1">URL-адреса каналу<span className="text-red-500">*</span></label>
            <input
              className="h-12 w-full rounded-[12px] border border-blue-200 bg-white px-4 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all placeholder-gray-400 font-medium"
              placeholder="Введіть посилання на канал."
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] text-gray-700 font-medium pl-1">Опис каналу (до 1000 символів)<span className="text-red-500">*</span></label>
            <div className="border border-blue-200 rounded-[12px] flex flex-col p-4 bg-white focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
              <textarea
                className="w-full h-36 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400 font-medium resize-none"
                placeholder="Введіть опис каналу."
                maxLength={1000}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                required
              />
              <div className="flex items-center gap-4 text-blue-400 font-black text-sm mt-2 select-none border-t border-gray-100 pt-2 pl-1">
                <span className="cursor-pointer hover:text-blue-600">B</span>
                <span className="cursor-pointer hover:text-blue-600 italic">I</span>
                <span className="cursor-pointer hover:text-blue-600 font-bold">H</span>
                <span className="cursor-pointer hover:text-blue-600">&ldquo;&rdquo;</span>
                <span className="cursor-pointer hover:text-blue-600">🔗</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] text-gray-700 font-medium pl-1">Оберіть тематику каналу (до 3 категорій)<span className="text-red-500">*</span></label>
            <input
              className="h-12 w-full rounded-[12px] border border-blue-200 bg-white px-4 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all placeholder-gray-400 font-medium"
              placeholder="Напишіть тематику."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all mt-4 flex items-center justify-center shadow-sm"
          >
            Відправити
          </button>
        </form>
      </div>
    </div>
  );
}
