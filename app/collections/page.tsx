import Link from "next/link";
import { topicToSlug } from "@/lib/channels";
import { getCurrentUser } from "@/lib/current-user";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function CollectionsPage() {
  const user = await getCurrentUser();

  const fullTopicsList = [
    { name: "Летсплеї", emoji: "🕹️", count: 461 },
    { name: "Англійська мова", emoji: "🇺🇸", count: 63 },
    { name: "Книги", emoji: "📚", count: 126 },
    { name: "Ігрові світи та лор", emoji: "🎮", count: 1477 },
    { name: "Новини", emoji: "📰", count: 287 },
    { name: "Трукрайм", emoji: "🕵️", count: 126 },
    { name: "Аніме", emoji: "🌸", count: 106 },
    { name: "Навчання", emoji: "🎓", count: 126 },
    { name: "Наука", emoji: "🔬", count: 99 },
    { name: "Освіта", emoji: "🏫", count: 52 },
    { name: "Айті", emoji: "💻", count: 142 },
    { name: "Кіно", emoji: "🎬", count: 541 },
    { name: "Огляди", emoji: "🎤", count: 276 },
    { name: "Гумор", emoji: "😆", count: 190 },
    { name: "Подорожі", emoji: "✈️", count: 112 },
    { name: "Лайфстайл", emoji: "🛍️", count: 175 },
    { name: "Культура", emoji: "🏺", count: 492 },
    { name: "Міфологія", emoji: "🌋", count: 67 },
    { name: "Японська мова", emoji: "⛩️", count: 131 },
    { name: "Українська мова", emoji: "🇺🇦", count: 452 },
    { name: "Дизайн", emoji: "🎨", count: 305 },
    { name: "Іспанська мова", emoji: "🇪🇸", count: 121 },
    { name: "Кавери", emoji: "🎸", count: 138 },
    { name: "Стендап", emoji: "🕺", count: 146 },
    { name: "Озвучення", emoji: "🗣️", count: 109 },
    { name: "Інтерв'ю", emoji: "🎙️", count: 77 },
    { name: "Релігія", emoji: "🛐", count: 67 },
    { name: "Шахи", emoji: "♟️", count: 94 },
    { name: "Футбол", emoji: "⚽", count: 123 },
    { name: "Театр", emoji: "🎭", count: 88 },
    { name: "DIY", emoji: "🛠️", count: 158 },
    { name: "Подкасти", emoji: "🎙️", count: 215 },
    { name: "Французька мова", emoji: "🇫🇷", count: 97 },
    { name: "Музика", emoji: "🎵", count: 188 },
    { name: "Малювання", emoji: "🖌️", count: 140 },
    { name: "Космос", emoji: "🚀", count: 115 },
    { name: "Історія", emoji: "📜", count: 163 },
    { name: "Для дітей", emoji: "👶", count: 471 },
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 max-w-md mx-auto relative shadow-xl overflow-x-hidden pb-10 flex flex-col justify-between">
      <div>
        <Header user={user} />

        <main className="px-4 pt-4 flex flex-col gap-5">
          {/* Breadcrumbs */}
          <div className="text-gray-400 text-[11px] font-medium pl-1">
            Головна / Добірки
          </div>

          {/* Title */}
          <h1 className="text-[24px] font-bold text-blue-900 pl-1">Тематичні добірки</h1>

          {/* Search bar */}
          <div className="flex items-center bg-gray-100 rounded-[12px] px-4 py-2 h-12 gap-2 mt-1">
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

          {/* Sort options row */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-300 text-blue-600 font-bold text-[12px] bg-blue-50/50 hover:bg-blue-50 transition-colors">
              <span>Алфавіт</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7 15 5 5 5-5"></path><path d="m7 9 5-5 5 5"></path>
              </svg>
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-300 text-blue-600 font-bold text-[12px] bg-blue-50/50 hover:bg-blue-50 transition-colors">
              <span>Кількість каналів</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7 15 5 5 5-5"></path><path d="m7 9 5-5 5 5"></path>
              </svg>
            </button>
          </div>

          {/* Huge List of Topics */}
          <div className="flex flex-col gap-2 mt-2">
            {fullTopicsList.map((topic, i) => (
              <Link 
                key={i} 
                href={`/collections/${topicToSlug(topic.name)}`}
                className="w-full bg-[#EFF6FF]/60 border border-blue-50 hover:bg-blue-50 h-12 rounded-[12px] flex items-center justify-between px-4 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[16px]">{topic.emoji}</span>
                  <span className="text-[14px] text-blue-900 font-bold">{topic.name}</span>
                </div>
                <span className="text-[14px] text-blue-500 font-bold">{topic.count}</span>
              </Link>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
