"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ChannelSubmissionItem } from "@/lib/channels";

export function ModeratorSubmissions({ initialItems }: { initialItems: ChannelSubmissionItem[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleModeration(id: string, action: "approve" | "reject") {
    setLoadingId(id);
    setError("");
    try {
      const response = await fetch(`/api/moderation/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        setError(data.message ?? "Не вдалося обробити заявку");
        return;
      }
      router.refresh();
    } catch {
      setError("Не вдалося обробити заявку");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section className="flex flex-col gap-4 mt-2">
      <h2 className="text-[18px] font-bold text-gray-900 pl-1">Канали на модерації</h2>
      {initialItems.length === 0 ? (
        <p className="text-sm text-gray-500 pl-1">Немає активних заявок.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {initialItems.map((item) => (
            <div key={item.id} className="rounded-[12px] border border-gray-200 p-3">
              <p className="font-bold text-blue-900">{item.name}</p>
              <p className="text-xs text-gray-600 mt-1">{item.topic}</p>
              <p className="text-sm text-gray-700 mt-2 line-clamp-3">{item.about}</p>
              <a href={item.youtubeUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline mt-2 inline-block">
                Переглянути канал
              </a>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  disabled={loadingId === item.id}
                  onClick={() => handleModeration(item.id, "approve")}
                  className="px-3 py-1.5 rounded-full bg-green-600 text-white text-xs font-bold disabled:opacity-60"
                >
                  Прийняти
                </button>
                <button
                  type="button"
                  disabled={loadingId === item.id}
                  onClick={() => handleModeration(item.id, "reject")}
                  className="px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold disabled:opacity-60"
                >
                  Відхилити
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {error ? <p className="text-sm text-red-600 pl-1">{error}</p> : null}
    </section>
  );
}
