import Link from "next/link";
import { getChannels, getChannelSubmissions, getUserChannelSubmissions } from "@/lib/channels";
import { getBookmarkedChannels } from "@/lib/bookmarks";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChannelCard from "@/components/ChannelCard";
import { MobileShell } from "@/components/layout/MobileShell";
import { Pagination } from "@/components/Pagination";
import { AccountSectionTitle, PrimaryLink } from "@/components/ui/app-ui";
import { ModeratorSubmissions } from "./ModeratorSubmissions";
import { ModeratorChannelsManager } from "./ModeratorChannelsManager";
import { AccountIdentityEditor } from "./AccountIdentityEditor";
import { UserSubmissionsTabs } from "./UserSubmissionsTabs";
import { DEFAULT_AVATAR, normalizeAvatarUrl } from "@/lib/avatar-url";

type SearchParams = Promise<{
  submissionStatus?: "pending" | "approved" | "rejected";
  savedPage?: string;
  modPage?: string;
  modSubPage?: string;
}>;

export default async function AccountPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }

  const allBookmarkedChannels = await getBookmarkedChannels(user.id);
  const savedPage = Math.max(1, Number(params.savedPage ?? "1") || 1);
  const savedPageSize = 10;
  const savedTotalPages = Math.max(1, Math.ceil(allBookmarkedChannels.length / savedPageSize));
  const safeSavedPage = Math.min(savedPage, savedTotalPages);
  const bookmarkedChannels = allBookmarkedChannels.slice(
    (safeSavedPage - 1) * savedPageSize,
    safeSavedPage * savedPageSize,
  );

  const allChannels = await getChannels({ limit: 200 });
  const allModerationChannels = user.role === "moderator" ? await getChannels({ limit: 200 }) : [];
  const modPage = Math.max(1, Number(params.modPage ?? "1") || 1);
  const modPageSize = 10;
  const modTotalPages = Math.max(1, Math.ceil(allModerationChannels.length / modPageSize));
  const safeModPage = Math.min(modPage, modTotalPages);
  const moderationChannels = allModerationChannels.slice(
    (safeModPage - 1) * modPageSize,
    safeModPage * modPageSize,
  );

  const userSubmissions = await getUserChannelSubmissions(user.id);
  const allModeratorSubmissions =
    user.role === "moderator" ? await getChannelSubmissions("pending") : [];
  const modSubPageSize = 10;
  const modSubTotalPages = Math.max(1, Math.ceil(allModeratorSubmissions.length / modSubPageSize));
  const modSubPage = Math.max(1, Number(params.modSubPage ?? "1") || 1);
  const safeModSubPage = Math.min(modSubPage, modSubTotalPages);
  const moderatorSubmissions = allModeratorSubmissions.slice(
    (safeModSubPage - 1) * modSubPageSize,
    safeModSubPage * modSubPageSize,
  );
  const activeSubmissionStatus = params.submissionStatus ?? "pending";

  function makeSavedHref(page: number) {
    const paramsObj = new URLSearchParams();
    if (activeSubmissionStatus !== "pending") {
      paramsObj.set("submissionStatus", activeSubmissionStatus);
    }
    if (page > 1) paramsObj.set("savedPage", String(page));
    const query = paramsObj.toString();
    return query ? `/account?${query}` : "/account";
  }

  function makeModHref(page: number) {
    const paramsObj = new URLSearchParams();
    if (activeSubmissionStatus !== "pending") {
      paramsObj.set("submissionStatus", activeSubmissionStatus);
    }
    if (safeSavedPage > 1) paramsObj.set("savedPage", String(safeSavedPage));
    if (page > 1) paramsObj.set("modPage", String(page));
    const query = paramsObj.toString();
    return query ? `/account?${query}` : "/account";
  }

  function makeModSubHref(page: number) {
    const paramsObj = new URLSearchParams();
    if (activeSubmissionStatus !== "pending") {
      paramsObj.set("submissionStatus", activeSubmissionStatus);
    }
    if (safeSavedPage > 1) paramsObj.set("savedPage", String(safeSavedPage));
    if (safeModPage > 1) paramsObj.set("modPage", String(safeModPage));
    if (page > 1) paramsObj.set("modSubPage", String(page));
    const query = paramsObj.toString();
    return query ? `/account?${query}` : "/account";
  }
  const channelsByName = Object.fromEntries(allChannels.map((channel) => [channel.name.trim().toLowerCase(), channel]));
  const hasCustomAvatar = normalizeAvatarUrl(user.avatarUrl) !== DEFAULT_AVATAR;
  const avatarLetter = user.displayName?.[0]?.toUpperCase() ?? "U";

  return (
    <MobileShell>
      <Header user={user} showProfileAvatar={false} />

      <main className="flex flex-1 flex-col gap-4 px-4 pb-8 pt-4">
        <AccountIdentityEditor
          name={user.displayName}
          email={user.email}
          avatarUrl={user.avatarUrl}
          avatarLetter={avatarLetter}
          hasCustomAvatar={hasCustomAvatar}
        />

        <button
          type="button"
          className="flex h-10 w-full items-center justify-center gap-1.5 rounded-[10px] bg-[#207cd3] px-4 text-[16px] font-semibold leading-none text-[#d4e7fa]"
        >
          <img
            src="/figma-assets/youtube.svg"
            alt=""
            className="h-[18px] w-[25px] shrink-0 brightness-0 invert"
          />
          YouTube підключено
        </button>

        <Link
          href="#saved"
          className="flex h-[62px] items-center justify-between rounded-[10px] bg-[#d4e7fa] py-6 pl-4 pr-[18px] transition-colors hover:bg-[#c8def5]"
        >
          <span className="text-[22px] font-bold leading-none text-[#0f3a61]">Вподобання</span>
          <div className="flex items-center gap-2">
            <div className="grid size-7 place-items-center rounded-full bg-white text-base font-bold text-[#0f3a61]">
              {allBookmarkedChannels.length}
            </div>
            <img src="/figma-assets/chevron.svg" alt="" className="h-6 w-6" />
          </div>
        </Link>

        <section id="saved" className="flex flex-col gap-6 scroll-mt-4">
          <AccountSectionTitle>Збережені канали</AccountSectionTitle>
          {allBookmarkedChannels.length === 0 ? (
            <p className="text-[16px] text-[#4d5a66]">Ще немає збережених каналів.</p>
          ) : (
            <>
              <div className="flex flex-col gap-6">
                {bookmarkedChannels.map((channel) => (
                  <ChannelCard key={channel.slug} channel={channel} compact isBookmarked />
                ))}
              </div>
              <Pagination currentPage={safeSavedPage} totalPages={savedTotalPages} makeHref={makeSavedHref} />
            </>
          )}
        </section>

        <section className="flex flex-col gap-4 rounded-[10px] px-2 pt-6">
          <AccountSectionTitle>Додати ютуб-канал</AccountSectionTitle>
          <p className="text-[16px] leading-[22px] text-black">
            Заповніть форму, щоб запропонувати канал.{" "}
            <strong className="font-semibold">
              Увага: розглядаються лише україномовні канали, російськомовні не додаються!
            </strong>{" "}
            Перевірте, чи каналу ще немає на сайті. Статус запиту можна відстежувати в акаунті.
            Додавання безкоштовне. Дякуємо за підтримку українського контенту!
          </p>
          <PrimaryLink href="/add-channel" className="rounded-[8px] font-semibold">
            Заповнити форму
          </PrimaryLink>
        </section>

        <section className="flex flex-col gap-6 pt-6">
          <AccountSectionTitle className="pl-2">Ваші додані ютуб-канали</AccountSectionTitle>
          <UserSubmissionsTabs
            submissions={userSubmissions}
            channelsByName={channelsByName}
            initialStatus={activeSubmissionStatus}
          />
        </section>

        {user.role === "moderator" ? (
          <>
            <ModeratorSubmissions initialItems={moderatorSubmissions} />
            <Pagination currentPage={safeModSubPage} totalPages={modSubTotalPages} makeHref={makeModSubHref} />
          </>
        ) : null}
        {user.role === "moderator" ? (
          <>
            <ModeratorChannelsManager initialChannels={moderationChannels} />
            <Pagination currentPage={safeModPage} totalPages={modTotalPages} makeHref={makeModHref} />
          </>
        ) : null}

        <form action="/api/auth/logout" method="POST" className="mt-2">
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-between px-2 text-[16px] font-semibold text-[#0f3a61] transition-opacity hover:opacity-80"
          >
            <span>Вийти</span>
            <img src="/figma-assets/menu-logout.svg" alt="" className="h-6 w-6" />
          </button>
        </form>
      </main>

      <Footer />
    </MobileShell>
  );
}
