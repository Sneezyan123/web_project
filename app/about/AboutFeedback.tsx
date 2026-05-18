"use client";

import { useState } from "react";

export function AboutFeedback() {
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!message.trim() || isSubmitted) return;
    setIsSubmitted(true);
  }

  return (
    <form className="flex w-full max-w-[344px] flex-col gap-2" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-1.5">
        <span className="text-[16px] text-black">Напишіть пропозиції</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          disabled={isSubmitted}
          placeholder='Напр. "Додати коментарі"'
          className="min-h-[180px] w-full resize-none rounded-[8px] border-2 border-[#bbdbf8] bg-white px-3.5 py-3 text-[16px] text-[#0f3a61] outline-none transition-colors placeholder:text-[#9da8b2] focus:border-[#207cd3] disabled:opacity-70"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitted || !message.trim()}
        className={`flex h-10 w-full items-center justify-center rounded-[8px] px-3 text-[16px] font-semibold text-white transition-colors ${
          isSubmitted ? "bg-[#828e99]" : "bg-[#207cd3] hover:bg-[#1a6bb8] disabled:opacity-70"
        }`}
      >
        {isSubmitted ? "Відправлено. Дякуємо!" : "Відправити"}
      </button>
    </form>
  );
}
