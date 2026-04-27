import Link from "next/link";
import { getChannels } from "@/lib/channels";
import { topicToSlug } from "@/lib/channels";
import { getCurrentUser } from "@/lib/current-user";
import { ChannelCard, Footer, Header, MobileShell, topicPills } from "./_components/u2u";

const topicIcons: Record<string, string> = {
  "Англійська мова": "🇺🇸",
  "Ігрові світи та гори": "🎮",
  "Книги": "📚",
  "Трукрайм": "🕵️",
  "Аніме": "🌸",
  "Новини": "📰",
  "Навчання": "📝",
  "Летсплеї": "🕹️",
};

export default async function Home() {
  const currentUser = await getCurrentUser();
  const isAuthenticated = Boolean(currentUser);
  const channels = await getChannels({ sort: "recommended", limit: 8 });

  return (
    <MobileShell>
      <Header />

      <main className="relative space-y-4 px-4 pb-8 pt-[14px]">
        {isAuthenticated ? (
          <section className="rounded-[10px] bg-[#d4e7fa] px-4 py-[14px]">
            <div className="flex items-center justify-between">
              <h2 className="text-[22px] font-bold text-[#0f3a61]">Збережені канали</h2>
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-base font-bold text-[#0f3a61]">
                  3
                </span>
                <img src="/figma-assets/chevron-large.svg" alt="" className="h-6 w-6" />
              </div>
            </div>
          </section>
        ) : null}

        <section className="rounded-[10px] bg-white px-2 pb-2 pt-6">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-[22px] font-bold text-[#0f3a61]">Тематичні добірки</h2>
            <Link href="/collections" className="text-xs text-[#4d5a66]">переглянути всі</Link>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pb-2">
            {topicPills.map((topic) => (
              <Link
                key={topic}
                href={`/collections/${topicToSlug(topic)}`}
                className="flex h-10 items-center gap-2 rounded-[50px] bg-[#ebeff2] px-4 text-base font-semibold text-[#0f3a61]"
              >
                {topic === "Шортси" ? (
                  <img src="/figma-assets/shorts.svg" alt="" className="h-[15px] w-3" />
                ) : (
                  <span className="text-sm">{topicIcons[topic] ?? "•"}</span>
                )}
                <span>{topic}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-[10px] bg-white px-0 pb-2 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="pl-2 text-[22px] font-bold text-[#0f3a61]">Ютуб-канали</h2>
            <Link href="/channels" className="pr-2 text-xs text-[#4d5a66]">переглянути всі</Link>
          </div>

          <div className="flex gap-[10px] pl-2">
            <Link href="/channels" className="grid h-[35px] rounded-full bg-[#207cd3] px-[18px] text-sm font-semibold text-white place-items-center">
              Рекомендації
            </Link>
            <Link href="/channels" className="grid h-[35px] rounded-full border-2 border-[#207cd3] bg-white px-[18px] text-sm font-semibold text-[#207cd3] place-items-center">
              Нове
            </Link>
            <Link href="/channels" className="grid h-[35px] rounded-full border-2 border-[#207cd3] bg-white px-[18px] text-sm font-semibold text-[#207cd3] place-items-center">
              Топ
            </Link>
          </div>

          <div className="space-y-4">
            {channels.map((channel) => (
              <ChannelCard key={channel.slug} channel={channel} />
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-[10px] bg-white px-2 pb-2 pt-6">
          <h2 className="text-[22px] font-bold text-[#0f3a61]">Додати ютуб-канал</h2>
          {isAuthenticated ? (
            <>
              <p className="text-base text-black">
                Заповніть форму, щоб запропонувати канал.
                <br />
                <strong>Увага: розглядаються лише україномовні канали, російськомовні не додаються!</strong>
                <br />
                Перевірте, чи каналу ще немає на сайті. Статус запиту можна відстежувати в акаунті.
                Додавання безкоштовне. Дякуємо за підтримку українського контенту!
              </p>
              <Link href="/add-channel" className="grid h-10 w-full place-items-center rounded-lg bg-[#207cd3] text-base font-semibold text-white">
                Заповнити форму
              </Link>
            </>
          ) : (
            <>
              <p className="text-base text-black">
                Хочете поділитися цікавим україномовним каналом? Щоб запропонувати канал, увійдіть у свій акаунт.
              </p>
              <Link href="/auth/login" className="grid h-10 w-full place-items-center rounded-lg bg-[#207cd3] text-base font-semibold text-white">
                Увійти
              </Link>
            </>
          )}
        </section>

        <div className="pointer-events-none absolute bottom-[168px] right-[17px] z-10 flex w-[216px] flex-col items-end gap-2">
          <div className="rounded-[30px] bg-[#fddba5] px-3 py-2 text-center text-sm leading-[18px] text-black">
            Маєш проблеми з пошуком?
          </div>
          <div className="grid h-[70px] w-[70px] place-items-center rounded-full bg-[#fbb03b]">
            <img src="/figma-assets/help-star.svg" alt="Помічник" className="h-[37px] w-[37px]" />
          </div>
        </div>
      </main>

      <Footer />
    </MobileShell>
  );
}
