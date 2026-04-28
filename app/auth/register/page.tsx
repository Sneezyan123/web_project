import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { RegisterForm } from "./RegisterForm";

export default async function RegisterPage() {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect("/account");
  }

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 max-w-md mx-auto relative shadow-xl px-6 pt-6 flex flex-col pb-10">
      {/* Top Header with Close Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[28px] font-bold text-blue-900 pl-1">Реєстрація</h1>
        <Link href="/" aria-label="Закрити" className="p-2 -mr-2 text-gray-900 hover:opacity-70 transition-opacity">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </Link>
      </div>

      {/* Info Banner Block */}
      <div className="bg-blue-50/50 rounded-[16px] p-5 border border-blue-50 flex flex-col gap-3">
        <p className="text-[13px] text-gray-800 font-medium leading-relaxed">
          Зареєструвавшись на U2U ви зможете коментувати канали, додавати їх в збережені, додавати канали, яких ще немає на сайті та отримувати персоналізовані рекомендації!
        </p>
      </div>

      <RegisterForm />
    </div>
  );
}
