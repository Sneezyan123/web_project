import Link from "next/link";
import Image from "next/image";
import { getChannels, getTopics } from "@/lib/channels";
import { getCurrentUser } from "@/lib/current-user";
import { getBookmarkedChannels } from "@/lib/bookmarks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChannelCard from "@/components/ChannelCard";

type SearchParams = Promise<{
  search?: string;
  sort?: "recommended" | "new" | "top";
  topic?: string;
}>;

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const user = await getCurrentUser();
  
  const channels = await getChannels({
    sort: params.sort,
    topic: params.topic,
    search: params.search,
  });
  
  const topics = await getTopics();
  const savedChannels = user ? await getBookmarkedChannels(user.id) : [];
  
  const activeSort = params.sort ?? "recommended";
  const activeTopic = params.topic ?? "";

  const topicsList = [
    { name: "Англійська мова", emoji: "🇺🇸" },
    { name: "Ігрові світи та лор", emoji: "🎮" },
    { name: "Книги", emoji: "📚" },
    { name: "Трукрайм", emoji: "👮" },
    { name: "Аніме", emoji: "🌸" },
    { name: "Шортси", emoji: "🎬" },
    { name: "Новини", emoji: "📰" },
    { name: "Навчання", emoji: "📝" },
    { name: "Летсплеї", emoji: "🕹" },
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 max-w-md mx-auto relative shadow-xl overflow-x-hidden pb-10">
      <Header user={user} />

      <main className="px-4 pt-4 flex flex-col gap-6">
        {/* Saved Banner ("Збережені канали") */}
        <Link href="/account?tab=bookmarks" className="bg-blue-50 hover:bg-blue-100 transition-colors rounded-[12px] h-12 px-4 flex items-center justify-between mt-2">
          <span className="font-bold text-gray-800 text-[15px]">Збережені канали</span>
          <div className="flex items-center gap-3">
            <span className="bg-white text-gray-800 font-bold text-xs h-6 px-3 rounded-full flex items-center justify-center shadow-sm">
              {savedChannels.length || 3}
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </Link>

        {/* Thematic Selections Block */}
        <section className="flex flex-col gap-4 mt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-gray-900">Тематичні добірки</h2>
            <Link href="/filters" className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors">
              переглянути всі
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {topicsList.map((topic, i) => {
              const isActive = topic.name === activeTopic;
              return (
                <Link 
                  href={`/?topic=${encodeURIComponent(topic.name)}&sort=${activeSort}`} 
                  key={i}
                  className={`flex items-center gap-2 py-1.5 px-4 rounded-full border text-[13px] font-medium transition-colors ${isActive ? "bg-blue-600 text-white border-blue-600" : "bg-gray-50/50 border-gray-100 text-gray-700 hover:bg-gray-100"}`}
                >

                  <span>{topic.emoji}</span>
                  <span>{topic.name}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* YouTube Channels Block */}
        <section className="flex flex-col gap-4 mt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-gray-900">Ютуб-канали</h2>
            <Link href="/channels" className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors">
              переглянути всі
            </Link>
          </div>

          {/* Sort Toggles */}
          <div className="flex items-center gap-2">
            <Link 
              href={`/?sort=recommended${activeTopic ? `&topic=${encodeURIComponent(activeTopic)}` : ""}`}
              className={`px-6 py-1.5 rounded-full text-[13px] font-semibold transition-all border ${activeSort === "recommended" ? "bg-blue-600 text-white border-blue-600" : "bg-white border-blue-500 text-blue-500"}`}
            >
              Рекомендації
            </Link>
            <Link 
              href={`/?sort=new${activeTopic ? `&topic=${encodeURIComponent(activeTopic)}` : ""}`}
              className={`px-6 py-1.5 rounded-full text-[13px] font-semibold transition-all border ${activeSort === "new" ? "bg-blue-600 text-white border-blue-600" : "bg-white border-blue-500 text-blue-500"}`}
            >
              Нове
            </Link>
            <Link 
              href={`/?sort=top${activeTopic ? `&topic=${encodeURIComponent(activeTopic)}` : ""}`}
              className={`px-6 py-1.5 rounded-full text-[13px] font-semibold transition-all border ${activeSort === "top" ? "bg-blue-600 text-white border-blue-600" : "bg-white border-blue-500 text-blue-500"}`}
            >
              Топ
            </Link>
          </div>

          {/* Channels List */}
          <div className="flex flex-col gap-5 mt-2">
            {channels.length === 0 ? (
              <p className="text-gray-400 text-center py-6">Нічого не знайдено.</p>
            ) : (
              channels.map((channel, i) => (
                <ChannelCard 
                  key={i} 
                  channel={channel} 
                  isBookmarked={savedChannels.some(sc => sc.slug === channel.slug)} 
                />
              ))
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="flex flex-col gap-3 mt-4">
          <h2 className="text-[18px] font-bold text-gray-900">Додати ютуб-канал</h2>
          {user ? (
            <>
              <p className="text-[14px] text-gray-700 leading-relaxed font-normal">
                Заповніть форму, щоб запропонувати канал.<br/>
                <strong className="font-bold">Увага: розглядаються лише україномовні канали, російськомовні не додаються!</strong><br/>
                Перевірте, чи каналу ще немає на сайті. Статус запиту можна відстежувати в акаунті. Додавання безкоштовне. Дякуємо за підтримку українського контенту!
              </p>
              <Link 
                href="/add-channel" 
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-center rounded-[12px] transition-all mt-1 shadow-sm"
              >
                Заповнити форму
              </Link>
            </>
          ) : (
            <>
              <p className="text-[14px] text-gray-700 leading-relaxed font-normal">
                Хочете поділитися цікавим україномовним каналом? Додайте його на U2U, щоб більше українців могли дізнатися про нових авторів!<br/>
                <strong className="font-bold">Увага: розглядаються лише україномовні канали, російськомовні не додаються!</strong><br/>
                Щоб запропонувати канал, <span className="font-bold">увійдіть у свій акаунт</span> і заповніть просту форму.
              </p>
              <Link 
                href="/auth/login" 
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-center rounded-[12px] transition-all mt-1 shadow-sm"
              >
                Увійти або зареєструватись
              </Link>
            </>
          )}

        </section>
      </main>

      {/* Floating Assistant Bubble */}
      <Link href="/assistant" className="fixed bottom-6 right-6 w-14 h-14 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-transform active:scale-95 z-50">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </Link>
      
      <Footer />
    </div>
  );
}
