"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

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
        setError(data.message ?? "Помилка входу");
        return;
      }

      router.push("/account");
      router.refresh();
    } catch {
      setError("Не вдалося виконати вхід");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
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
        <label className="mb-1 block text-[16px] text-[#1b2630]">Пароль</label>
        <input
          className="h-12 w-full rounded-lg border border-[#9fc9ef] bg-transparent px-3 outline-none placeholder:text-[#9da8b2]"
          placeholder="Ваш пароль."
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>
      <p className="text-sm text-[#1b2630]">Забули пароль?</p>
      <div className="pt-2 text-center">
        <p className="mb-2 text-sm font-semibold text-[#1b2630]">Або увійти через</p>
        <div className="flex items-center justify-center gap-2">
          <img src="/figma-assets/auth-google.svg" alt="Google" className="h-9 w-9" />
          <img src="/figma-assets/auth-facebook.svg" alt="Facebook" className="h-9 w-9" />
        </div>
      </div>
      {error ? <p className="text-sm text-[#e42e21]">{error}</p> : null}
      <button
        type="submit"
        className="h-10 w-full rounded-lg bg-[#207cd3] text-base font-semibold text-white disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Входимо..." : "Увійти"}
      </button>
    </form>
  );
}
