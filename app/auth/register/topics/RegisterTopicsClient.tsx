"use client";

import { useMemo, useState } from "react";

export type TopicItem = { name: string; emoji: string };

export function RegisterTopicsClient({ topics }: { topics: TopicItem[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const sortedTopics = useMemo(
    () => [...topics].sort((a, b) => a.name.localeCompare(b.name, "uk")),
    [topics],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sortedTopics;
    return sortedTopics.filter((t) => t.name.toLowerCase().includes(q));
  }, [sortedTopics, query]);

  function toggleTopic(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-10 w-full items-center justify-end gap-2 rounded-[10px] bg-[#ebeff2] px-[10px] py-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Пошук тематичних добірок."
          className="min-w-0 flex-1 bg-transparent text-[16px] font-normal text-[#0f3a61] outline-none placeholder:text-[#828e99]"
        />
        <img src="/figma-assets/search.svg" alt="" className="size-5 shrink-0" />
      </div>

      <div className="u2u-scrollbar max-h-[278px] overflow-y-auto pr-[3px]">
        <div className="flex flex-wrap justify-center gap-2">
          {filtered.map((topic) => {
            const isActive = selected.has(topic.name);
            return (
              <button
                key={topic.name}
                type="button"
                onClick={() => toggleTopic(topic.name)}
                className={`flex h-[34px] shrink-0 items-center gap-2 rounded-full px-4 text-[16px] font-semibold leading-normal transition-colors ${
                  isActive ? "bg-[#4fa1ed] text-white" : "bg-[#ebeff2] text-[#0f3a61]"
                }`}
              >
                <span>{topic.emoji}</span>
                <span>{topic.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
