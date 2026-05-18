import Link from "next/link";

function getPageWindow(current: number, total: number): number[] {
  if (total <= 3) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 2) return [1, 2, 3];
  if (current >= total - 1) return [total - 2, total - 1, total];
  return [current - 1, current, current + 1];
}

export function Pagination({
  currentPage,
  totalPages,
  makeHref,
}: {
  currentPage: number;
  totalPages: number;
  makeHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const windowPages = getPageWindow(currentPage, totalPages);
  const nextPage = Math.min(currentPage + 1, totalPages);
  const lastPage = totalPages;

  return (
    <nav className="flex items-center justify-center gap-4" aria-label="Пагінація">
      {windowPages.map((page) => {
        const isActive = page === currentPage;
        return (
          <Link
            key={page}
            href={makeHref(page)}
            className={`grid size-[35px] shrink-0 place-items-center rounded-full border-2 text-[14px] font-semibold leading-none ${
              isActive
                ? "border-[#207cd3] bg-[#207cd3] text-white"
                : "border-[#9ac9f4] bg-white text-[#6cb1f0]"
            }`}
          >
            {page}
          </Link>
        );
      })}

      <Link
        href={makeHref(nextPage)}
        className="grid size-[35px] shrink-0 place-items-center rounded-full border-2 border-[#9ac9f4] bg-white text-[#6cb1f0]"
        aria-label="Наступна сторінка"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      <Link
        href={makeHref(lastPage)}
        className="grid size-[35px] shrink-0 place-items-center rounded-full border-2 border-[#9ac9f4] bg-white text-[#6cb1f0]"
        aria-label="Остання сторінка"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 6L12 12L6 18M12 6L18 12L12 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </nav>
  );
}
