"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

function buildChannelsUrl(input: {
  search: string;
  sort: string;
  topic?: string;
  language?: string;
  duration?: string;
}) {
  const params = new URLSearchParams();
  if (input.search.trim()) params.set("search", input.search.trim());
  if (input.sort) params.set("sort", input.sort);
  if (input.topic) params.set("topic", input.topic);
  if (input.language) params.set("language", input.language);
  if (input.duration) params.set("duration", input.duration);
  const query = params.toString();
  return query ? `/channels?${query}` : "/channels";
}

export function ChannelsSearchBar({
  initialSearch,
  activeSort,
  activeTopic,
  activeLanguage,
  activeDuration,
}: {
  initialSearch: string;
  activeSort: string;
  activeTopic?: string;
  activeLanguage?: string;
  activeDuration?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialSearch);
  const lastPushedRef = useRef<string>("");
  const skipInitialNavigateRef = useRef(true);

  const base = useMemo(
    () => ({
      sort: activeSort,
      topic: activeTopic || undefined,
      language: activeLanguage || undefined,
      duration: activeDuration || undefined,
    }),
    [activeDuration, activeLanguage, activeSort, activeTopic],
  );

  const navigate = useCallback(
    (nextSearch: string) => {
      const url = buildChannelsUrl({
        search: nextSearch,
        sort: base.sort,
        topic: base.topic,
        language: base.language,
        duration: base.duration,
      });
      if (url === lastPushedRef.current) return;
      lastPushedRef.current = url;
      router.replace(url);
    },
    [base.duration, base.language, base.sort, base.topic, router],
  );

  useEffect(() => {
    setValue(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    if (skipInitialNavigateRef.current) {
      skipInitialNavigateRef.current = false;
      lastPushedRef.current = buildChannelsUrl({
        search: initialSearch,
        sort: base.sort,
        topic: base.topic,
        language: base.language,
        duration: base.duration,
      });
      return;
    }

    const id = window.setTimeout(() => {
      navigate(value);
    }, 300);
    return () => window.clearTimeout(id);
  }, [value, base.sort, base.topic, base.language, base.duration, navigate]);

  return (
    <form
      className="flex min-w-0 flex-1 items-center"
      onSubmit={(e) => {
        e.preventDefault();
        navigate(value);
      }}
    >
      <div className="flex h-10 w-full min-w-0 items-center justify-end gap-2 rounded-[10px] bg-[#ebeff2] px-[10px] py-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          placeholder="Пошук..."
          className="min-w-0 flex-1 bg-transparent text-left text-[16px] font-medium text-[#0f3a61] outline-none placeholder:text-[#9da8b2]"
        />
        <img src="/figma-assets/search.svg" alt="" className="h-5 w-5 shrink-0" />
      </div>
    </form>
  );
}
