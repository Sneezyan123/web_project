"use client";

import { FormEvent, useState } from "react";
import { ABOUT_SUGGESTIONS_PLACEHOLDER } from "@/lib/copy";
import { PrimaryButton } from "@/components/ui/app-ui";

export function AboutSuggestionsForm() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess(false);

    const value = text.trim();
    if (!value) {
      setError("Напишіть пропозицію перед відправкою.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message ?? "Не вдалося надіслати. Спробуйте ще раз.");
        return;
      }

      setText("");
      setSuccess(true);
    } catch {
      setError("Не вдалося надіслати. Перевірте з'єднання.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label htmlFor="site-suggestion" className="pl-1 text-[14px] font-medium text-[#0f3a61]">
          Напишіть пропозиції
        </label>
        <textarea
          id="site-suggestion"
          name="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={ABOUT_SUGGESTIONS_PLACEHOLDER}
          maxLength={2000}
          disabled={isSubmitting}
          className="min-h-[114px] w-full resize-none rounded-[8px] border-2 border-[#bbdbf8] bg-white p-3 text-[14px] text-[#0f3a61] outline-none placeholder:text-[#9da8b2] focus:border-[#207cd3] disabled:opacity-60"
        />
      </div>

      {error ? (
        <p className="rounded-[8px] border border-[#cf2a1e]/30 bg-[#cf2a1e]/10 px-3 py-2 text-[13px] font-medium text-[#cf2a1e]">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="rounded-[8px] border border-[#207cd3]/30 bg-[#d4e7fa] px-3 py-2 text-[13px] font-medium text-[#0f3a61]">
          Дякуємо! Вашу пропозицію надіслано.
        </p>
      ) : null}

      <PrimaryButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Надсилання…" : "Відправити"}
      </PrimaryButton>
    </form>
  );
}
