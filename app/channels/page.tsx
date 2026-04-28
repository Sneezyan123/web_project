import Link from "next/link";
import { getChannels } from "@/lib/channels";
import { getCurrentUser } from "@/lib/current-user";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChannelCard from "@/components/ChannelCard";

type SearchParams = Promise<{
  search?: string;
  sort?: "recommended" | "new" | "top";
  topic?: string;
}>;

export default async function ChannelsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const user = await getCurrentUser();
  
  const channels = await getChannels({
    sort: params.sort,
    topic: params.topic,
    search: params.search,
    limit: 100,
  });

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 max-w-md mx-auto relative shadow-xl overflow-x-hidden pb-10 flex flex-col justify-between">
      <div>
        <Header user={user} />

        <main className="px-4 pt-4 flex flex-col gap-5">
          {/* Breadcrumbs */}
          <div className="text-gray-400 text-[11px] font-medium pl-1">
            Головна / Канали
          </div>

          {/* Title */}
          <h1 className="text-[22px] font-bold text-blue-900 pl-1">
            Список україномовних ютуб-каналів
          </h1>

          {/* Search & Filter Funnel Row */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-[12px] px-4 py-2 flex-1 h-12 gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="Пошук..." 
                className="bg-transparent border-none outline-none text-sm text-gray-800 w-full placeholder-gray-400 font-medium"
              />
            </div>
            
            {/* Filter Funnel Icon (Blue) */}
            <Link 
              href="/filters" 
              className="w-12 h-12 bg-white rounded-[12px] flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </Link>
          </div>

          {/* Pill sorting row */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-300 text-blue-600 font-bold text-[12px] bg-blue-50/50 hover:bg-blue-50 transition-colors">
              <span>Підписники</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7 15 5 5 5-5"></path><path d="m7 9 5-5 5 5"></path>
              </svg>
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-300 text-blue-600 font-bold text-[12px] bg-blue-50/50 hover:bg-blue-50 transition-colors">
              <span>Відео</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7 15 5 5 5-5"></path><path d="m7 9 5-5 5 5"></path>
              </svg>
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-300 text-blue-600 font-bold text-[12px] bg-blue-50/50 hover:bg-blue-50 transition-colors">
              <span>Оцінка</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7 15 5 5 5-5"></path><path d="m7 9 5-5 5 5"></path>
              </svg>
            </button>
          </div>

          {/* Compact Channels List */}
          <div className="flex flex-col gap-3 mt-1">
            {channels.length === 0 ? (
              <p className="text-gray-400 text-center py-6">Нічого не знайдено.</p>
            ) : (
              channels.map((channel, i) => (
                <ChannelCard 
                  key={i} 
                  channel={channel} 
                  compact={true} 
                />
              ))
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
