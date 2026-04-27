import { getChannels, topicToSlug } from "@/lib/channels";
import { ChannelCard, Footer, Header, MobileShell } from "../../_components/u2u";

function SortChip({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex h-[43px] items-center justify-center gap-2 rounded-[100px] border-[3px] border-[#207cd3] bg-white px-[24px] text-sm font-semibold text-[#207cd3]"
    >
      <span className="leading-none">{label}</span>
      <span className="flex flex-col leading-none">
        <img src="/figma-assets/menu-chevron.svg" alt="" className="h-[6px] w-[4px] -rotate-90" />
        <img src="/figma-assets/menu-chevron.svg" alt="" className="h-[6px] w-[4px] rotate-90" />
      </span>
    </button>
  );
}

export default async function CollectionDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const allChannels = await getChannels({ sort: "recommended", limit: 200 });
  const channels = allChannels.filter((channel) => topicToSlug(channel.topic) === slug);
  const title = channels[0]?.topic ?? slug.replace(/-/g, " ");
  return (
    <MobileShell>
      <Header />
      <main className="space-y-4 px-4 pb-8 pt-[13px]">
        <p className="pl-2 text-xs text-[#4d5a66]">Головна / Добірки / {title}</p>
        <section className="rounded-[10px] bg-white px-0 pb-4 pt-6">
          <h1 className="mb-4 px-2 text-[22px] font-bold text-[#0f3a61]">{title}</h1>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                className="h-[52px] w-full rounded-[14px] bg-[#ebeff2] pl-4 pr-12 text-sm text-[#0f3a61] outline-none placeholder:text-transparent"
                placeholder="Пошук"
              />
              <img src="/figma-assets/search.svg" alt="Search" className="pointer-events-none absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2" />
            </div>
            <button type="button" className="grid h-[40px] w-[40px] place-items-center">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6.6C3 6.04 3.44 5.6 4 5.6H20C20.56 5.6 21 6.04 21 6.6C21 6.88 20.88 7.14 20.68 7.32L14 13.1V18C14 18.38 13.78 18.72 13.44 18.88L10.44 20.28C9.78 20.58 9 20.1 9 19.38V13.1L3.32 7.32C3.12 7.14 3 6.88 3 6.6Z" stroke="#1B2630" strokeWidth="1.8" />
              </svg>
            </button>
          </div>
          <div className="mb-4 flex items-center gap-3">
            <SortChip label="Підписники" />
            <SortChip label="Відео" />
            <SortChip label="Оцінка" />
          </div>
          <div className="space-y-3">
            {channels.map((channel) => (
              <ChannelCard key={channel.slug} channel={channel} compact />
            ))}
            {channels.length === 0 ? <p className="px-2 text-sm text-[#4d5a66]">У цій добірці поки немає каналів.</p> : null}
          </div>
        </section>
      </main>
      <Footer />
    </MobileShell>
  );
}
