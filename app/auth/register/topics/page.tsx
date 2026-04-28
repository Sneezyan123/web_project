import Link from "next/link";

export default async function RegisterTopicsPage() {
  const topicsList = [
    { name: "Англійська мова", emoji: "🇺🇸" },
    { name: "Аніме", emoji: "🌸" },
    { name: "Айті", emoji: "💻" },
    { name: "Гумор", emoji: "😆" },
    { name: "Дизайн", emoji: "🎨" },
    { name: "Для дітей", emoji: "👶" },
    { name: "Ігрові світи та лор", emoji: "🎮" },
    { name: "Інтерв'ю", emoji: "🎙️" },
    { name: "Іспанська мова", emoji: "🇪🇸" },
    { name: "Історія", emoji: "📜" },
    { name: "Кавери", emoji: "🎸" },
    { name: "Кіно", emoji: "🎬" },
    { name: "Книги", emoji: "📚" },
  ];

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
            Оберіть ваші вподобання <strong className="font-bold">(тематичні добірки)</strong> для персоналізованих рекомендацій!
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
            placeholder="Пошук тематичних добірок." 
            className="bg-transparent border-none outline-none text-sm text-gray-800 w-full placeholder-gray-400 font-medium"
          />
        </div>

        {/* Pill list wrapped neatly */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {topicsList.map((topic, i) => (
            <button 
              key={i} 
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-[#EFF6FF]/60 hover:bg-blue-50 transition-colors text-blue-900 font-bold text-[13px] shadow-sm"
            >
              <span>{topic.emoji}</span>
              <span>{topic.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Block */}
      <div className="flex flex-col gap-4 mt-8">
        {/* Dots Indicator */}
        <div className="flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-200"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-blue-200"></span>
        </div>

        <Link 
          href="/auth/register/channels" 
          className="w-full h-12 rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center shadow-sm transition-colors"
        >
          Далі
        </Link>

        <div className="flex items-center justify-between px-6 mt-1">
          <Link href="/auth/register" className="text-sm font-bold text-blue-600 hover:underline">
            Назад
          </Link>
          <Link href="/auth/register/channels" className="text-sm font-bold text-blue-600 hover:underline">
            Пропустити
          </Link>
        </div>
      </div>
    </div>
  );
}
