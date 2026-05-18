"use client";

import Image from "next/image";
import type { ChannelItem } from "@/lib/channels";
import { useMemo, useState } from "react";

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 5v14M5 12h14" stroke="#0F3A61" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12.5 9.5 17 19 7"
        stroke="#207CD3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RegisterChannelsClient({
  channels,
  selected,
  onToggle,
}: {
  channels: ChannelItem[];
  selected: Set<string>;
  onToggle: (slug: string) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return channels;
    return channels.filter(
      (channel) =>
        channel.name.toLowerCase().includes(q) || channel.tags.toLowerCase().includes(q),
    );
  }, [channels, query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-10 w-full">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="text"
          placeholder="Шукайте свої улюблені канали"
          className="h-10 w-full rounded-[10px] bg-[#EBEFF2] px-[10px] pr-10 text-[16px] font-normal text-[#0F3A61] outline-none placeholder:text-[#828E99]"
        />
        <img
          src="/figma-assets/search.svg"
          alt=""
          className="pointer-events-none absolute right-[10px] top-1/2 size-5 -translate-y-1/2"
        />
      </div>

      <div className="u2u-scrollbar max-h-[278px] overflow-y-auto overflow-x-hidden pt-3 pb-4 pr-1">
        <div className="flex flex-col gap-5">
          {filtered.map((channel) => {
            const isSelected = selected.has(channel.slug);
            return (
              <button
                key={channel.slug}
                type="button"
                onClick={() => onToggle(channel.slug)}
                className="relative h-[60px] w-full shrink-0 rounded-[10px] border-4 border-[#D4E7FA] bg-white text-left"
              >
                <div className="absolute left-[18px] top-[-12px] size-[50px] overflow-hidden rounded-full border-4 border-[#D4E7FA]">
                  <Image
                    src={channel.avatar || "/figma-assets/avatar-header.png"}
                    alt={channel.name}
                    width={50}
                    height={50}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="absolute left-[88px] top-[6px] flex h-10 w-[calc(100%-100px)] items-center justify-between pr-2">
                  <div className="min-w-0 pr-2">
                    <p className="truncate text-[18px] font-bold leading-none text-[#0F3A61]">
                      {channel.name}
                    </p>
                    <p className="mt-2 truncate text-[12px] leading-none text-[#0F3A61]">
                      {channel.tags || "Інше"}
                    </p>
                  </div>
                  <span className="grid size-6 shrink-0 place-items-center">
                    {isSelected ? <CheckIcon /> : <PlusIcon />}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
