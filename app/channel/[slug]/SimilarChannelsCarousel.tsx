"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChannelItem } from "@/lib/channels";
import ChannelCard from "@/components/ChannelCard";

export function SimilarChannelsCarousel({ channels }: { channels: ChannelItem[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveFromScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const children = Array.from(el.children) as HTMLElement[];
    if (children.length === 0) return;

    const center = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;

    children.forEach((child, index) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const dist = Math.abs(childCenter - center);
      if (dist < minDist) {
        minDist = dist;
        closest = index;
      }
    });

    setActiveIndex(closest);
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement | undefined;
    if (!child) return;

    el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateActiveFromScroll, { passive: true });
    updateActiveFromScroll();
    return () => el.removeEventListener("scroll", updateActiveFromScroll);
  }, [channels.length, updateActiveFromScroll]);

  if (channels.length === 0) {
    return <p className="px-2 text-sm text-[#4d5a66]">Подібних каналів поки немає.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={scrollerRef}
        className="flex gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {channels.map((channel) => (
          <div key={channel.slug} className="w-[360px] shrink-0 snap-center">
            <ChannelCard channel={channel} />
          </div>
        ))}
      </div>

      {channels.length > 1 ? (
        <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Слайди подібних каналів">
          {channels.map((_, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Канал ${index + 1}`}
                onClick={() => scrollToIndex(index)}
                className={`h-2 w-2 rounded-full border ${
                  isActive ? "border-[#6cb1f0] bg-[#6cb1f0]" : "border-transparent bg-[#bbdbf8]"
                }`}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
