import Image from 'next/image';
import Link from 'next/link';
import type { ChannelItem } from '@/lib/channels';

interface ChannelProps {
  channel: ChannelItem;
  isBookmarked?: boolean;
  grayStats?: boolean;
  compact?: boolean;
}

export default function ChannelCard({ channel, isBookmarked = false, grayStats = false, compact = false }: ChannelProps) {
  const content = (
    <div className={`bg-white rounded-[24px] border border-blue-100 flex flex-col relative ${compact ? 'p-4 gap-2' : 'p-5 gap-4'}`}>
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`${compact ? 'w-12 h-12' : 'w-14 h-14'} relative rounded-full overflow-hidden shrink-0`}>
            <Image 
              src={channel.avatar || "/assets/channel_I298_947;191:1886.png"} 
              alt={channel.name} 
              width={56} 
              height={56} 
              className="object-cover w-full h-full" 
            />
          </div>
          <div className="flex flex-col">
            <h3 className={`font-bold text-gray-900 leading-tight ${compact ? 'text-[15px]' : 'text-[18px]'}`}>
              {channel.name}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{channel.tags}</p>
          </div>
        </div>
        
        {/* YouTube Red Icon */}
        <div className="text-red-600 shrink-0">
          <svg width={compact ? "24" : "28"} height={compact ? "24" : "28"} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/>
          </svg>
        </div>
      </div>

      {/* Stats Row */}
      <div className={`${grayStats ? 'bg-[#F9FAFB] rounded-[16px] p-4' : ''} flex items-center justify-between text-center px-2 py-1`}>
        <div className="flex flex-col items-center flex-1">
          <span className="text-gray-400 text-[10px] mb-1">Підписники</span>
          <span className={`${grayStats ? 'text-gray-900' : 'text-blue-600'} font-bold ${compact ? 'text-[15px]' : 'text-[18px]'}`}>{channel.subs}</span>
        </div>
        {grayStats && <div className="w-px h-8 bg-gray-200/50"></div>}
        <div className="flex flex-col items-center flex-1">
          <span className="text-gray-400 text-[10px] mb-1">Відео</span>
          <span className={`${grayStats ? 'text-gray-900' : 'text-blue-600'} font-bold ${compact ? 'text-[15px]' : 'text-[18px]'}`}>{channel.videos}</span>
        </div>
        {grayStats && <div className="w-px h-8 bg-gray-200/50"></div>}
        <div className="flex flex-col items-center flex-1">
          <span className="text-gray-400 text-[10px] mb-1">Оцінка</span>
          <span className={`${grayStats ? 'text-gray-900' : 'text-blue-600'} font-bold ${compact ? 'text-[15px]' : 'text-[18px]'} flex items-center gap-1 justify-center`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" strokeWidth="1" className="translate-y-[-1px]">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            {channel.rating}
          </span>
        </div>
      </div>

      {/* Description */}
      {!compact && (
        <div className="text-[14px] text-gray-700 leading-relaxed font-normal">
          {channel.about}
        </div>
      )}

      {/* Link to detail */}
      {!compact && (
        <Link href={`/channel/${channel.slug}`} className="flex items-center justify-center text-blue-500 font-semibold text-[14px] gap-2 mt-1 py-1 hover:text-blue-600 transition-colors">
          <span>Переглянути інформацію</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </Link>
      )}
    </div>
  );

  return compact ? (
    <Link href={`/channel/${channel.slug}`} className="block">
      {content}
    </Link>
  ) : content;
}
