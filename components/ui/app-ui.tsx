import Link from "next/link";
import type { ReactNode } from "react";

export function Breadcrumbs({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-[11px] leading-none text-black ${className}`}>{children}</p>;
}

export function SectionTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`text-[15px] font-bold leading-none text-[#0f3a61] ${className}`}>{children}</h2>;
}

export function AccountSectionTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`text-[22px] font-bold leading-none text-[#0f3a61] ${className}`}>{children}</h2>;
}

export function PageTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h1 className={`text-[18px] font-bold leading-none text-[#0f3a61] ${className}`}>{children}</h1>;
}

export function ViewAllLink({ href, children = "переглянути всі" }: { href: string; children?: string }) {
  return (
    <Link href={href} className="pb-[2px] text-[11px] leading-none text-[#4d5a66]">
      {children}
    </Link>
  );
}

export function CloseButton({ href }: { href: string }) {
  return (
    <Link href={href} aria-label="Закрити" className="flex h-6 w-6 items-center justify-center text-[#0f3a61]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </Link>
  );
}

export function ModalPage({
  title,
  closeHref,
  children,
  footer,
  largeTitle = false,
}: {
  title: string;
  closeHref: string;
  children: ReactNode;
  footer?: ReactNode;
  largeTitle?: boolean;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[376px] flex-col bg-white px-4 pb-6 pt-6 font-sans text-[#0f3a61]">
      <div className="mb-6 flex items-center justify-between">
        {largeTitle ? (
          <h1 className="text-[25px] font-semibold leading-[34.5px] text-[#0f3a61]">{title}</h1>
        ) : (
          <PageTitle>{title}</PageTitle>
        )}
        <CloseButton href={closeHref} />
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
      {footer ? <div className="mt-6 flex flex-col gap-4">{footer}</div> : null}
    </div>
  );
}

export function PrimaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <button
      type="button"
      className={`flex h-10 w-full items-center justify-center rounded-[8px] bg-[#207cd3] text-[16px] font-medium text-white transition-colors hover:bg-[#1a6bb8] disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function PrimaryLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`flex h-10 w-full items-center justify-center rounded-[8px] bg-[#207cd3] text-[16px] font-medium text-white transition-colors hover:bg-[#1a6bb8] ${className}`}
    >
      {children}
    </Link>
  );
}

export function InfoBanner({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[8px] border-2 border-[#bbdbf8] bg-white px-4 py-4 text-[14px] leading-normal text-[#1b2630]">
      {children}
    </div>
  );
}

export function RegistrationStepDots({ activeStep }: { activeStep: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {[1, 2, 3].map((step) => (
        <span
          key={step}
          className={`size-2 rounded-full ${
            step === activeStep ? "border border-[#6cb1f0] bg-[#6cb1f0]" : "bg-[#bbdbf8]"
          }`}
        />
      ))}
    </div>
  );
}

export function SearchField({
  placeholder = "Пошук...",
  defaultValue,
  name = "search",
  action,
  hiddenFields,
  className = "",
  iconPosition = "left",
}: {
  placeholder?: string;
  defaultValue?: string;
  name?: string;
  action?: string;
  hiddenFields?: Record<string, string>;
  className?: string;
  iconPosition?: "left" | "right";
}) {
  const icon = <img src="/figma-assets/search.svg" alt="" className="h-5 w-5 shrink-0" aria-hidden />;
  const input = (
    <input
      name={name}
      defaultValue={defaultValue}
      type="text"
      placeholder={placeholder}
      className="w-full min-w-0 bg-transparent text-[16px] font-normal text-[#0f3a61] outline-none placeholder:text-[#828e99]"
    />
  );

  return (
    <form
      method="GET"
      action={action}
      className={`flex h-10 w-full items-center gap-2 rounded-[10px] bg-[#ebeff2] px-[10px] py-2 ${className}`}
    >
      {iconPosition === "left" ? icon : null}
      {input}
      {hiddenFields
        ? Object.entries(hiddenFields).map(([key, value]) => <input key={key} type="hidden" name={key} value={value} />)
        : null}
      {iconPosition === "right" ? (
        <button type="submit" aria-label="Пошук" className="shrink-0">
          {icon}
        </button>
      ) : null}
    </form>
  );
}

function SortArrowIcon() {
  return <img src="/figma-assets/sort-arrows.svg" alt="" className="h-4 w-4 shrink-0" aria-hidden />;
}

function SortButtonsRow({
  children,
  className = "w-full max-w-[360px]",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`flex h-[35px] items-center gap-[10px] ${className}`}>{children}</div>;
}

function ChannelSortButton({
  href,
  label,
  width,
  compact,
  isActive,
}: {
  href: string;
  label: string;
  width: number;
  compact?: boolean;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      style={{ width, flexShrink: 0 }}
      className={`inline-flex h-[35px] shrink-0 items-center justify-center rounded-full border-2 py-[4px] leading-none ${
        compact ? "gap-[6px] pl-[6px] pr-[6px] text-[12px]" : isActive ? "gap-[6px] pl-[18px] pr-[14px] text-[14px]" : "gap-2 pl-[18px] pr-[14px] text-[14px]"
      } ${
        isActive
          ? "border-[#207cd3] bg-[#207cd3] font-semibold text-white"
          : "border-[#207cd3] bg-white font-normal text-[#207cd3]"
      }`}
    >
      <span className="whitespace-nowrap">{label}</span>
      <img
        src="/figma-assets/sort-arrows.svg"
        alt=""
        className={`h-4 w-4 shrink-0 ${isActive ? "brightness-0 invert" : ""}`}
        aria-hidden
      />
    </Link>
  );
}

const CHANNEL_SORT_ITEMS = [
  { id: "subs" as const, label: "Підписники", width: 134 },
  { id: "videos" as const, label: "Відео", width: 92 },
  { id: "rating" as const, label: "Оцінка", width: 102 },
];

const COLLECTION_SORT_ITEMS = [
  { id: "alphabet" as const, label: "Алфавіт", width: 107 },
  { id: "count" as const, label: "Кількість каналів", width: 131, compact: true },
];

export function CollectionChannelSortTabs({
  collectionPath,
  activeSort,
  search,
}: {
  collectionPath: string;
  activeSort: "subs" | "videos" | "rating";
  search?: string;
}) {
  function href(sort: (typeof CHANNEL_SORT_ITEMS)[number]["id"]) {
    const params = new URLSearchParams();
    if (sort !== "subs") params.set("sort", sort);
    if (search) params.set("search", search);
    const q = params.toString();
    return q ? `${collectionPath}?${q}` : collectionPath;
  }

  return (
    <SortButtonsRow>
      {CHANNEL_SORT_ITEMS.map((item) => (
        <ChannelSortButton
          key={item.id}
          href={href(item.id)}
          label={item.label}
          width={item.width}
          isActive={activeSort === item.id}
        />
      ))}
    </SortButtonsRow>
  );
}

export function ChannelsListSortTabs({
  basePath,
  activeSort,
  search,
  topic,
  language,
  duration,
}: {
  basePath: string;
  activeSort: "subs" | "videos" | "rating";
  search?: string;
  topic?: string;
  language?: string;
  duration?: string;
}) {
  function href(sort: (typeof CHANNEL_SORT_ITEMS)[number]["id"]) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (sort !== "subs") params.set("sort", sort);
    if (topic) params.set("topic", topic);
    if (language) params.set("language", language);
    if (duration) params.set("duration", duration);
    const q = params.toString();
    return q ? `${basePath}?${q}` : basePath;
  }

  return (
    <SortButtonsRow className="w-full max-w-[360px] px-[6px]">
      {CHANNEL_SORT_ITEMS.map((item) => (
        <ChannelSortButton
          key={item.id}
          href={href(item.id)}
          label={item.label}
          width={item.width}
          isActive={activeSort === item.id}
        />
      ))}
    </SortButtonsRow>
  );
}

export function SortTabs({
  basePath,
  activeSort,
  search,
  topic,
  topics,
  language,
  duration,
  extraParams,
}: {
  basePath: string;
  activeSort: "recommended" | "new" | "top";
  search?: string;
  topic?: string;
  topics?: string[];
  language?: string;
  duration?: string;
  extraParams?: Record<string, string>;
}) {
  const sorts: { id: "recommended" | "new" | "top"; label: string; minWidth: number }[] = [
    { id: "recommended", label: "Рекомендації", minWidth: 127 },
    { id: "new", label: "Нове", minWidth: 70 },
    { id: "top", label: "Топ", minWidth: 60 },
  ];

  function href(sort: string) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (sort !== "recommended") params.set("sort", sort);
    if (topic) params.set("topic", topic);
    if (language) params.set("language", language);
    if (duration) params.set("duration", duration);
    if (extraParams) {
      Object.entries(extraParams).forEach(([k, v]) => params.set(k, v));
    }
    const q = params.toString();
    return q ? `${basePath}?${q}` : basePath;
  }

  return (
    <div className="flex h-[35px] w-full max-w-[360px] items-center gap-[10px]">
      {sorts.map((sort) => (
        <Link
          key={sort.id}
          href={href(sort.id)}
          style={{ minWidth: sort.minWidth }}
          className={`inline-flex h-[35px] shrink-0 items-center justify-center rounded-full border-2 px-[18px] text-[14px] font-semibold leading-none ${
            activeSort === sort.id
              ? "border-transparent bg-[#207cd3] text-white"
              : "border-[#207cd3] bg-white text-[#207cd3]"
          }`}
        >
          {sort.label}
        </Link>
      ))}
    </div>
  );
}

