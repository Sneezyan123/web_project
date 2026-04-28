import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect("/account");
  }

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 max-w-md mx-auto relative shadow-xl px-6 pt-6 flex flex-col pb-10">
      {/* Top Header with Close Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[28px] font-bold text-blue-900 pl-1">Вхід</h1>
        <Link href="/" aria-label="Закрити" className="p-2 -mr-2 text-gray-900 hover:opacity-70 transition-opacity">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </Link>
      </div>

      {/* YouTube Banner Block */}
      <div className="bg-blue-50/50 rounded-[16px] p-5 border border-blue-50 flex flex-col gap-3">
        <p className="text-[13px] text-gray-800 font-medium leading-relaxed">
          <strong className="font-bold">Увійдіть за допомогою YouTube</strong> та отримайте більше персоналізованих пропозицій!
        </p>
        <button className="bg-[#cf2a1e] hover:bg-red-700 text-white font-bold h-11 rounded-[12px] flex items-center justify-center gap-2 shadow-sm transition-colors text-[14px]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/>
          </svg>
          Увійти через YouTube
        </button>
      </div>

      <LoginForm />
    </div>
  );
}
