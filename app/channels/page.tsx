import { redirect } from "next/navigation";
import { getChannels } from "@/lib/channels";
import { getCurrentUser } from "@/lib/current-user";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MobileShell } from "@/components/layout/MobileShell";
import ChannelCard from "@/components/ChannelCard";
import { Pagination } from "@/components/Pagination";
import { AssistantBubble, Breadcrumbs, ChannelsListSortTabs, FilterIconLink, PageTitle } from "@/components/ui/app-ui";
import { buildQueryString, decodeParam } from "@/lib/url-params";
import { ChannelsSearchBar } from "./ChannelsSearchBar";

type SearchParams = Promise<{
  search?: string;
  sort?: "subs" | "videos" | "rating";
  topic?: string;
  language?: string;
  duration?: "short" | "medium" | "long";
  page?: string;
}>;

export default async function ChannelsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const activeSort: "subs" | "videos" | "rating" =
    params.sort === "videos" || params.sort === "rating" ? params.sort : "subs";
  const activeSearch = decodeParam(params.search ?? "");
  const activeTopic = decodeParam(params.topic ?? "");
  const activeLanguage = decodeParam(params.language ?? "");
  const activeDuration = decodeParam(params.duration ?? "");
  const currentPage = Math.max(1, Number(params.page ?? "1") || 1);

  const rawSearch = params.search ?? "";
  const rawTopic = params.topic ?? "";
  const rawLanguage = params.language ?? "";
  const rawDuration = params.duration ?? "";
  if (
    (rawSearch && rawSearch !== activeSearch) ||
    (rawTopic && rawTopic !== activeTopic) ||
    (rawLanguage && rawLanguage !== activeLanguage) ||
    (rawDuration && rawDuration !== activeDuration)
  ) {
    redirect(
      `/channels${buildQueryString({
        search: activeSearch || undefined,
        sort: activeSort !== "subs" ? activeSort : undefined,
        topic: activeTopic || undefined,
        language: activeLanguage || undefined,
        duration: activeDuration || undefined,
        page: currentPage > 1 ? String(currentPage) : undefined,
      })}`,
    );
  }
  const pageSize = 14;

  const allChannels = await getChannels({
    sort: activeSort,
    topic: params.topic,
    search: params.search,
    language: params.language,
    duration: params.duration,
    limit: 200,
  });
  const totalPages = Math.max(1, Math.ceil(allChannels.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * pageSize;
  const channels = allChannels.slice(start, start + pageSize);

  function makeHref(page: number) {
    const paramsObj = new URLSearchParams();
    if (activeSearch) paramsObj.set("search", activeSearch);
    if (activeSort !== "subs") paramsObj.set("sort", activeSort);
    if (activeTopic) paramsObj.set("topic", activeTopic);
    if (activeLanguage) paramsObj.set("language", activeLanguage);
    if (activeDuration) paramsObj.set("duration", activeDuration);
    if (page > 1) paramsObj.set("page", String(page));
    const query = paramsObj.toString();
    return query ? `/channels?${query}` : "/channels";
  }

  const filterHref = `/filters${buildQueryString({
    search: activeSearch || undefined,
    sort: activeSort !== "subs" ? activeSort : undefined,
    topic: activeTopic || undefined,
    language: activeLanguage || undefined,
    duration: activeDuration || undefined,
  })}`;

  return (
    <MobileShell>
      <Header user={user} />

      <main className="flex flex-1 flex-col px-4 pb-10 pt-4">
        <Breadcrumbs className="pl-2">Головна / Канали</Breadcrumbs>

        <div className="-mt-[5px] flex flex-col gap-4 pt-6">
          <PageTitle className="pl-2 text-[22px]">Список україномовних ютуб-каналів</PageTitle>

          <div className="flex w-full max-w-[360px] items-center gap-4">
            <ChannelsSearchBar
              initialSearch={activeSearch}
              activeSort={activeSort}
              activeTopic={activeTopic}
              activeLanguage={activeLanguage}
              activeDuration={activeDuration}
            />
            <FilterIconLink href={filterHref} />
          </div>

          <div className="flex flex-col gap-6">
            <ChannelsListSortTabs
              basePath="/channels"
              activeSort={activeSort}
              search={activeSearch || undefined}
              topic={activeTopic || undefined}
              language={activeLanguage || undefined}
              duration={activeDuration || undefined}
            />

            <div className="flex flex-col gap-6">
              {channels.length === 0 ? (
                <p className="py-6 text-center text-sm text-[#9da8b2]">Нічого не знайдено.</p>
              ) : (
                channels.map((channel) => <ChannelCard key={channel.slug} channel={channel} compact />)
              )}
            </div>
          </div>

          <Pagination currentPage={safePage} totalPages={totalPages} makeHref={makeHref} />
        </div>
      </main>

      <AssistantBubble />
      <Footer />
    </MobileShell>
  );
}
