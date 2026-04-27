"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

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

      router.push("/auth/login");
    } catch {
      setError("Не вдалося завершити реєстрацію");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-[16px] text-[#1b2630]">Нікнейм</label>
        <input
          className="h-12 w-full rounded-lg border border-[#9fc9ef] bg-transparent px-3 outline-none placeholder:text-[#9da8b2]"
          placeholder="Придумайте нікнейм."
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-[16px] text-[#1b2630]">Email</label>
        <input
          className="h-12 w-full rounded-lg border border-[#9fc9ef] bg-transparent px-3 outline-none placeholder:text-[#9da8b2]"
          placeholder="Ваша електронна пошта."
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-[16px] text-[#1b2630]">Повторіть ваш пароль</label>
        <input
          className="h-12 w-full rounded-lg border border-[#9fc9ef] bg-transparent px-3 outline-none placeholder:text-[#9da8b2]"
          placeholder="Ваш пароль."
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>
      <div className="flex items-center justify-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#4fa1ed]" />
        <span className="h-2 w-2 rounded-full bg-[#9fc9ef]" />
        <span className="h-2 w-2 rounded-full bg-[#9fc9ef]" />
      </div>
      {error ? <p className="text-sm text-[#e42e21]">{error}</p> : null}
      <button
        type="submit"
        className="h-10 w-full rounded-lg bg-[#207cd3] text-base font-semibold text-white disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Створюємо..." : "Далі"}
      </button>
    </form>
  );
}
