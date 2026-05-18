import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ChannelItem } from "@/lib/channels";
import { DEFAULT_AVATAR } from "@/lib/avatar-url";
import { formatChannelAboutHtml } from "@/lib/channel-about-html";

interface ChannelProps {
  channel: ChannelItem;
  isBookmarked?: boolean;
  grayStats?: boolean;
  compact?: boolean;
  showDetailsLink?: boolean;
  footerContent?: ReactNode;
}

function ChannelStats({ channel }: { channel: ChannelItem }) {
  const valueClass = "text-[25px] font-semibold leading-none text-[#207cd3]";

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex w-[120px] flex-col items-center gap-2">
        <p className="text-[11px] leading-[1.5] tracking-[-0.121px] text-[#9da8b2]">Підписники</p>
        <p className={`${valueClass} whitespace-nowrap text-center`}>{channel.subs}</p>
      </div>
      <div className="flex w-[92px] flex-col items-center gap-2">
        <p className="text-[11px] leading-[1.5] tracking-[-0.121px] text-[#9da8b2]">Відео</p>
        <p className={`${valueClass} whitespace-nowrap text-center`}>{channel.videos}</p>
      </div>
      <div className="flex w-[80px] flex-col items-center gap-2">
        <p className="text-[11px] leading-[1.5] tracking-[-0.121px] text-[#9da8b2]">Оцінка</p>
        <p className={`${valueClass} flex items-center justify-center gap-[4px] whitespace-nowrap`}>
          <img src="/figma-assets/star-small.svg" alt="" className="h-5 w-5" />
          {channel.rating}
        </p>
      </div>
    </div>
  );
}

export default function ChannelCard({
  channel,
  isBookmarked = false,
  compact = false,
  showDetailsLink = true,
  footerContent,
}: ChannelProps) {
  const card = (
    <article
      className={`relative w-full max-w-[360px] overflow-visible rounded-[10px] border-4 border-[#d4e7fa] bg-white ${
        compact ? "h-[124px]" : "h-[260px]"
      }`}
    >
      <div
        className={`absolute left-[18px] h-[60px] w-[60px] overflow-hidden rounded-full border-4 border-[#d4e7fa] bg-white ${compact ? "top-[-14px]" : "top-[-10px]"}`}
      >
        <Image
          src={channel.avatar || DEFAULT_AVATAR}
          alt={channel.name}
          width={60}
          height={60}
          className="h-full w-full object-cover"
        />
      </div>

      <div
        className={`absolute flex items-start justify-between ${
          compact ? "left-[93px] top-[12px] w-[247px]" : "left-[97px] right-4 top-4"
        }`}
      >
        <div className={`flex min-w-0 flex-col ${compact ? "w-[196px] gap-2" : "flex-1 gap-2"}`}>
          <h3 className="truncate text-[18px] font-bold leading-none text-[#0f3a61]">{channel.name}</h3>
          <p className="truncate text-[12px] leading-none text-[#0f3a61]">{channel.tags}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {compact && isBookmarked ? (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 3C7.45 3 7 3.45 7 4V21L12 18L17 21V4C17 3.45 16.55 3 16 3H8Z"
                fill="#207CD3"
              />
            </svg>
          ) : null}
          <img src="/figma-assets/youtube.svg" alt="YouTube" className="h-[30px] w-[40px]" />
        </div>
      </div>

      <div className={`absolute ${compact ? "left-[12px] top-[59px] w-[328px]" : "inset-x-4 top-[63px]"}`}>
        <ChannelStats channel={channel} />
      </div>

      {!compact && (
        <>
          <div
            className="absolute inset-x-4 top-[130px] line-clamp-4 h-[77px] overflow-hidden text-[14px] leading-[19px] text-[#1b2630] [&_a]:text-[#207cd3] [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: formatChannelAboutHtml(channel.about) }}
          />
          {showDetailsLink ? (
            <Link
              href={`/channel/${channel.slug}`}
              className="absolute bottom-3 left-4 flex items-center gap-1 text-[16px] font-semibold leading-none text-[#4fa1ed]"
            >
              <span>Переглянути інформацію</span>
              <img src="/figma-assets/chevron.svg" alt="" className="h-[18px] w-[18px]" />
            </Link>
          ) : null}
          {footerContent ? <div className="absolute bottom-3 left-4 right-4">{footerContent}</div> : null}
        </>
      )}
    </article>
  );

  if (compact) {
    return (
      <Link href={`/channel/${channel.slug}`} className="block">
        {card}
      </Link>
    );
  }

  return card;
}
