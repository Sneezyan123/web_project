import Link from "next/link";
import { getChannels } from "@/lib/channels";

export default async function RegisterChannelsPage() {
  const channels = await getChannels({ sort: "recommended", limit: 10 });

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 max-w-md mx-auto relative shadow-xl px-6 pt-6 flex flex-col pb-10 justify-between">
      <div>
        {/* Top Header with Close Button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[24px] font-bold text-blue-900 pl-1">Що вам подобається?</h1>
          <Link href="/" aria-label="Закрити" className="p-2 -mr-2 text-gray-900 hover:opacity-70 transition-opacity">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Link>
        </div>

        {/* Info Banner Block */}
        <div className="bg-blue-50/50 rounded-[16px] p-5 border border-blue-50 flex flex-col gap-3">
          <p className="text-[13px] text-gray-800 font-medium leading-relaxed">
            Оберіть ваші вподобання <strong className="font-bold">(канали)</strong> для персоналізованих рекомендацій!
          </p>
        </div>

        {/* Search bar */}
        <div className="flex items-center bg-gray-100 rounded-[12px] px-4 py-2 h-12 gap-2 mt-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Шукайте свої улюблені канали" 
            className="bg-transparent border-none outline-none text-sm text-gray-800 w-full placeholder-gray-400 font-medium"
          />
        </div>

        {/* Channels List with Pluses */}
        <div className="flex flex-col gap-3 mt-6">
          {channels.map((channel, i) => (
            <div 
              key={i} 
              className="w-full bg-[#EFF6FF]/60 border border-blue-50 rounded-[12px] flex items-center justify-between px-4 py-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-blue-100 -ml-1">
                  <img src={channel.avatar || "/assets/channel_I298_947;191:1886.png"} alt={channel.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] text-blue-900 font-bold line-clamp-1">{channel.name}</span>
                  <span className="text-[11px] text-gray-400 line-clamp-1 font-medium">{channel.tags?.join(", ") || "Інше"}</span>
                </div>
              </div>
              <button className="w-8 h-8 rounded-full flex items-center justify-center text-blue-900 hover:bg-blue-100/40 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Block */}
      <div className="flex flex-col gap-4 mt-8">
        {/* Dots Indicator */}
        <div className="flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-200"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-blue-200"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></span>
        </div>

        <Link 
          href="/auth/register/success" 
          className="w-full h-12 rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center shadow-sm transition-colors"
        >
          Зареєструватись
        </Link>

        <div className="text-center mt-1">
          <Link href="/auth/register/topics" className="text-sm font-bold text-blue-600 hover:underline">
            Назад
          </Link>
        </div>
      </div>
    </div>
  );
}
