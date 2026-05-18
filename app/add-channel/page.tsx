"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { RichTextInput } from "./rich-text-input";
import { MultilineText } from "@/components/MultilineText";
import { ADD_CHANNEL_WARNING, ADD_CHANNEL_ATTENTION_BOLD } from "@/lib/copy";
import { REGISTER_TOPIC_OPTIONS } from "@/lib/thematic-topics";
import { ModalPage, PrimaryButton } from "@/components/ui/app-ui";

function topicEmoji(name: string) {
  return REGISTER_TOPIC_OPTIONS.find((t) => t.name === name)?.emoji ?? "";
}

export default function AddChannelPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [aboutHtml, setAboutHtml] = useState("");
  const [topicSearch, setTopicSearch] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const filteredTopicOptions = useMemo(() => {
    const normalizedSearch = topicSearch.trim().toLowerCase();
    return REGISTER_TOPIC_OPTIONS.filter(
      (option) =>
        !selectedTopics.includes(option.name) &&
        (!normalizedSearch || option.name.toLowerCase().includes(normalizedSearch)),
    ).sort((a, b) => a.name.localeCompare(b.name, "uk"));
  }, [selectedTopics, topicSearch]);

  const canAddMoreTopics = selectedTopics.length < 3;

  function addTopic(topic: string) {
    if (!canAddMoreTopics || selectedTopics.includes(topic)) return;
    setSelectedTopics((prev) => [...prev, topic]);
    setTopicSearch("");
  }

  function removeTopic(topic: string) {
    setSelectedTopics((prev) => prev.filter((item) => item !== topic));
  }

  const inputClass =
    "h-10 w-full rounded-[10px] border-2 border-[#bbdbf8] bg-white px-4 text-[16px] text-[#0f3a61] outline-none transition-all placeholder:text-[#9da8b2] focus:border-[#207cd3]";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const plainAbout = aboutHtml.replace(/<[^>]*>/g, "").trim();
    if (!url || !plainAbout || selectedTopics.length === 0) {
      setError("Оберіть щонайменше одну тематику.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          youtubeUrl: url,
          about: aboutHtml,
          topic: selectedTopics.join(", "),
          language: "Українська",
          avgDuration: 15,
        }),
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(data.message ?? "Не вдалося надіслати заявку");
        return;
      }
      router.push("/add-channel/success");
      router.refresh();
    } catch {
      setError("Не вдалося надіслати заявку");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalPage title="Додати ютуб-канал" closeHref="/">
      <div className="flex flex-col gap-6">
        <p className="pl-1 text-[16px] leading-[22px] text-black">
          <MultilineText text={ADD_CHANNEL_WARNING} boldSegments={[ADD_CHANNEL_ATTENTION_BOLD]} />
        </p>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="pl-1 text-[14px] font-medium text-[#0f3a61]">
              URL-адреса каналу<span className="text-[#cf2a1e]">*</span>
            </label>
            <input
              className={inputClass}
              placeholder="Введіть посилання на канал."
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="pl-1 text-[14px] font-medium text-[#0f3a61]">
              Опис каналу (до 1000 символів)<span className="text-[#cf2a1e]">*</span>
            </label>
            <RichTextInput
              name="about"
              placeholder="Введіть опис каналу."
              className="bg-white"
              maxLength={1000}
              required
              initialHtml={aboutHtml}
              onChangeHtml={setAboutHtml}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="pl-1 text-[14px] font-medium text-[#0f3a61]">
              Оберіть тематику каналу (до 3 категорій)<span className="text-[#cf2a1e]">*</span>
            </label>
            <div className="rounded-[10px] border-2 border-[#bbdbf8] bg-white p-2">
              <div className="flex flex-wrap gap-2 p-1">
                {selectedTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => removeTopic(topic)}
                    className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#207cd3] bg-[#d4e7fa] px-3 py-1 text-xs font-semibold text-[#0f3a61] transition-colors hover:bg-[#bbdbf8]"
                    aria-label={`Видалити тематику ${topic}`}
                  >
                    <span>{topicEmoji(topic)}</span>
                    <span>{topic}</span>
                    <span aria-hidden="true">×</span>
                  </button>
                ))}
                {selectedTopics.length === 0 ? (
                  <span className="px-2 py-1 text-xs text-[#9da8b2]">Оберіть 1-3 тематики зі списку нижче</span>
                ) : null}
              </div>

              <input
                className={`mt-2 ${inputClass}`}
                placeholder={canAddMoreTopics ? "Напишіть тематику." : "Досягнуто ліміт: 3 тематики"}
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (filteredTopicOptions[0]) {
                      addTopic(filteredTopicOptions[0].name);
                    }
                  }
                }}
                disabled={!canAddMoreTopics}
              />

              {canAddMoreTopics && filteredTopicOptions.length > 0 ? (
                <div className="mt-2 max-h-[220px] overflow-y-auto pr-1 [scrollbar-width:thin]">
                  <div className="flex flex-wrap gap-2">
                    {filteredTopicOptions.map((option) => (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() => addTopic(option.name)}
                        className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#bbdbf8] bg-[#ebeff2] px-3 py-1 text-xs font-semibold text-[#0f3a61] transition-colors hover:border-[#207cd3] hover:bg-[#d4e7fa]"
                      >
                        <span>{option.emoji}</span>
                        <span>{option.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : canAddMoreTopics && topicSearch.trim() ? (
                <p className="mt-2 px-1 text-xs text-[#9da8b2]">Добірок за цим запитом не знайдено.</p>
              ) : null}
            </div>
          </div>

          <PrimaryButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Надсилання..." : "Відправити"}
          </PrimaryButton>
          {error ? <p className="pl-1 text-sm text-[#cf2a1e]">{error}</p> : null}
        </form>
      </div>
    </ModalPage>
  );
}
