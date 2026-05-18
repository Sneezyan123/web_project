"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ThematicCollectionItem } from "@/lib/channels";
import { CollectionSortTabs } from "@/components/ui/app-ui";

export function CollectionsList({
  topics,
  activeSort,
}: {
  topics: ThematicCollectionItem[];
  activeSort: "alphabet" | "count" | "rating";
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter(
      (topic) => topic.label.toLowerCase().includes(q) || topic.name.toLowerCase().includes(q),
    );
  }, [topics, query]);

  return (
    <>
      <div className="flex h-10 w-full items-center justify-end gap-2 rounded-[10px] bg-[#ebeff2] px-[10px] py-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="search"
          aria-label="Пошук тематичних добірок"
          className="min-w-0 flex-1 bg-transparent text-[16px] font-normal text-[#0f3a61] outline-none"
        />
        <img src="/figma-assets/search.svg" alt="" className="size-5 shrink-0" aria-hidden />
      </div>

      <section className="flex flex-col gap-4">
        <CollectionSortTabs activeSort={activeSort} />

        <div className="flex flex-col gap-3">
          {filtered.map((topic) => (
            <Link
              key={topic.slug}
              href={`/collections/${topic.slug}`}
              className="flex h-10 w-full items-center justify-between rounded-[10px] bg-[#ebeff2] px-4 transition-colors hover:bg-[#e2e8ec]"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 text-[16px] leading-none">{topic.emoji}</span>
                <span className="truncate text-[14px] font-bold leading-normal text-[#0f3a61]">
                  {topic.label}
                </span>
              </div>
              <span className="shrink-0 text-[14px] font-semibold leading-normal text-[#0f3a61]">
                {topic.count}
              </span>
            </Link>
          ))}
          {filtered.length === 0 ? (
            <p className="px-1 text-sm text-[#4d5a66]">За цим пошуком добірок не знайдено.</p>
          ) : null}
        </div>
      </section>
    </>
  );
}
