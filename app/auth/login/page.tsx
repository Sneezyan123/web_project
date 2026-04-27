import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { MobileShell } from "../../_components/u2u";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect("/account");
  }

  return (
    <MobileShell>
      <main className="min-h-screen bg-white px-3 pt-4">
        <div className="rounded-[10px] bg-white px-3 pb-4 pt-3">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-[38px] leading-none font-bold text-[#0f3a61]">Вхід</h1>
            <Link href="/" aria-label="Закрити" className="text-3xl leading-none text-black">
              ×
            </Link>
          </div>
          <div className="mb-4 rounded-[10px] bg-[#bbd5ef] p-3">
            <p className="text-[14px] text-[#1b2630]">
              <strong>Увійдіть за допомогою YouTube</strong> та отримайте більше персоналізованих пропозицій!
            </p>
            <button className="mt-3 flex items-center gap-[6px] rounded-[10px] bg-[#cf2a1e] px-4 py-2 text-base font-semibold text-white">
              <img src="/figma-assets/auth-youtube.svg" alt="" className="h-[18px] w-[25px]" />
              Увійти через YouTube
            </button>
          </div>
          <LoginForm />
          <Link href="/auth/register" className="mt-3 block text-center text-base font-semibold text-[#207cd3]">
            Зареєструватись
          </Link>
        </div>
      </main>
    </MobileShell>
  );
}
