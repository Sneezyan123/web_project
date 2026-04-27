import Link from "next/link";
import { getChannels } from "@/lib/channels";
import { topicToSlug } from "@/lib/channels";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { ChannelCard, Footer, Header, MobileShell, topicPills } from "../_components/u2u";

export default async function GuestHomePage() {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect("/");
  }
  const channels = await getChannels({ sort: "recommended", limit: 8 });

  return (
    <MobileShell>
      <Header />
      <main className="space-y-4 px-4 pb-8 pt-[14px]">
        <section className="rounded-xl bg-white px-2 pt-6">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-[22px] font-bold text-[#0f3a61]">Тематичні добірки</h2>
            <Link href="/collections" className="text-xs text-[#4d5a66]">переглянути всі</Link>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {topicPills.map((topic) => (
              <Link key={topic} href={`/collections/${topicToSlug(topic)}`} className="rounded-[50px] bg-[#ebeff2] px-4 py-2 text-base font-semibold text-[#0f3a61]">
                {topic}
              </Link>
            ))}
          </div>
        </section>
        <section className="space-y-4 rounded-[10px] bg-white pt-6 pr-4">
          <div className="flex items-center justify-between">
            <h2 className="pl-2 text-[22px] font-bold text-[#0f3a61]">Ютуб-канали</h2>
            <Link href="/channels" className="text-xs text-[#4d5a66]">переглянути всі</Link>
          </div>
          <div className="flex gap-[10px] pl-2">
            <Link href="/channels" className="grid h-[35px] rounded-full bg-[#207cd3] px-[18px] text-sm font-semibold text-white place-items-center">Рекомендації</Link>
            <Link href="/channels" className="grid h-[35px] rounded-full border-2 border-[#207cd3] bg-white px-[18px] text-sm font-semibold text-[#207cd3] place-items-center">Нове</Link>
          </div>
          {channels.map((channel) => (
            <ChannelCard key={channel.slug} channel={channel} />
          ))}
        </section>
        <section className="space-y-4 rounded-[10px] bg-white px-2 pt-6">
          <h2 className="text-[22px] font-bold text-[#0f3a61]">Додати ютуб-канал</h2>
          <p className="text-base text-black">
            Хочете поділитися цікавим україномовним каналом? Щоб запропонувати канал, увійдіть у свій акаунт.
          </p>
          <Link href="/auth/login" className="grid h-10 w-full place-items-center rounded-lg bg-[#207cd3] text-base font-semibold text-white">
            Увійти
          </Link>
        </section>
      </main>
      <Footer />
    </MobileShell>
  );
}
