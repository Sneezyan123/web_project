"use client";

import { useState } from "react";

export function ChannelDescription({ html }: { html: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative w-full">
      <div
        className={`text-[16px] leading-normal text-[#303235] ${
          expanded ? "" : "max-h-[245px] overflow-hidden [mask-image:linear-gradient(180deg,#303235_65%,transparent_100%)]"
        }`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="mx-auto mt-2 flex h-6 w-6 items-center justify-center text-[#0f3a61]"
        aria-label={expanded ? "Згорнути опис" : "Розгорнути опис"}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  );
}
