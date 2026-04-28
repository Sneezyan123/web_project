"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Link from "next/link";

export function RegisterForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname,
          email,
          password,
          confirmPassword: password,
        }),
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(data.message ?? "Помилка реєстрації");
        return;
      }

      router.push("/auth/register/topics");
    } catch {
      setError("Не вдалося завершити реєстрацію.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
      {/* Nickname Input */}
      <div className="flex flex-col gap-2">
        <label className="text-[14px] text-gray-700 font-medium pl-1">Нікнейм</label>
        <input
          className="h-12 w-full rounded-[12px] border border-blue-200 bg-white px-4 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all placeholder-gray-400"
          placeholder="Придумайте нікнейм."
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          required
        />
      </div>

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
        <label className="text-[14px] text-gray-700 font-medium pl-1">Повторіть ваш пароль</label>
        <input
          className="h-12 w-full rounded-[12px] border border-blue-200 bg-white px-4 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all placeholder-gray-400"
          placeholder="Ваш пароль."
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      {/* Dots Indicator */}
      <div className="flex items-center justify-center gap-2 mt-2">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-blue-200"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-blue-200"></span>
      </div>

      {error && (
        <p className="text-xs text-red-500 font-medium bg-red-50 p-3 rounded-[12px] border border-red-100">
          {error}
        </p>
      )}

      {/* Action Buttons */}
      <button
        type="submit"
        className="w-full h-12 rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all mt-4 flex items-center justify-center shadow-sm"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Вперед..." : "Далі"}
      </button>

      <Link 
        href="/auth/login" 
        className="text-center text-sm text-blue-600 font-bold hover:underline mt-1"
      >
        Вже є акаунт? Увійти
      </Link>
    </form>
  );
}
