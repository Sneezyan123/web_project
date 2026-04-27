import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";
import type { ChannelItem } from "@/lib/channels";

export const topicPills = [
  "Англійська мова",
  "Ігрові світи та гори",
  "Книги",
  "Трукрайм",
  "Аніме",
  "Шортси",
  "Новини",
  "Навчання",
  "Летсплеї",
];

export function MobileShell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto min-h-screen w-full max-w-[393px] bg-white">{children}</div>;
}

export async function Header() {
  const currentUser = await getCurrentUser();
  const avatarLetter = currentUser?.displayName?.[0]?.toUpperCase() ?? "U";

  return (
    <header className="z-20 flex h-[74px] items-center justify-between bg-white px-4">
      <div className="flex items-center gap-4">
        <Link href="/" className="block">
          <img src="/logo.png" alt="U2U" className="h-8 w-[75px]" />
        </Link>
        <Link href="/channels" className="grid h-10 w-10 place-items-center rounded-[10px] bg-[#ebeff2]">
          <img src="/figma-assets/search.svg" alt="Search" className="h-5 w-5" />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href={currentUser ? "/account" : "/auth/login"}
          className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-[#d4e7fa] text-sm font-semibold text-[#0f3a61]"
          aria-label="Profile"
        >
          {currentUser?.avatarUrl ? (
            <img src={currentUser.avatarUrl} alt={currentUser.displayName} className="h-full w-full object-cover" />
          ) : currentUser ? (
            avatarLetter
          ) : (
            <img src="/figma-assets/avatar-header.png" alt="Guest" className="h-full w-full object-cover" />
          )}
        </Link>
        <Link href="/menu">
          <img src="/figma-assets/menu.svg" alt="Menu" className="h-[14px] w-5" />
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="relative h-[138px] bg-white px-[18px] pt-[24px]">
      <div className="flex items-center justify-between">
        <div>
          <img src="/logo.png" alt="U2U" className="h-8 w-[75px]" />
          <p className="mt-[46px] text-xs text-[#0071bc]">Ukrainians to Ukrainians</p>
        </div>
        <p className="text-right text-xs text-black">
          Підтримуй українське!
          <br />
          Шукай нас у соцмережах!
        </p>
      </div>
      <div className="absolute bottom-[20px] right-[18px] flex items-center gap-[5px]">
        <img src="/figma-assets/facebook.svg" alt="Facebook" className="h-6 w-6" />
        <img src="/figma-assets/instagram.svg" alt="Instagram" className="h-6 w-6" />
        <img src="/figma-assets/telegram.svg" alt="Telegram" className="h-6 w-6" />
      </div>
    </footer>
  );
}

export function ChannelCard({
  channel,
  compact = false,
  showBookmark = false,
}: {
  channel: ChannelItem;
  compact?: boolean;
  showBookmark?: boolean;
}) {
  return (
    <article className={`relative w-full rounded-[10px] border-4 border-[#d4e7fa] bg-white ${compact ? "h-[124px] p-3" : "h-[260px] px-3 pb-3 pt-[12px]"}`}>
      <div className={`absolute left-[18px] overflow-hidden rounded-full border-4 border-[#d4e7fa] bg-white ${compact ? "top-3 h-[46px] w-[46px]" : "-top-[14px] h-[60px] w-[60px]"}`}>
        <img src={channel.avatar} alt={channel.name} className="h-full w-full object-cover" />
      </div>
      <div className={`${compact ? "ml-[62px]" : "ml-[81px]"} flex items-start justify-between`}>
        <div>
          <h3 className={`${compact ? "text-base" : "text-[18px]"} font-bold text-[#0f3a61]`}>{channel.name}</h3>
          <p className="text-xs text-[#0f3a61]">{channel.tags}</p>
        </div>
        <div className="flex items-center gap-2">
          {compact && showBookmark ? (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 3C7.45 3 7 3.45 7 4V21L12 18L17 21V4C17 3.45 16.55 3 16 3H8Z"
                fill="#207CD3"
              />
            </svg>
          ) : null}
          <img src="/figma-assets/youtube.svg" alt="YouTube" className="h-[30px] w-[40px]" />
        </div>
      </div>
      {!compact ? (
        <>
          <div className="mt-[8px] grid grid-cols-3 items-center text-center">
            <div>
              <p className="text-[11px] leading-[1.5] tracking-[-0.121px] text-[#9da8b2]">Підписники</p>
              <p className="text-[25px] font-semibold leading-none text-[#207cd3]">{channel.subs}</p>
            </div>
            <div>
              <p className="text-[11px] leading-[1.5] tracking-[-0.121px] text-[#9da8b2]">Відео</p>
              <p className="text-[25px] font-semibold leading-none text-[#207cd3]">{channel.videos}</p>
            </div>
            <div>
              <p className="text-[11px] leading-[1.5] tracking-[-0.121px] text-[#9da8b2]">Оцінка</p>
              <p className="flex items-center justify-center gap-1 text-[25px] font-semibold leading-none text-[#207cd3]">
                <img src="/figma-assets/star-small.svg" alt="" className="h-5 w-5" />
                {channel.rating}
              </p>
            </div>
          </div>
          <p className="mt-[10px] line-clamp-4 text-sm leading-[1] text-[#1b2630]">{channel.about}</p>
          <Link href={`/channel/${channel.slug}`} className="mt-[10px] flex items-center justify-center gap-1 pl-1 text-base font-semibold text-[#4fa1ed]">
            <span>Переглянути інформацію</span>
            <img src="/figma-assets/chevron.svg" alt="" className="h-[18px] w-[18px]" />
          </Link>
        </>
      ) : (
        <div className="mt-[12px]">
          <div className="grid grid-cols-3 items-center text-center">
            <div>
              <p className="text-[11px] leading-[1.5] tracking-[-0.121px] text-[#9da8b2]">Підписники</p>
              <p className="text-[22px] font-semibold leading-none text-[#207cd3]">{channel.subs}</p>
            </div>
            <div>
              <p className="text-[11px] leading-[1.5] tracking-[-0.121px] text-[#9da8b2]">Відео</p>
              <p className="text-[22px] font-semibold leading-none text-[#207cd3]">{channel.videos}</p>
            </div>
            <div>
              <p className="text-[11px] leading-[1.5] tracking-[-0.121px] text-[#9da8b2]">Оцінка</p>
              <p className="flex items-center justify-center gap-1 text-[22px] font-semibold leading-none text-[#207cd3]">
                <img src="/figma-assets/star-small.svg" alt="" className="h-4 w-4" />
                {channel.rating}
              </p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
