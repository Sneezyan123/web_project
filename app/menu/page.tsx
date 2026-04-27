import Link from "next/link";
import { LogoutButton } from "../_components/logout-button";
import { getCurrentUser } from "@/lib/current-user";

const menuItems = [
  { href: "/", label: "Головна" },
  { href: "/collections", label: "Тематичні добірки" },
  { href: "/channels", label: "Список каналів" },
  { href: "/about", label: "Про проєкт" },
];

export default async function MenuPage() {
  const currentUser = await getCurrentUser();
  const isAuthenticated = Boolean(currentUser);
  const profileLabel = currentUser?.displayName ?? "Увійти";

  return (
    <div className="mx-auto min-h-screen w-full max-w-[393px] bg-white px-6 pb-8 pt-6">
      <div className="min-h-[calc(100vh-48px)] bg-white px-4 pb-10 pt-3">
        <div className="mb-20 flex justify-end">
          <Link href="/" aria-label="Close menu">
            <img src="/figma-assets/menu-close.svg" alt="" className="h-6 w-6" />
          </Link>
        </div>

        <div className="space-y-8">
          {isAuthenticated ? (
            <Link
              href="/account"
              className="flex h-16 items-center justify-between rounded-[10px] border-4 border-[#bbdbf8] bg-[#bbdbf8] px-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src="/figma-assets/menu-avatar.png"
                  alt="Avatar"
                  className="h-[52px] w-[52px] rounded-full border-4 border-[#bbdbf8]"
                />
                <p className="text-[18px] font-bold text-[#0f3a61]">{profileLabel}</p>
              </div>
              <img src="/figma-assets/menu-chevron.svg" alt="" className="h-6 w-6" />
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="flex h-16 items-center justify-between rounded-[10px] border-4 border-[#207cd3] bg-[#207cd3] px-4"
            >
              <p className="text-[16px] font-semibold text-white">Вхід в акаунт</p>
              <img src="/figma-assets/menu-chevron.svg" alt="" className="h-6 w-6 brightness-[6]" />
            </Link>
          )}

          <div className="space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-[10px] border-4 border-[#d8dde3] bg-[#d8dde3] px-6 py-3"
              >
                <span className="text-[16px] font-semibold text-[#0f3a61]">{item.label}</span>
                <img src="/figma-assets/menu-chevron.svg" alt="" className="h-6 w-6" />
              </Link>
            ))}
          </div>
        </div>

        {isAuthenticated ? (
          <div className="mt-52 flex items-center justify-between px-6">
            <LogoutButton className="text-base font-semibold text-[#0f3a61]" />
            <img src="/figma-assets/menu-logout.svg" alt="" className="h-6 w-6" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
