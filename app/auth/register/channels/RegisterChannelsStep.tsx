"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MultilineText } from "@/components/MultilineText";
import { ModalPage, PrimaryButton, RegistrationStepDots } from "@/components/ui/app-ui";
import type { ChannelItem } from "@/lib/channels";
import { REGISTER_CHANNELS_BANNER } from "@/lib/copy";
import { RegisterChannelsClient } from "./RegisterChannelsClient";

const backButton =
  "flex h-10 w-[168px] items-center justify-center text-[16px] font-semibold text-[#207cd3] transition-opacity hover:opacity-80";

export function RegisterChannelsStep({ channels }: { channels: ChannelItem[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  function toggleChannel(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  async function finishRegistration() {
    setIsSaving(true);
    setError("");
    try {
      if (selected.size > 0) {
        const response = await fetch("/api/account/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ channelSlugs: [...selected] }),
        });
        if (!response.ok) {
          const data = (await response.json()) as { message?: string };
          setError(data.message ?? "Не вдалося зберегти вподобання");
          return;
        }
      }
      router.push("/account");
      router.refresh();
    } catch {
      setError("Не вдалося завершити реєстрацію");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ModalPage
      title="Що вам подобається?"
      closeHref="/"
      largeTitle
      footer={
        <>
          <RegistrationStepDots activeStep={3} />

          <PrimaryButton
            type="button"
            disabled={isSaving}
            onClick={finishRegistration}
            className="mt-2.5 font-semibold"
          >
            {isSaving ? "Збереження..." : "Зареєструватись"}
          </PrimaryButton>

          <Link href="/auth/register/topics" className={`${backButton} mt-1`}>
            Назад
          </Link>

          {error ? (
            <p className="rounded-[8px] border border-[#cf2a1e]/30 bg-[#cf2a1e]/10 p-3 text-xs font-medium text-[#cf2a1e]">
              {error}
            </p>
          ) : null}
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex min-h-[70px] items-center rounded-[10px] bg-[#d4e7fa] px-2 py-4">
          <p className="text-[14px] font-normal leading-normal text-black">
            <MultilineText text={REGISTER_CHANNELS_BANNER} boldSegments={["(канали)"]} />
          </p>
        </div>

        <RegisterChannelsClient channels={channels} selected={selected} onToggle={toggleChannel} />
      </div>
    </ModalPage>
  );
}
