import Link from "next/link";
import { getChannels } from "@/lib/channels";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChannelCard from "@/components/ChannelCard";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }

  const channels = await getChannels({ sort: "recommended", limit: 3 });

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 max-w-md mx-auto relative shadow-xl overflow-x-hidden pb-10 flex flex-col">
      <Header user={user} />

      <main className="px-4 pt-4 flex flex-col gap-6 flex-1">
        {/* User Info Block */}
        <div className="flex items-center gap-4 pl-1">
          <div className="w-[84px] h-[84px] relative rounded-full overflow-hidden shrink-0 border border-blue-50">
            <img 
              src={user.avatarUrl || "/assets/channel_I298_947;191:1886.png"} 
              alt="Avatar" 
              className="object-cover w-full h-full" 
            />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[20px] text-blue-900 truncate">{user.displayName}</span>
              <button className="text-blue-500 hover:text-blue-700">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[14px] text-gray-500 truncate">{user.email}</span>
              <button className="text-blue-500 hover:text-blue-700">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Action Blocks */}
        <div className="flex flex-col gap-3">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-[12px] flex items-center justify-center gap-2 shadow-sm transition-colors text-[15px]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/>
            </svg>
            YouTube підключено
          </button>

          <Link href="/auth/register/channels" className="w-full bg-blue-50 hover:bg-blue-100 rounded-[12px] h-12 px-4 flex items-center justify-between transition-colors shadow-sm">
            <span className="font-bold text-blue-900 text-[15px]">Вподобання</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Link>
        </div>

        {/* Bookmarked Channels */}
        <section className="flex flex-col gap-4">
          <h2 className="text-[18px] font-bold text-gray-900 pl-1">Збережені канали</h2>
          <div className="flex flex-col gap-3">
            {channels.map((channel, i) => (
              <ChannelCard 
                key={i} 
                channel={channel} 
                compact={true} 
              />
            ))}
          </div>
        </section>

        {/* CTA (Add YouTube Channel) */}
        <section className="flex flex-col gap-3">
          <h2 className="text-[18px] font-bold text-gray-900 pl-1">Додати ютуб-канал</h2>
          <p className="text-[14px] text-gray-700 leading-relaxed font-normal">
            Заповніть форму, щоб запропонувати канал.<br/>
            <strong className="font-bold">Увага: розглядаються лише україномовні канали, російськомовні не додаються!</strong><br/>
            Перевірте, чи каналу ще немає на сайті. Статус запиту можна відстежувати в акаунті. Додавання безкоштовне. Дякуємо за підтримку українського контенту!
          </p>
          <Link 
            href="/add-channel" 
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-center rounded-[12px] transition-all mt-1 shadow-sm text-[15px]"
          >
            Заповнити форму
          </Link>
        </section>

        {/* Added Channels (Your submissions) */}
        <section className="flex flex-col gap-4 mt-2">
          <h2 className="text-[18px] font-bold text-gray-900 pl-1">Ваші додані ютуб-канали</h2>
          
          <div className="flex items-center gap-2">
            <button className="px-5 py-2 rounded-full text-[13px] font-bold transition-all border bg-blue-600 text-white border-blue-600">
              На модерації
            </button>
            <button className="px-5 py-2 rounded-full text-[13px] font-medium transition-all border bg-white border-gray-200 text-gray-700 hover:bg-gray-50">
              Додано
            </button>
            <button className="px-5 py-2 rounded-full text-[13px] font-medium transition-all border bg-white border-gray-200 text-gray-700 hover:bg-gray-50">
              Відхилено
            </button>
          </div>

          <div className="mt-1">
            <ChannelCard channel={channels[0]} />
          </div>
        </section>

        {/* Logout Button */}
        <form action="/api/auth/logout" method="POST" className="mt-4 pl-1">
          <button 
            type="submit" 
            className="flex items-center justify-between w-full py-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-gray-700 font-bold text-[15px]">Вийти</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
