import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";

const menuItems = [
  { href: "/", label: "Головна" },
  { href: "/collections", label: "Тематичні добірки" },
  { href: "/channels", label: "Список каналів" },
  { href: "/about", label: "Про проєкт" },
];

export default async function MenuPage() {
  const user = await getCurrentUser();
  const isAuthenticated = Boolean(user);

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 max-w-md mx-auto relative shadow-xl px-6 py-6 flex flex-col justify-between">
      <div>
        {/* Close button */}
        <div className="flex justify-end pr-2 pt-2">
          <Link href="/" className="text-gray-900 hover:opacity-70 transition-opacity">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Link>
        </div>

        {/* Auth / Profile Block */}
        <div className="mt-8 flex flex-col gap-4">
          {isAuthenticated ? (
            <Link 
              href="/account" 
              className="w-full bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold h-14 rounded-[12px] flex items-center justify-between px-4 shadow-sm transition-colors relative"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-blue-50 -ml-1">
                  <img src={user?.avatarUrl || "/assets/channel_I298_947;191:1886.png"} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <span className="text-[16px] truncate max-w-[200px]">{user?.displayName}</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Link>
          ) : (
            <Link 
              href="/auth/login" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 rounded-[12px] flex items-center justify-between px-6 shadow-sm transition-colors"
            >
              <span className="text-[16px]">Вхід в акаунт</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Link>
          )}

          {/* Navigation Links */}
          <div className="flex flex-col gap-2 mt-2">
            {menuItems.map((item, i) => (
              <Link 
                key={i} 
                href={item.href} 
                className="w-full bg-gray-50 hover:bg-gray-100 text-blue-900 font-bold h-14 rounded-[12px] flex items-center justify-between px-6 shadow-sm transition-colors"
              >
                <span className="text-[16px]">{item.label}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-900/60">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Logout Block */}
      {isAuthenticated && (
        <form action="/api/auth/logout" method="POST" className="mt-20 px-2 py-4 flex items-center justify-between">
          <button type="submit" className="flex items-center justify-between w-full text-blue-900 font-bold hover:opacity-80 transition-opacity">
            <span className="text-[16px]">Вийти</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </form>
      )}
    </div>
  );
}
