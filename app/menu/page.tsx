import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";
import { DEFAULT_AVATAR, normalizeAvatarUrl } from "@/lib/avatar-url";
import { MobileShell } from "@/components/layout/MobileShell";
import { CloseButton } from "@/components/ui/app-ui";

const menuItems = [
  { href: "/", label: "Головна" },
  { href: "/collections", label: "Тематичні добірки" },
  { href: "/channels", label: "Список каналів" },
  { href: "/about", label: "Про проєкт" },
];

export default async function MenuPage() {
  const user = await getCurrentUser();
  const isAuthenticated = Boolean(user);
  const avatarLetter = user?.displayName?.[0]?.toUpperCase() ?? "U";
  const hasCustomAvatar = normalizeAvatarUrl(user?.avatarUrl) !== DEFAULT_AVATAR;

  return (
    <MobileShell>
      <div className="flex min-h-screen flex-col justify-between px-4 py-6">
        <div>
          <div className="flex justify-end">
            <CloseButton href="/" />
          </div>

          <div className="mt-6 flex flex-col">
            {isAuthenticated ? (
              <Link
                href="/account"
                className="mb-5 flex h-12 w-full items-center justify-between rounded-[10px] bg-[#d4e7fa] px-4 text-[16px] font-semibold text-[#0f3a61]"
              >
                <span className="flex items-center gap-3">
                  <span className="grid h-8 w-8 overflow-hidden rounded-full bg-white">
                    {hasCustomAvatar ? (
                      <img src={user?.avatarUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="grid place-items-center text-sm font-bold">{avatarLetter}</span>
                    )}
                  </span>
                  <span className="truncate">{user?.displayName}</span>
                </span>
                <img src="/figma-assets/chevron.svg" alt="" className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="mb-5 flex h-12 w-full items-center justify-between rounded-[10px] bg-[#207cd3] px-4 text-[16px] font-semibold text-white"
              >
                <span>Вхід в акаунт</span>
                <img src="/figma-assets/chevron.svg" alt="" className="h-4 w-4 brightness-0 invert" />
              </Link>
            )}

            <div className="flex flex-col gap-3">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex h-10 w-full items-center justify-between rounded-[8px] bg-[#ebeff2] px-4 text-[16px] font-semibold text-[#0f3a61]"
                >
                  <span>{item.label}</span>
                  <img src="/figma-assets/chevron.svg" alt="" className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {isAuthenticated ? (
          <form action="/api/auth/logout" method="POST" className="mt-8">
            <button
              type="submit"
              className="flex h-10 w-full items-center justify-between px-2 text-[16px] font-semibold text-[#0f3a61]"
            >
              <span>Вийти</span>
              <img src="/figma-assets/menu-logout.svg" alt="" className="h-6 w-6" />
            </button>
          </form>
        ) : null}
      </div>
    </MobileShell>
  );
}
