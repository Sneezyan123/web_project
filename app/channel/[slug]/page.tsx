import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createChannelComment,
  getChannelBySlug,
  getChannelComments,
  getSimilarChannels,
  getUserChannelRating,
  rateChannel,
} from "@/lib/channels";
import { getCurrentUser } from "@/lib/current-user";
import { Footer, Header, MobileShell } from "../../_components/u2u";

export default async function ChannelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [channel, similar, comments, currentUser] = await Promise.all([
    getChannelBySlug(slug),
    getSimilarChannels(slug, 2),
    getChannelComments(slug),
    getCurrentUser(),
  ]);

  if (!channel) notFound();
  const userRating = currentUser ? await getUserChannelRating(slug, currentUser.id) : 0;
  const aboutHtml = channel.about.includes("<") ? channel.about : channel.about.replace(/\n/g, "<br />");

  async function submitComment(formData: FormData) {
    "use server";
    const user = await getCurrentUser();
    if (!user) {
      redirect("/auth/login");
    }
    const text = String(formData.get("comment") ?? "").trim();
    if (!text) return;

    const rating = Number(formData.get("commentRating") ?? 0);
    if (rating < 1 || rating > 5) return;

    await createChannelComment({
      channelSlug: slug,
      userId: user.id,
      userName: user.displayName,
      text,
      rating,
    });

    revalidatePath(`/channel/${slug}`);
  }

  async function submitRating(formData: FormData) {
    "use server";
    const user = await getCurrentUser();
    if (!user) {
      redirect("/auth/login");
    }
    const value = Number(formData.get("rating") ?? 0);
    if (value < 1 || value > 5) return;
    await rateChannel({ channelSlug: slug, userId: user.id, rating: value });
    revalidatePath(`/channel/${slug}`);
    revalidatePath("/channels");
    revalidatePath("/");
  }

  return (
    <MobileShell>
      <Header />
      <main className="space-y-4 px-4 pb-8 pt-[13px]">
        <p className="pl-2 text-xs text-[#4d5a66]">Головна / Добірки / Летсплеї / {channel.name}</p>
        <section className="relative px-4 pb-3 pt-4">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="h-20 w-20 overflow-hidden rounded-full">
                <img src={channel.avatar} alt={channel.name} className="h-full w-full object-cover" />
              </div>
              <div className="pt-2">
                <h1 className="text-[36px]/[1] font-bold text-[#0f3a61]">{channel.name}</h1>
                <p className="mt-1 text-xl/[1] text-[#0f3a61]">{channel.tags}</p>
              </div>
            </div>
            <div className="mt-1 grid h-8 w-8 place-items-center rounded-full">
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 3.5C6.17 3.5 5.5 4.17 5.5 5V20.5L12 16.6L18.5 20.5V5C18.5 4.17 17.83 3.5 17 3.5H7Z" stroke="#9DA8B2" strokeWidth="1.75" />
              </svg>
            </div>
          </div>

          <a
            href={channel.youtubeUrl}
            target="_blank"
            rel="noreferrer"
            className="mb-3 flex h-10 items-center justify-center gap-[6px] rounded-[10px] bg-[#cf2a1e] px-4 text-base font-semibold text-white"
          >
            <img src="/figma-assets/auth-youtube.svg" alt="" className="h-[18px] w-[25px]" />
            Перейти на канал
          </a>

          <div className="grid grid-cols-3 items-center text-center">
            <div className="py-[7px]">
              <p className="text-[11px] leading-[1.5] tracking-[-0.121px] text-[#9da8b2]">Підписники</p>
              <p className="text-[25px] font-semibold leading-none text-[#207cd3]">{channel.subs}</p>
            </div>
            <div className="py-[7px]">
              <p className="text-[11px] leading-[1.5] tracking-[-0.121px] text-[#9da8b2]">Відео</p>
              <p className="text-[25px] font-semibold leading-none text-[#207cd3]">{channel.videos}</p>
            </div>
            <div className="py-[7px]">
              <p className="text-[11px] leading-[1.5] tracking-[-0.121px] text-[#9da8b2]">Оцінка</p>
              <p className="flex items-center justify-center gap-1 text-[25px] font-semibold leading-none text-[#207cd3]">
                <img src="/figma-assets/star-small.svg" alt="" className="h-5 w-5" />
                {channel.rating}
              </p>
            </div>
          </div>

          <div
            className="mt-[10px] line-clamp-[9] text-[14px]/[1.25] text-[#1b2630]"
            dangerouslySetInnerHTML={{ __html: aboutHtml }}
          />
          <div className="mt-1 flex justify-center">
            <img src="/figma-assets/chevron-large.svg" alt="" className="h-6 w-6" />
          </div>
        </section>

        <section className="rounded-[10px] bg-white px-2 pb-4 pt-6">
          <h2 className="mb-3 text-[22px] font-bold text-[#0f3a61]">Рекомендовані відео</h2>
          <div className="flex gap-2 overflow-auto pb-1">
            <div className="relative h-[210px] min-w-[264px] rounded-[8px] border border-[#d4e7fa] bg-[#ebeff2]">
              <div className="absolute inset-x-0 bottom-0 rounded-b-[8px] bg-white/90 p-3">
                <p className="text-sm font-semibold text-[#0f3a61]">Початок гри на виживання</p>
                <p className="mt-1 text-xs text-[#4d5a66]">12:45 • 28 тис. переглядів</p>
              </div>
            </div>
            <div className="relative h-[210px] min-w-[264px] rounded-[8px] border border-[#d4e7fa] bg-[#ebeff2]">
              <div className="absolute inset-x-0 bottom-0 rounded-b-[8px] bg-white/90 p-3">
                <p className="text-sm font-semibold text-[#0f3a61]">Огляд української гри</p>
                <p className="mt-1 text-xs text-[#4d5a66]">9:31 • 15 тис. переглядів</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[10px] bg-white px-2 pb-5 pt-5">
          <h2 className="text-center text-[22px] font-bold text-[#0f3a61]">Оцініть канал!</h2>
          {currentUser ? (
            <form action={submitRating} className="mt-3 flex items-center justify-center gap-3">
              {[1, 2, 3, 4, 5].map((item) => (
                <button key={item} type="submit" name="rating" value={item} className="grid h-9 w-9 place-items-center rounded-full bg-[#ebeff2]">
                  <img src="/figma-assets/star-big.svg" alt={`Оцінка ${item}`} className={`h-6 w-6 ${item <= userRating ? "" : "opacity-30"}`} />
                </button>
              ))}
            </form>
          ) : (
            <Link href="/auth/login" className="mt-3 block text-center text-sm text-[#4d5a66]">
              Увійдіть, щоб поставити оцінку
            </Link>
          )}
        </section>

        <section className="rounded-[10px] bg-white px-2 pb-4 pt-6">
          <div className="mb-3 flex items-center gap-3">
            <h2 className="text-[22px] font-bold text-[#0f3a61]">Коментарі</h2>
            <span className="grid h-7 min-w-7 place-items-center rounded-full bg-[#d4e7fa] px-2 text-sm font-semibold text-[#0f3a61]">{comments.length}</span>
          </div>
          {currentUser ? (
            <form action={submitComment} className="mb-4 flex items-start gap-2">
              <img src={channel.avatar} alt="" className="mt-1 h-8 w-8 rounded-full object-cover" />
              <div className="flex-1">
                <textarea
                  name="comment"
                  required
                  className="h-20 w-full resize-none rounded-[8px] border-2 border-[#bbdbf8] bg-white px-4 py-[6px] text-base text-[#0f3a61] outline-none"
                  placeholder="Напишіть коментар."
                />
                <p className="mt-1 text-xs tracking-[-0.36px] text-[#686e74]">Коментарі приймаються тільки українською мовою.</p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <label key={item} className="cursor-pointer">
                      <input type="radio" name="commentRating" value={item} defaultChecked={item === 5} className="peer sr-only" />
                      <img src="/figma-assets/star-big.svg" alt={`Оцінка ${item}`} className="h-6 w-6 opacity-30 peer-checked:opacity-100" />
                    </label>
                  ))}
                </div>
                <button type="submit" className="mt-2 h-10 w-full rounded-[8px] bg-[#207cd3] text-base font-medium text-white">
                  Коментувати
                </button>
              </div>
            </form>
          ) : (
            <Link href="/auth/login" className="mb-4 block rounded-[8px] border border-[#d4e7fa] p-3 text-sm text-[#4d5a66]">
              Щоб залишити коментар, увійдіть у свій акаунт.
            </Link>
          )}
          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="rounded-[8px] border border-[#d4e7fa] p-3 text-sm text-[#4d5a66]">Ще немає коментарів. Станьте першим, хто прокоментує!</p>
            ) : (
              comments.map((comment) => (
                <article key={comment.id} className="rounded-[8px] bg-[#bbdbf8] px-3 py-2">
                  <div className="flex items-start gap-2">
                    <img src="/figma-assets/avatar-header.png" alt={comment.userName} className="mt-1 h-8 w-8 rounded-full object-cover" />
                    <div className="w-full">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[#0f3a61]">{comment.userName}</p>
                        <span className="text-xs text-[#828e99]">{new Date(comment.createdAt).toLocaleDateString("uk-UA")}</span>
                        <div className="flex items-center gap-[2px]">
                          {[1, 2, 3, 4, 5].map((item) => (
                            <img key={item} src="/figma-assets/star-small.svg" alt="" className={`h-4 w-4 ${item > comment.rating ? "opacity-30" : ""}`} />
                          ))}
                        </div>
                      </div>
                      <p className="mt-1 text-sm leading-[1.15] text-[#1b2630]">{comment.text}</p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="rounded-[10px] bg-white px-2 pb-4 pt-6">
          <h2 className="mb-3 text-[22px] font-bold text-[#0f3a61]">Подібні канали</h2>
          <div className="space-y-3">
            {similar.map((item) => (
              <article key={item.slug} className="rounded-[10px] border-2 border-[#bbdbf8] bg-[#ebeff2] p-3">
                <div className="flex items-center gap-3">
                  <img src={item.avatar} alt={item.name} className="h-12 w-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-base font-bold text-[#0f3a61]">{item.name}</p>
                    <p className="text-xs text-[#4d5a66]">{item.tags}</p>
                  </div>
                  <img src="/figma-assets/youtube.svg" alt="YouTube" className="h-[24px] w-[32px]" />
                </div>
                <div className="mt-2 grid grid-cols-3 text-center">
                  <div>
                    <p className="text-[11px] text-[#9da8b2]">Підп.</p>
                    <p className="text-[25px]/[1] font-semibold text-[#207cd3]">{item.subs}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#9da8b2]">Відео</p>
                    <p className="text-[25px]/[1] font-semibold text-[#207cd3]">{item.videos}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#9da8b2]">Оцінка</p>
                    <p className="flex items-center justify-center gap-1 text-[25px]/[1] font-semibold text-[#207cd3]">
                      <img src="/figma-assets/star-small.svg" alt="" className="h-5 w-5" />
                      {item.rating}
                    </p>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-[#1b2630]">{item.about}</p>
                <button type="button" className="mt-2 w-full text-center text-base font-semibold text-[#4fa1ed]">
                  Переглянути інформацію
                </button>
              </article>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#6cb1f0]" />
            <span className="h-2 w-2 rounded-full bg-[#d4e7fa]" />
            <span className="h-2 w-2 rounded-full bg-[#d4e7fa]" />
          </div>
        </section>
      </main>
      <Footer />
    </MobileShell>
  );
}
