"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Link from "next/link";

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
    <form className="flex flex-col gap-4 mt-6" onSubmit={handleSubmit}>
      {/* Email Input */}
      <div className="flex flex-col gap-2">
        <label className="text-[14px] text-gray-700 font-medium pl-1">Email</label>
        <input
          className="h-12 w-full rounded-[12px] border border-blue-200 bg-white px-4 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all placeholder-gray-400"
          placeholder="Ваша електронна пошта."
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      
      {/* Password Input */}
      <div className="flex flex-col gap-2">
        <label className="text-[14px] text-gray-700 font-medium pl-1">Пароль</label>
        <input
          className="h-12 w-full rounded-[12px] border border-blue-200 bg-white px-4 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all placeholder-gray-400"
          placeholder="Ваш пароль."
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      <div className="flex justify-start pl-1 -mt-1">
        <button type="button" className="text-xs text-gray-700 font-medium hover:underline">
          Забули пароль?
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 font-medium bg-red-50 p-3 rounded-[12px] border border-red-100">
          {error}
        </p>
      )}

      {/* OAuth alternatives */}
      <div className="flex flex-col items-center gap-3 mt-4">
        <span className="text-[13px] text-gray-800 font-bold">Або увійти через</span>
        <div className="flex items-center gap-4">
          <button type="button" className="w-10 h-10 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            </svg>
          </button>
          <button type="button" className="w-10 h-10 flex items-center justify-center text-[#1877F2]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full h-12 rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all mt-4 flex items-center justify-center shadow-sm"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Вхід..." : "Увійти"}
      </button>

      <Link 
        href="/auth/register" 
        className="w-full h-12 rounded-[12px] border border-blue-200 text-blue-600 font-bold flex items-center justify-center hover:bg-blue-50 transition-colors shadow-sm"
      >
        Зареєструватись
      </Link>
    </form>
  );
}
