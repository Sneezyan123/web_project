export default function CategoryBadge({ emoji, title, active = false }: { emoji: string; title: string; active?: boolean }) {
  return (
    <button 
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shrink-0 transition-colors ${
        active 
          ? 'bg-gray-100 border-gray-200 text-gray-900 font-medium' 
          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
      }`}
    >
      <span className="text-base">{emoji}</span>
      <span className="text-sm whitespace-nowrap">{title}</span>
    </button>
  );
}
