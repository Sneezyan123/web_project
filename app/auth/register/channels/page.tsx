import Link from "next/link";
import { getChannels } from "@/lib/channels";
import { MobileShell } from "../../../_components/u2u";

export default async function RegisterChannelsPage() {
  const channels = await getChannels({ sort: "recommended", limit: 20 });

  return (
    <MobileShell>
      <main className="space-y-6 px-4 pb-8 pt-6">
        <h1 className="text-[22px] font-bold text-[#0f3a61]">Що вам подобається?</h1>
        <section className="rounded-xl bg-[#ebeff2] p-3 text-sm text-[#1b2630]">
          Оберіть ваші вподобання (канали) для персоналізованих рекомендацій.
        </section>
        <input className="h-10 w-full rounded-lg border border-[#d4e7fa] px-3 outline-none" placeholder="Шукайте свої улюблені канали" />
        <div className="max-h-[278px] space-y-2 overflow-auto rounded-xl border border-[#d4e7fa] p-3">
          {channels.map((channel) => (
            <Link key={channel.slug} href={`/channel/${channel.slug}`} className="flex w-full items-center gap-3 rounded-lg border border-[#d4e7fa] p-2 text-left">
              <img src={channel.avatar} alt={channel.name} className="h-10 w-10 rounded-full" />
              <span className="text-sm font-semibold text-[#0f3a61]">{channel.name}</span>
            </Link>
          ))}
        </div>
        <div className="flex gap-2">
          <Link href="/auth/register/topics" className="grid h-10 flex-1 place-items-center rounded-lg border border-[#207cd3] text-base font-semibold text-[#207cd3]">
            Назад
          </Link>
          <Link href="/account" className="grid h-10 flex-1 place-items-center rounded-lg bg-[#207cd3] text-base font-semibold text-white">
            Готово
          </Link>
        </div>
      </main>
    </MobileShell>
  );
}
