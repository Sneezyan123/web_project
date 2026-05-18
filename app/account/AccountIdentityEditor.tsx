"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-[#0f3a61]">
      <path
        d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AccountIdentityEditor(props: {
  name: string;
  email: string;
  avatarUrl?: string;
  avatarLetter: string;
  hasCustomAvatar: boolean;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(props.name);
  const [email, setEmail] = useState(props.email);
  const [avatarUrl, setAvatarUrl] = useState(props.avatarUrl ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  function startEdit() {
    setIsEditing(true);
    setError("");
  }

  async function save() {
    setIsSaving(true);
    setError("");
    try {
      let nextAvatarUrl = avatarUrl;
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        const uploadResponse = await fetch("/api/account/avatar", {
          method: "POST",
          body: formData,
        });
        const uploadData = (await uploadResponse.json()) as { message?: string; avatarUrl?: string };
        if (!uploadResponse.ok || !uploadData.avatarUrl) {
          setError(uploadData.message ?? "Не вдалося завантажити фото");
          return;
        }
        nextAvatarUrl = uploadData.avatarUrl;
        setAvatarUrl(nextAvatarUrl);
      }

      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: name, email, avatarUrl: nextAvatarUrl }),
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(data.message ?? "Не вдалося зберегти");
        return;
      }
      setIsEditing(false);
      setAvatarFile(null);
      router.refresh();
    } catch {
      setError("Не вдалося зберегти");
    } finally {
      setIsSaving(false);
    }
  }

  function cancel() {
    setName(props.name);
    setEmail(props.email);
    setAvatarUrl(props.avatarUrl ?? "");
    setAvatarFile(null);
    setError("");
    setIsEditing(false);
  }

  return (
    <div className="flex w-full gap-3">
      <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-full">
        {props.hasCustomAvatar ? (
          <img src={props.avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#d4e7fa] text-[36px] font-bold text-[#0f3a61]">
            {props.avatarLetter}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
        <div className="flex min-w-0 items-center justify-between gap-2">
          {isEditing ? (
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-9 min-w-0 flex-1 rounded-lg border border-[#bbdbf8] px-2 text-[22px] font-bold text-[#0f3a61] outline-none"
            />
          ) : (
            <span className="truncate text-[22px] font-bold leading-none text-[#0f3a61]">{props.name}</span>
          )}
          {!isEditing ? (
            <button type="button" onClick={startEdit} className="shrink-0 p-0.5" aria-label="Редагувати імʼя">
              <EditIcon />
            </button>
          ) : null}
        </div>

        <div className="flex min-w-0 items-center justify-between gap-2">
          {isEditing ? (
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-9 min-w-0 flex-1 rounded-lg border border-[#bbdbf8] px-2 text-[16px] text-[#0f3a61] outline-none"
            />
          ) : (
            <span className="truncate text-[16px] leading-snug text-[#0f3a61]">{props.email}</span>
          )}
          {!isEditing ? (
            <button type="button" onClick={startEdit} className="shrink-0 p-0.5" aria-label="Редагувати email">
              <EditIcon />
            </button>
          ) : null}
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-2 pt-1">
            <input
              type="url"
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              placeholder="Посилання на аватар (https://...)"
              className="h-8 w-full rounded-lg border border-[#bbdbf8] px-2 text-[13px] text-[#0f3a61] outline-none"
            />
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)}
              className="text-[12px] text-[#4d5a66]"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isSaving}
                onClick={save}
                className="rounded-full bg-[#207cd3] px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
              >
                {isSaving ? "Збереження..." : "Зберегти"}
              </button>
              <button
                type="button"
                onClick={cancel}
                className="rounded-full bg-[#ebeff2] px-4 py-1.5 text-xs font-semibold text-[#0f3a61]"
              >
                Скасувати
              </button>
            </div>
          </div>
        ) : null}

        {error ? <p className="text-xs text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
