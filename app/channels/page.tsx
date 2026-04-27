import Link from "next/link";
import { getChannels } from "@/lib/channels";
import { ChannelCard, Footer, Header, MobileShell } from "../_components/u2u";

type SearchParams = Promise<{
  search?: string;
  sort?: "recommended" | "new" | "top";
  topic?: string;
  language?: string;
  duration?: "short" | "medium" | "long";
}>;

export default async function ChannelsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const channels = await getChannels({
    search: params.search,
    sort: params.sort,
    topic: params.topic,
    language: params.language,
    duration: params.duration,
  });

  const activeSort = params.sort ?? "recommended";

  return (
    <MobileShell>
      <Header />
      <main className="space-y-4 px-4 pb-8 pt-[13px]">
        <p className="pl-2 text-xs text-[#4d5a66]">Головна / Канали</p>

        <section className="rounded-[10px] bg-white px-0 pb-4 pt-6">
          <h1 className="mb-4 px-2 text-[22px] font-bold text-[#0f3a61]">Список україномовних ютуб-каналів</h1>
          <form className="mb-4 flex gap-2">
            <input
              name="search"
              defaultValue={params.search ?? ""}
              className="h-10 w-full rounded-[8px] border border-[#d4e7fa] px-3 text-sm outline-none"
              placeholder="Пошук"
            />
            <input type="hidden" name="topic" value={params.topic ?? ""} />
            <input type="hidden" name="language" value={params.language ?? ""} />
            <input type="hidden" name="duration" value={params.duration ?? ""} />
            <button type="submit" className="rounded-[8px] bg-[#207cd3] px-4 text-sm font-semibold text-white">
              Шукати
            </button>
          </form>
          <div className="mb-4 flex gap-2">
            <Link
              href={`/channels?sort=recommended${params.topic ? `&topic=${encodeURIComponent(params.topic)}` : ""}${params.language ? `&language=${encodeURIComponent(params.language)}` : ""}${params.duration ? `&duration=${params.duration}` : ""}${params.search ? `&search=${encodeURIComponent(params.search)}` : ""}`}
              className={`grid h-[35px] place-items-center rounded-full px-4 text-sm font-semibold ${activeSort === "recommended" ? "bg-[#207cd3] text-white" : "border-2 border-[#207cd3] text-[#207cd3]"}`}
            >
              Рекомендації
            </Link>
            <Link
              href={`/channels?sort=new${params.topic ? `&topic=${encodeURIComponent(params.topic)}` : ""}${params.language ? `&language=${encodeURIComponent(params.language)}` : ""}${params.duration ? `&duration=${params.duration}` : ""}${params.search ? `&search=${encodeURIComponent(params.search)}` : ""}`}
              className={`grid h-[35px] place-items-center rounded-full px-4 text-sm font-semibold ${activeSort === "new" ? "bg-[#207cd3] text-white" : "border-2 border-[#207cd3] text-[#207cd3]"}`}
            >
              Нове
            </Link>
            <Link
              href={`/channels?sort=top${params.topic ? `&topic=${encodeURIComponent(params.topic)}` : ""}${params.language ? `&language=${encodeURIComponent(params.language)}` : ""}${params.duration ? `&duration=${params.duration}` : ""}${params.search ? `&search=${encodeURIComponent(params.search)}` : ""}`}
              className={`grid h-[35px] place-items-center rounded-full px-4 text-sm font-semibold ${activeSort === "top" ? "bg-[#207cd3] text-white" : "border-2 border-[#207cd3] text-[#207cd3]"}`}
            >
              Топ
            </Link>
            <Link href="/filters" className="grid h-[35px] place-items-center rounded-full border-2 border-[#d4e7fa] px-4 text-sm font-semibold text-[#0f3a61]">
              Фільтри
            </Link>
          </div>
          <div className="space-y-4">
            {channels.map((channel) => (
              <ChannelCard key={channel.slug} channel={channel} compact />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </MobileShell>
  );
}
