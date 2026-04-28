import Image from 'next/image';
import Link from 'next/link';
import type { CurrentUser } from '@/lib/current-user';

export default function Header({ user, wideSearch = false }: { user: CurrentUser | null; wideSearch?: boolean }) {
  const avatarLetter = user?.displayName?.[0]?.toUpperCase() ?? "U";

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-50 shadow-sm border-b border-gray-50">
      {/* Left side: Logo & Search */}
      <div className="flex items-center gap-3 flex-1">
        <Link href="/">
          <Image src="/assets/layer_2.svg" alt="UU Logo" width={38} height={38} className="w-10 h-10 shrink-0" />
        </Link>
        
        {wideSearch ? (
          <form action="/channels" method="GET" className="flex items-center bg-gray-100 rounded-full px-4 py-2 flex-1 max-w-[200px] gap-2 h-10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              name="search"
              placeholder="Пошук..." 
              className="bg-transparent border-none outline-none text-sm text-gray-800 w-full placeholder-gray-400 font-medium"
            />
          </form>
        ) : (
          <Link href="/channels" className="w-10 h-10 bg-gray-100 rounded-[12px] flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </Link>
        )}
      </div>
      
      {/* Right side: Profile & Menu */}
      <div className="flex items-center gap-3 ml-2 shrink-0">
        <Link
          href={user ? "/account" : "/auth/login"}
          className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-blue-50 border border-blue-100 shadow-sm"
          aria-label="Profile"
        >
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.displayName} className="h-full w-full object-cover" />
          ) : user ? (
            <span className="font-bold text-blue-600 text-base">{avatarLetter}</span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          )}
        </Link>

        <Link href="/menu" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </Link>
      </div>
    </header>
  );
}