export function CollectionSortTabs({
  activeSort,
  search,
}: {
  activeSort: "alphabet" | "count" | "rating";
  search?: string;
}) {
  return (
    <SortButtonsRow className="w-fit">
      {COLLECTION_SORT_ITEMS.map((item) => {
        const params = new URLSearchParams();
        if (item.id !== "alphabet") params.set("sort", item.id);
        if (search) params.set("search", search);
        const q = params.toString();
        const href = q ? `/collections?${q}` : "/collections";
        return (
          <ChannelSortButton
            key={item.id}
            href={href}
            label={item.label}
            width={item.width}
            compact={"compact" in item ? item.compact : false}
            isActive={activeSort === item.id}
          />
        );
      })}
    </SortButtonsRow>
  );
}

export function FilterIconLink({ href }: { href: string }) {
  return (
    <Link href={href} className="flex h-6 w-6 shrink-0 items-center justify-center text-[#0f3a61]" aria-label="Фільтри">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </svg>
    </Link>
  );
}

export function AssistantBubble() {
  return (
    <Link
      href="/assistant"
      className="fixed bottom-[150px] right-4 z-30 flex h-[118px] w-[216px] flex-col justify-end rounded-[10px] bg-[#d4e7fa] p-3 shadow-md"
      aria-label="AI помічник"
    >
      <p className="text-[12px] font-semibold leading-snug text-[#0f3a61]">Потрібна допомога? Запитай помічника!</p>
      <img src="/figma-assets/help-star.svg" alt="" className="absolute right-2 top-2 h-8 w-8" />
    </Link>
  );
}
