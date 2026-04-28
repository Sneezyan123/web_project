import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 px-4 py-8 flex flex-col gap-6 max-w-md mx-auto">
      <div className="flex justify-between items-center">
        {/* Left Section */}
        <div className="flex flex-col items-start gap-1">
          <Image 
            src="/assets/layer_2.svg" 
            alt="UU Logo" 
            width={48} 
            height={48} 
            className="w-12 h-12"
          />
          <span className="text-[12px] font-semibold text-blue-500">Ukrainians to Ukrainians</span>
        </div>
        
        {/* Right Section */}
        <div className="flex flex-col items-end gap-2 text-right">
          <span className="text-[12px] font-bold text-gray-800 leading-tight">
            Підтримуй українське!<br/>Шукай нас у соцмережах!
          </span>
          
          <div className="flex items-center justify-end gap-2 mt-1">
            <a href="#" className="w-8 h-8 rounded-full border border-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
