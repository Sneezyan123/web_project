"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { PrimaryButton } from "@/components/ui/app-ui";

const inputClass =
  "h-10 w-full rounded-[8px] border-2 border-[#bbdbf8] bg-white px-3 text-[16px] font-normal text-[#0f3a61] outline-none placeholder:text-[#9da8b2] focus:border-[#207cd3]";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message ?? "Невірний email або пароль");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Не вдалося виконати вхід. Перевірте з'єднання.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 rounded-[10px] bg-[#d4e7fa] p-4">
        <p className="text-[14px] font-normal leading-normal text-black">
          Увійдіть за допомогою YouTube та отримайте більше персоналізованих пропозицій!
        </p>
        <a
          href="/api/auth/oauth/google/start"
          className="flex h-10 w-[228px] max-w-full items-center justify-center gap-2 rounded-[10px] bg-[#cf2a1e] text-[16px] font-semibold leading-[22px] text-white transition-colors hover:bg-[#b8241a]"
        >
          <img src="/figma-assets/auth-youtube.svg" alt="" className="h-[18px] w-[25px] shrink-0" />
          Увійти через YouTube
        </a>
      </div>

      <form id="login-form" className="mt-6 flex flex-col gap-3" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label className="text-[16px] font-normal leading-[22px] text-black">Email</label>
          <input
            className={inputClass}
            placeholder="Ваша електронна пошта."
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[16px] font-normal leading-[22px] text-black">Пароль</label>
          <input
            className={inputClass}
            placeholder="Ваш пароль."
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <a
          href="mailto:support@u2u.local?subject=Відновлення%20паролю"
          className="text-[14px] font-normal leading-[19px] text-black hover:underline"
        >
          Забули пароль?
        </a>

        {error ? (
          <p className="rounded-[8px] border border-[#cf2a1e]/30 bg-[#cf2a1e]/10 p-3 text-xs font-medium text-[#cf2a1e]">
            {error}
          </p>
        ) : null}
      </form>

      <div className="mt-[34px] flex flex-col items-center gap-3">
        <span className="text-[14px] font-semibold leading-[19px] text-black">Або увійти через</span>
        <div className="flex items-center gap-3">
          <a
            href="/api/auth/oauth/google/start"
            className="flex h-9 w-9 items-center justify-center"
            aria-label="Увійти через Google"
          >
            <img src="/figma-assets/auth-google.svg" alt="" className="h-9 w-9" />
          </a>
          <a
            href="/api/auth/oauth/facebook/start"
            className="flex h-9 w-9 items-center justify-center"
            aria-label="Увійти через Facebook"
          >
            <img src="/figma-assets/auth-facebook.svg" alt="" className="h-9 w-9" />
          </a>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-1">
        <PrimaryButton type="submit" form="login-form" disabled={isSubmitting} className="font-semibold">
          {isSubmitting ? "Вхід..." : "Увійти"}
        </PrimaryButton>

        <Link
          href="/auth/register"
          className="flex h-10 w-full items-center justify-center rounded-[8px] bg-white text-[16px] font-semibold leading-[22px] text-[#207cd3] transition-colors hover:bg-[#d4e7fa]"
        >
          Зареєструватись
        </Link>
      </div>
    </div>
  );
}
