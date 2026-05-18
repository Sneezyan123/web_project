import Link from "next/link";
import {
  FILTER_TOPICS,
  channelCountLabel,
  getChannels,
} from "@/lib/channels";
import { ModalPage, PrimaryLink } from "@/components/ui/app-ui";
import { decodeParam } from "@/lib/url-params";

type SearchParams = Promise<{
  search?: string;
  sort?: "subs" | "videos" | "rating";
  topic?: string;
  language?: string;
  duration?: "short" | "medium" | "long";
}>;

function buildChannelsHref(input: {
  search?: string;
  sort?: string;
  topic?: string;
  language?: string;
  duration?: string;
}) {
  const params = new URLSearchParams();
  if (input.search) params.set("search", input.search);
  if (input.sort && input.sort !== "subs") params.set("sort", input.sort);
  if (input.topic) params.set("topic", input.topic);
  if (input.language) params.set("language", input.language);
  if (input.duration) params.set("duration", input.duration);
  const query = params.toString();
  return query ? `/channels?${query}` : "/channels";
}

function FilterCheckbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${
        checked ? "border-[#207cd3] bg-[#207cd3]" : "border-[#dadfe5] bg-white"
      }`}
    >
      {checked ? (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
          <path
            d="M1 4L3.5 6.5L9 1"
            stroke="white"
            strokeWidth="1.67"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </span>
  );
}

const LANGUAGE_OPTIONS = [
  { id: "ukrainian", label: "Тільки українська" },
  { id: "bilingual", label: "Двомовні (з українською)" },
] as const;

const DURATION_OPTIONS = [
  { id: "short", label: "Короткі (до 10 хвилин)" },
  { id: "medium", label: "Середні (10-30 хвилин)" },
  { id: "long", label: "Довгі (більше 30 хвилин)" },
] as const;

export default async function FiltersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const activeSort: "subs" | "videos" | "rating" =
    params.sort === "videos" || params.sort === "rating" ? params.sort : "subs";
  const activeSearch = decodeParam(params.search ?? "");
  const activeTopic = decodeParam(params.topic ?? "");
  const activeLanguage = decodeParam(params.language ?? "");
  const activeDuration = decodeParam(params.duration ?? "");

  const matchedChannels = await getChannels({
    search: activeSearch,
    sort: activeSort,
    topic: activeTopic || undefined,
    language: activeLanguage || undefined,
    duration: activeDuration as "short" | "medium" | "long" | undefined,
    limit: 200,
  });

  const applyHref = buildChannelsHref({
    search: activeSearch,
    sort: activeSort,
    topic: activeTopic,
    language: activeLanguage,
    duration: activeDuration,
  });
  const resetHref = buildChannelsHref({
    search: activeSearch,
    sort: activeSort,
  });

  const filterBase = {
    search: activeSearch,
    sort: activeSort,
    topic: activeTopic,
    language: activeLanguage,
    duration: activeDuration,
  };

  return (
    <ModalPage
      title="Фільтри"
      closeHref={applyHref}
      largeTitle
      footer={
        <>
          <PrimaryLink href={applyHref}>Показати {channelCountLabel(matchedChannels.length)}</PrimaryLink>
          <Link
            href={resetHref}
            className="flex h-10 w-full items-center justify-center rounded-[8px] border-2 border-[#9e9e9e] text-[16px] font-semibold text-[#207cd3] transition-colors hover:bg-[#ebeff2]"
          >
            Скинути
          </Link>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-2">
          <h2 className="text-[16px] font-semibold leading-[22px] text-black">Тематика</h2>
          <div className="flex flex-wrap gap-3">
            {FILTER_TOPICS.map((theme) => {
              const isActive = activeTopic === theme;
              return (
                <Link
                  key={theme}
                  href={buildChannelsHref({
                    ...filterBase,
                    topic: isActive ? undefined : theme,
                  })}
                  className={`flex h-[31px] items-center gap-1.5 rounded-[6px] px-3 text-[14px] font-semibold transition-colors ${
                    isActive ? "bg-[#4fa1ed] text-white" : "bg-[#eaeef2] text-[#0f3a61]"
                  }`}
                >
                  <span>{theme}</span>
                  {!isActive ? <span className="text-[#24313d]">+</span> : null}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-1.5">
          <h2 className="text-[16px] font-semibold leading-[22px] text-black">Мова</h2>
          <div className="flex flex-col gap-2">
            {LANGUAGE_OPTIONS.map((option) => {
              const isActive = activeLanguage === option.id;
              return (
                <Link
                  key={option.id}
                  href={buildChannelsHref({
                    ...filterBase,
                    language: isActive ? undefined : option.id,
                  })}
                  className="flex h-[27px] items-center gap-2 rounded-[6px] bg-white text-[14px] font-normal text-[#0f3a61]"
                >
                  <FilterCheckbox checked={isActive} />
                  <span>{option.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-1.5">
          <h2 className="text-[16px] font-semibold leading-[22px] text-black">
            Тривалість відео (в середньому)
          </h2>
          <div className="flex flex-col gap-2">
            {DURATION_OPTIONS.map((option) => {
              const isActive = activeDuration === option.id;
              return (
                <Link
                  key={option.id}
                  href={buildChannelsHref({
                    ...filterBase,
                    duration: isActive ? undefined : option.id,
                  })}
                  className="flex h-[27px] items-center gap-2 rounded-[6px] bg-white text-[14px] font-normal text-[#0f3a61]"
                >
                  <FilterCheckbox checked={isActive} />
                  <span>{option.label}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </ModalPage>
  );
}
