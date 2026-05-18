"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ChannelComment } from "@/lib/channels";
import type { CurrentUser } from "@/lib/current-user";
import { Pagination } from "@/components/Pagination";

type Props = {
  slug: string;
  comments: ChannelComment[];
  currentPage: number;
  totalPages: number;
  currentUser: CurrentUser | null;
};

function formatCommentTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "сьогодні";
  if (diffDays === 1) return "1 день тому";
  if (diffDays < 30) return `${diffDays} дн. тому`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "1 місяць тому";
  if (diffMonths < 12) return `${diffMonths} міс. тому`;

  return date.toLocaleDateString("uk-UA");
}

function CommentBubble({
  comment,
  currentUser,
  replyToId,
  replyText,
  isSubmitting,
  replies,
  onToggleReply,
  onReplyTextChange,
  onReplySubmit,
}: {
  comment: ChannelComment;
  currentUser: CurrentUser | null;
  replyToId: string | null;
  replyText: string;
  isSubmitting: boolean;
  replies: ChannelComment[];
  onToggleReply: (id: string) => void;
  onReplyTextChange: (value: string) => void;
  onReplySubmit: (parentId: string) => void;
}) {
  return (
    <article className="flex gap-2">
      <img
        src={comment.userAvatarUrl}
        alt={comment.userName}
        className="h-8 w-8 shrink-0 rounded-full object-cover"
      />
      <div className="relative min-w-0 flex-1 pt-0.5">
        <div className="relative rounded-[8px] bg-[#d4e7fa] px-4 py-3">
          <span
            aria-hidden
            className="absolute -left-[7px] top-3 block size-0 border-y-[7px] border-r-[7px] border-y-transparent border-r-[#d4e7fa]"
          />
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="truncate text-[16px] font-semibold leading-none text-[#0f3a61]">
                {comment.userName}
              </span>
              <span className="shrink-0 text-[11px] leading-none text-[#828e99]">
                {formatCommentTime(comment.createdAt)}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((item) => (
                <img
                  key={item}
                  src="/figma-assets/star-small.svg"
                  alt=""
                  className={`h-4 w-4 ${item <= comment.rating ? "" : "opacity-30 grayscale"}`}
                />
              ))}
            </div>
          </div>
          <p className="mt-3 whitespace-pre-line text-[14px] leading-normal text-[#134c80]">{comment.text}</p>
          {currentUser ? (
            <button
              type="button"
              onClick={() => onToggleReply(comment.id)}
              className="mt-3 text-[14px] font-semibold leading-none text-[#207cd3]"
            >
              Відповісти
            </button>
          ) : null}

          {replyToId === comment.id && currentUser ? (
            <div className="mt-3 rounded-[8px] border-2 border-[#bbdbf8] bg-white p-2">
              <textarea
                value={replyText}
                onChange={(event) => onReplyTextChange(event.target.value)}
                placeholder="Ваша відповідь..."
                className="min-h-[72px] w-full resize-none rounded-[8px] border-2 border-[#bbdbf8] px-3 py-2 text-[14px] outline-none"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => onReplySubmit(comment.id)}
                  className="rounded-[8px] bg-[#207cd3] px-4 py-2 text-xs font-semibold text-white disabled:opacity-70"
                >
                  Надіслати
                </button>
              </div>
            </div>
          ) : null}

          {replies.map((reply) => (
            <div key={reply.id} className="mt-3 flex gap-2 border-t border-[#bbdbf8] pt-3">
              <img
                src={reply.userAvatarUrl}
                alt={reply.userName}
                className="h-6 w-6 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-1.5">
                  <span className="truncate text-[14px] font-semibold leading-none text-[#0f3a61]">
                    {reply.userName}
                  </span>
                  <span className="shrink-0 text-[11px] leading-none text-[#828e99]">
                    {formatCommentTime(reply.createdAt)}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-line text-[14px] leading-normal text-[#134c80]">{reply.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function RatingStars({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((item) => (
        <button key={item} type="button" onClick={() => onChange(item)} className="transition-transform hover:scale-105">
          <img
            src="/figma-assets/star-small.svg"
            alt=""
            className={`h-4 w-4 ${item <= value ? "" : "opacity-30 grayscale"}`}
          />
        </button>
      ))}
    </div>
  );
}

