"use client";

import { useState } from "react";
import { ABOUT_FAQ } from "./about-content";

function FaqChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={`shrink-0 text-[#0f3a61] transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AboutFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex w-full max-w-[344px] flex-col gap-4">
      {ABOUT_FAQ.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question} className="w-full overflow-hidden rounded-[10px] bg-[#d4e7fa]">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-2 py-2 pl-[10px] pr-3 text-left"
            >
              <span className="flex-1 text-[16px] font-semibold leading-snug text-[#0f3a61]">{item.question}</span>
              <FaqChevron open={isOpen} />
            </button>
            {isOpen ? (
              <p className="break-words px-[10px] pb-3 text-[14px] font-normal leading-normal text-black">
                {item.answer}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
