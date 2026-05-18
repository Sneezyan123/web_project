"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ChannelItem } from "@/lib/channels";

type EditableChannel = {
  slug: string;
  name: string;
  topic: string;
  about: string;
  youtubeUrl: string;
};

export function ModeratorChannelsManager({ initialChannels }: { initialChannels: ChannelItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState<EditableChannel[]>(
    initialChannels.map((item) => ({
      slug: item.slug,
      name: item.name,
      topic: item.topic,
      about: item.about,
      youtubeUrl: item.youtubeUrl,
    })),
  );
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [error, setError] = useState("");

  function onFieldChange(slug: string, field: keyof EditableChannel, value: string) {
    setItems((prev) => prev.map((item) => (item.slug === slug ? { ...item, [field]: value } : item)));
  }

  async function saveChannel(channel: EditableChannel) {
    setLoadingSlug(channel.slug);
    setError("");
    try {
      const response = await fetch(`/api/channels/${channel.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(channel),
      });
      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        setError(data.message ?? "Не вдалося оновити канал");
        return;
      }
      router.refresh();
    } catch {
      setError("Не вдалося оновити канал");
    } finally {
      setLoadingSlug(null);
    }
  }

  async function deleteChannel(slug: string) {
    setLoadingSlug(slug);
    setError("");
    try {
      const response = await fetch(`/api/channels/${slug}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        setError(data.message ?? "Не вдалося видалити канал");
        return;
      }
      setItems((prev) => prev.filter((item) => item.slug !== slug));
      router.refresh();
    } catch {
      setError("Не вдалося видалити канал");
    } finally {
      setLoadingSlug(null);
    }
  }

  return (
    <section className="flex flex-col gap-4 mt-2">
      <h2 className="text-[18px] font-bold text-gray-900 pl-1">Керування каналами</h2>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.slug} className="rounded-[12px] border border-gray-200 p-3 flex flex-col gap-2">
            <input
              value={item.name}
              onChange={(event) => onFieldChange(item.slug, "name", event.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              placeholder="Назва"
            />
            <input
              value={item.topic}
              onChange={(event) => onFieldChange(item.slug, "topic", event.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              placeholder="Тема"
            />
            <input
              value={item.youtubeUrl}
              onChange={(event) => onFieldChange(item.slug, "youtubeUrl", event.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              placeholder="YouTube URL"
            />
            <textarea
              value={item.about}
              onChange={(event) => onFieldChange(item.slug, "about", event.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm min-h-20"
              placeholder="Опис"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => saveChannel(item)}
                disabled={loadingSlug === item.slug}
                className="px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold disabled:opacity-60"
              >
                Зберегти
              </button>
              <button
                type="button"
                onClick={() => deleteChannel(item.slug)}
                disabled={loadingSlug === item.slug}
                className="px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold disabled:opacity-60"
              >
                Видалити
              </button>
            </div>
          </div>
        ))}
      </div>
      {error ? <p className="text-sm text-red-600 pl-1">{error}</p> : null}
    </section>
  );
}
