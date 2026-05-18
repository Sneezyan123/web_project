"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const inputClass =
  "h-10 w-full rounded-[8px] border border-[#dadfe5] bg-white px-3 text-[16px] text-[#0f3a61] outline-none placeholder:text-[#9da8b2] focus:border-[#207cd3]";

export function RegisterForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

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
    }
  };

  return (
    <form id="register-form" className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1">
        <label className="text-[16px] font-medium leading-[22px] text-black">Нікнейм</label>
        <input
          className={inputClass}
          placeholder="Придумайте нікнейм."
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[16px] font-medium leading-[22px] text-black">Email</label>
        <input
          className={inputClass}
          placeholder="Ваша електронна пошта."
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[16px] font-medium leading-[22px] text-black">Введіть ваш пароль</label>
        <input
          className={inputClass}
          placeholder="Введіть ваш пароль."
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error ? (
        <p className="rounded-[8px] border border-[#cf2a1e]/30 bg-[#cf2a1e]/10 p-3 text-xs font-medium text-[#cf2a1e]">
          {error}
        </p>
      ) : null}
    </form>
  );
}
