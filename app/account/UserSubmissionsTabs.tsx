"use client";

import { useMemo, useState } from "react";
import ChannelCard from "@/components/ChannelCard";
import type { ChannelItem, ChannelSubmissionItem } from "@/lib/channels";
import { DEFAULT_AVATAR } from "@/lib/avatar-url";

type SubmissionStatus = "pending" | "approved" | "rejected";

const STATUS_LABELS: Record<SubmissionStatus, string> = {
  pending: "На модерації",
  approved: "Додано",
  rejected: "Відхилено",
};

export function UserSubmissionsTabs({
  submissions,
  channelsByName,
  initialStatus,
}: {
  submissions: ChannelSubmissionItem[];
  channelsByName: Record<string, ChannelItem>;
  initialStatus: SubmissionStatus;
}) {
  const [activeStatus, setActiveStatus] = useState<SubmissionStatus>(initialStatus);

  const filteredSubmissions = useMemo(
    () => submissions.filter((submission) => submission.status === activeStatus),
    [activeStatus, submissions],
  );

  function handleStatusChange(status: SubmissionStatus) {
    setActiveStatus(status);
    const params = new URLSearchParams(window.location.search);
    params.set("submissionStatus", status);
    const nextSearch = params.toString();
    const nextUrl = nextSearch ? `${window.location.pathname}?${nextSearch}` : window.location.pathname;
    window.history.replaceState(null, "", nextUrl);
  }

  return (
    <>
      <div className="flex h-[35px] w-full max-w-[360px] flex-nowrap items-center gap-[10px]">
        {(["pending", "approved", "rejected"] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => handleStatusChange(status)}
            className={`grid h-[35px] shrink-0 place-items-center whitespace-nowrap rounded-full px-[18px] text-[14px] font-semibold leading-none transition-colors ${
              activeStatus === status
                ? "bg-[#207cd3] text-white"
                : "border-2 border-[#207cd3] bg-white text-[#207cd3]"
            }`}
          >
            {STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {filteredSubmissions.length === 0 ? (
        <p className="text-[16px] text-[#4d5a66]">
          У вас ще немає заявок зі статусом «{STATUS_LABELS[activeStatus]}».
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredSubmissions.map((submission) => {
            const linkedChannel = channelsByName[submission.name.trim().toLowerCase()];
            return (
              <ChannelCard
                key={submission.id}
                showDetailsLink={Boolean(linkedChannel)}
                channel={{
                  slug: linkedChannel?.slug ?? "pending-submission",
                  name: submission.name,
                  tags: submission.topic,
                  subs: linkedChannel?.subs ?? "—",
                  videos: linkedChannel?.videos ?? "—",
                  rating: linkedChannel?.rating ?? "—",
                  avatar: linkedChannel?.avatar ?? DEFAULT_AVATAR,
                  about: submission.about,
                  youtubeUrl: submission.youtubeUrl,
                  topic: submission.topic,
                  language: submission.language,
                  avgDuration: submission.avgDuration,
                }}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
