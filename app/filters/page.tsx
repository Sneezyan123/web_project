import Link from "next/link";

export default async function FiltersPage() {
  const themes = [
    "Освіта", "Гумор", "Подорожі", "Музика", 
    "Технології", "Геймінг", "Кулінарія", "Лайфстайл", 
    "Мистецтво", "Новини та аналітика", "Історія та документалістика", "DIY"
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 max-w-md mx-auto relative shadow-xl px-6 pt-6 flex flex-col pb-10 justify-between">
      <div>
        {/* Top Header with Close Button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[28px] font-bold text-blue-900 pl-1">Фільтри</h1>
          <Link href="/channels" aria-label="Закрити" className="p-2 -mr-2 text-gray-900 hover:opacity-70 transition-opacity">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Link>
        </div>

        {/* Тематика Section */}
        <div className="flex flex-col gap-3 mt-4">
          <h2 className="text-[16px] font-bold text-gray-900 pl-1">Тематика</h2>
          <div className="flex flex-wrap gap-2 pl-1">
            {themes.map((theme, i) => (
              <button 
                key={i} 
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-blue-900 font-bold text-[13px] transition-colors"
              >
                <span>{theme}</span>
                <span className="text-gray-400 font-normal">+</span>
              </button>
            ))}
          </div>
        </div>

        {/* Мова Section */}
        <div className="flex flex-col gap-3 mt-6 pl-1">
          <h2 className="text-[16px] font-bold text-gray-900">Мова</h2>
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3 cursor-pointer select-none text-[14px] text-blue-900 font-medium">
              <input type="checkbox" className="w-5 h-5 rounded border border-blue-200 text-blue-600 focus:ring-blue-500 accent-blue-600" />
              <span>Тільки українська</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer select-none text-[14px] text-blue-900 font-medium">
              <input type="checkbox" className="w-5 h-5 rounded border border-blue-200 text-blue-600 focus:ring-blue-500 accent-blue-600" />
              <span>Двомовні (з українською)</span>
            </label>
          </div>
        </div>

        {/* Тривалість Section */}
        <div className="flex flex-col gap-3 mt-6 pl-1">
          <h2 className="text-[16px] font-bold text-gray-900">Тривалість відео (в середньому)</h2>
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3 cursor-pointer select-none text-[14px] text-blue-900 font-medium">
              <input type="checkbox" className="w-5 h-5 rounded border border-blue-200 text-blue-600 focus:ring-blue-500 accent-blue-600" />
              <span>Короткі (до 10 хвилин)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer select-none text-[14px] text-blue-900 font-medium">
              <input type="checkbox" className="w-5 h-5 rounded border border-blue-200 text-blue-600 focus:ring-blue-500 accent-blue-600" />
              <span>Середні (10-30 хвилин)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer select-none text-[14px] text-blue-900 font-medium">
              <input type="checkbox" className="w-5 h-5 rounded border border-blue-200 text-blue-600 focus:ring-blue-500 accent-blue-600" />
              <span>Довгі (більше 30 хвилин)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Block Buttons */}
      <div className="flex flex-col items-center gap-4 mt-8">
        <Link 
          href="/channels" 
          className="w-full h-12 rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center shadow-sm transition-colors"
        >
          Показати 10 каналів
        </Link>
        <Link href="/channels" className="text-blue-500 font-bold text-[16px] hover:underline">
          Скинути
        </Link>
      </div>
    </div>
  );
}