export function ChannelComments({ slug, comments, currentPage, totalPages, currentUser }: Props) {
  const router = useRouter();
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(5);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rootComments = comments.filter((item) => !item.parentId);
  const repliesMap = new Map<string, ChannelComment[]>();
  comments
    .filter((item) => item.parentId)
    .forEach((item) => {
      const key = item.parentId as string;
      repliesMap.set(key, [...(repliesMap.get(key) ?? []), item]);
    });

  async function submitComment(payload: { text: string; rating: number; parentId?: string }) {
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch(`/api/channels/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(data.message ?? "Не вдалося надіслати коментар");
        return false;
      }
      router.refresh();
      return true;
    } catch {
      setError("Не вдалося надіслати коментар");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onMainSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!commentText.trim()) return;
    const ok = await submitComment({ text: commentText, rating });
    if (ok) {
      setCommentText("");
      setRating(5);
    }
  }

  async function onReplySubmit(parentId: string) {
    if (!replyText.trim()) return;
    const ok = await submitComment({ text: replyText, rating: 5, parentId });
    if (ok) {
      setReplyText("");
      setReplyToId(null);
    }
  }

  return (
    <section className="flex flex-col gap-6 rounded-[10px] pb-4 pt-6">
      <div className="flex items-center gap-2 px-2">
        <h2 className="text-[22px] font-bold leading-none text-[#0f3a61]">Коментарі</h2>
        <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[#d4e7fa] px-2 text-[14px] font-bold text-[#0f3a61]">
          {comments.length}
        </span>
      </div>

      {currentUser ? (
        <form onSubmit={onMainSubmit} className="flex flex-col items-end gap-3">
          <div className="flex w-full gap-2">
            <img
              src={currentUser.avatarUrl || "/figma-assets/avatar-header.png"}
              alt={currentUser.displayName}
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <textarea
                required
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                className="min-h-[72px] w-full resize-none rounded-[8px] border-2 border-[#bbdbf8] bg-white px-4 py-1.5 text-[16px] text-[#0f3a61] outline-none placeholder:text-[#9da8b2] focus:border-[#207cd3]"
                placeholder="Напишіть коментар."
              />
              <p className="text-[12px] tracking-[-0.36px] text-[#686e74]">
                Коментарі приймаються тільки українською мовою.
              </p>
            </div>
          </div>
          <div className="flex w-full max-w-[304px] flex-col items-end gap-2 self-end">
            <RatingStars value={rating} onChange={setRating} />
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-10 w-full items-center justify-center rounded-[8px] bg-[#207cd3] text-[16px] font-medium text-white disabled:opacity-70"
            >
              {isSubmitting ? "Надсилання..." : "Коментувати"}
            </button>
          </div>
          {error ? <p className="w-full text-xs text-[#e42e21]">{error}</p> : null}
        </form>
      ) : (
        <Link href="/auth/login" className="text-sm font-semibold text-[#207cd3] hover:underline">
          Щоб залишити коментар, увійдіть у свій акаунт.
        </Link>
      )}

      <div className="flex flex-col gap-4">
        {rootComments.length === 0 ? (
          <p className="py-6 text-center text-sm text-[#828e99]">Ще немає коментарів. Будьте першим!</p>
        ) : (
          rootComments.map((comment) => (
            <CommentBubble
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              replyToId={replyToId}
              replyText={replyText}
              isSubmitting={isSubmitting}
              replies={repliesMap.get(comment.id) ?? []}
              onToggleReply={(id) => setReplyToId(replyToId === id ? null : id)}
              onReplyTextChange={setReplyText}
              onReplySubmit={onReplySubmit}
            />
          ))
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          makeHref={(page) => {
            const params = new URLSearchParams();
            if (page > 1) params.set("commentPage", String(page));
            const query = params.toString();
            return query ? `/channel/${slug}?${query}` : `/channel/${slug}`;
          }}
        />
      </div>
    </section>
  );
}
