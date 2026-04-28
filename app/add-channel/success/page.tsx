import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";

export default async function AddChannelSuccessPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/auth/login");
  }

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 max-w-md mx-auto relative shadow-xl px-6 pt-20 flex flex-col items-center text-center justify-between pb-10">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 border-4 border-green-50 shadow-sm animate-pulse">
           <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
             <polyline points="20 6 9 17 4 12"></polyline>
           </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Дякуємо!</h1>
        <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
          Канал успішно надіслано на розгляд. Після перевірки модераторами він з’явиться на сайті.
        </p>
      </div>

      <Link 
        href="/" 
        className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold flex items-center justify-center shadow-md shadow-orange-500/10 transition-colors"
      >
        Повернутись на головну
      </Link>
    </div>
  );
}
