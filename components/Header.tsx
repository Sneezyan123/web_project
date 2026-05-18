import Link from "next/link";
import { U2ULogo } from "@/components/U2ULogo";
import { getCurrentUser } from "@/lib/current-user";
import type { CurrentUser } from "@/lib/current-user";

export default async function Header({
  user: userProp,
  showProfileAvatar = true,
}: {
  user?: CurrentUser | null;
  showProfileAvatar?: boolean;
}) {
  const user = userProp !== undefined ? userProp : await getCurrentUser();
  const avatarLetter = user?.displayName?.[0]?.toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-20 flex h-[74px] shrink-0 items-center justify-between overflow-visible bg-white px-4 py-2">
      <div className="flex items-center gap-4">
        <Link href="/" className="block">
          <U2ULogo variant="header" />
        </Link>
        <Link href="/channels" className="grid h-10 w-10 place-items-center rounded-[10px] bg-[#ebeff2]" aria-label="Пошук каналів">
          <img src="/figma-assets/search.svg" alt="" className="h-5 w-5" />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {showProfileAvatar ? (
          <Link
            href={user ? "/account" : "/auth/login"}
            className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-[#d4e7fa] text-sm font-semibold text-[#0f3a61]"
            aria-label="Профіль"
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.displayName} className="h-full w-full object-cover" />
            ) : user ? (
              avatarLetter
            ) : (
              <span className="text-base font-bold text-[#0f3a61]">U</span>
            )}
          </Link>
        ) : null}
        <Link href="/menu" aria-label="Меню">
          <img src="/figma-assets/menu.svg" alt="" className="h-[14px] w-5" />
        </Link>
      </div>
    </header>
  );
}
