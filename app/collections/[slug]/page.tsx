import { redirect } from "next/navigation";
import { getChannelsByThematicCollectionSlug, topicToSlug } from "@/lib/channels";
import type { ChannelItem } from "@/lib/channels";
import { getCurrentUser } from "@/lib/current-user";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MobileShell } from "@/components/layout/MobileShell";
import ChannelCard from "@/components/ChannelCard";
import { Pagination } from "@/components/Pagination";
import {
  Breadcrumbs,
  AssistantBubble,
  CollectionChannelSortTabs,
  PageTitle,
  SearchField,
} from "@/components/ui/app-ui";
import { decodeParam } from "@/lib/url-params";

function parseSubsSortKey(subs: string): number {
  const t = subs.trim();
  const numPart = t.replace(/[^\d,]/g, "").replace(",", ".");
  if (t.includes("млн")) {
    return Math.round((parseFloat(numPart) || 0) * 1_000_000);
  }
  if (t.includes("тис")) {
    return Math.round((parseFloat(numPart) || 0) * 1000);
  }
  return parseInt(t.replace(/\D/g, ""), 10) || 0;
}

function sortCollectionChannels(channels: ChannelItem[], sort: "subs" | "videos" | "rating") {
  const copy = [...channels];
  copy.sort((a, b) => {
    if (sort === "subs") return parseSubsSortKey(b.subs) - parseSubsSortKey(a.subs);
    if (sort === "videos") return (parseInt(b.videos, 10) || 0) - (parseInt(a.videos, 10) || 0);
    return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
  });
  return copy;
}

type SearchParams = Promise<{ page?: string; search?: string; sort?: string }>;

export default async function CollectionDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const user = await getCurrentUser();
  const currentPage = Math.max(1, Number(query.page ?? "1") || 1);
  const pageSize = 10;
  const collectionSlug = topicToSlug(decodeParam(slug));
  const activeSearch = decodeParam(query.search ?? "").trim();
  const rawSort = query.sort;
  const activeSort: "subs" | "videos" | "rating" =
    rawSort === "videos" || rawSort === "rating" ? rawSort : "subs";

  const collectionPath = `/collections/${collectionSlug}`;

  if (slug !== collectionSlug && decodeParam(slug) !== collectionSlug) {
    const paramsObj = new URLSearchParams();
    if (activeSearch) paramsObj.set("search", activeSearch);
    if (activeSort !== "subs") paramsObj.set("sort", activeSort);
    if (currentPage > 1) paramsObj.set("page", String(currentPage));
    const qs = paramsObj.toString();
    redirect(qs ? `${collectionPath}?${qs}` : collectionPath);
  }

  const { channels: allChannelsRaw, title } = await getChannelsByThematicCollectionSlug(collectionSlug);
  const searchLower = activeSearch.toLowerCase();
  const filtered = searchLower
    ? allChannelsRaw.filter((c) => c.name.toLowerCase().includes(searchLower))
    : allChannelsRaw;
  const sorted = sortCollectionChannels(filtered, activeSort);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * pageSize;
  const channels = sorted.slice(start, start + pageSize);

  function makeHref(page: number) {
    const paramsObj = new URLSearchParams();
    if (activeSearch) paramsObj.set("search", activeSearch);
    if (activeSort !== "subs") paramsObj.set("sort", activeSort);
    if (page > 1) paramsObj.set("page", String(page));
    const qs = paramsObj.toString();
    return qs ? `${collectionPath}?${qs}` : collectionPath;
  }

  const searchHidden: Record<string, string> = {};
  if (activeSort !== "subs") searchHidden.sort = activeSort;

  return (
    <MobileShell>
      <Header user={user} />
      <main className="flex flex-1 flex-col space-y-4 px-4 pb-8 pt-[13px]">
        <Breadcrumbs>
          Головна / Добірки / {title}
        </Breadcrumbs>
        <section className="rounded-[10px] bg-white px-0 pb-4 pt-2">
          <PageTitle className="mb-4 px-0">{title}</PageTitle>
          <div className="mb-4 space-y-3">
            <SearchField
              action={collectionPath}
              placeholder="Пошук..."
              defaultValue={activeSearch}
              hiddenFields={Object.keys(searchHidden).length ? searchHidden : undefined}
            />
            <CollectionChannelSortTabs
              collectionPath={collectionPath}
              activeSort={activeSort}
              search={activeSearch || undefined}
            />
          </div>
          <div className="space-y-3">
            {channels.map((channel) => (
              <ChannelCard key={channel.slug} channel={channel} compact />
            ))}
            {channels.length === 0 ? (
              <p className="px-0 text-sm text-[#4d5a66]">У цій добірці поки немає каналів.</p>
            ) : null}
          </div>
          <Pagination currentPage={safePage} totalPages={totalPages} makeHref={makeHref} />
        </section>
      </main>
      <AssistantBubble />
      <Footer />
    </MobileShell>
  );
}
