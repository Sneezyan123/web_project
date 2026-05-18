import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { formatChannelAboutHtml } from "@/lib/channel-about-html";
import {
  getChannelBySlug,
  getChannelComments,
  getSimilarChannels,
  getUserChannelRating,
  rateChannel,
} from "@/lib/channels";
import { isChannelBookmarked, toggleBookmark } from "@/lib/bookmarks";
import { getCurrentUser } from "@/lib/current-user";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MobileShell } from "@/components/layout/MobileShell";
import { Breadcrumbs, SectionTitle } from "@/components/ui/app-ui";
import { ChannelComments } from "./ChannelComments";
import { ChannelDescription } from "./ChannelDescription";
import { SimilarChannelsCarousel } from "./SimilarChannelsCarousel";

type SearchParams = Promise<{ commentPage?: string }>;

export default async function ChannelPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const commentPage = Math.max(1, Number(query.commentPage ?? "1") || 1);

  const [channel, similar, commentData, currentUser] = await Promise.all([
    getChannelBySlug(slug),
    getSimilarChannels(slug, 12),
    getChannelComments(slug, { page: commentPage, pageSize: 10 }),
    getCurrentUser(),
  ]);

  if (!channel) notFound();
  const canonicalSlug = channel.slug;
  const userRating = currentUser ? await getUserChannelRating(canonicalSlug, currentUser.id) : 0;
  const isBookmarked = currentUser ? await isChannelBookmarked(currentUser.id, canonicalSlug) : false;
  const aboutHtml = formatChannelAboutHtml(channel.about);

  async function submitRating(formData: FormData) {
    "use server";
    const user = await getCurrentUser();
    if (!user) {
      redirect("/auth/login");
    }
    const value = Number(formData.get("rating") ?? 0);
    if (value < 1 || value > 5) return;
    await rateChannel({ channelSlug: canonicalSlug, userId: user.id, rating: value });
    revalidatePath(`/channel/${canonicalSlug}`);
    revalidatePath("/channels");
    revalidatePath("/");
  }

  async function toggleChannelBookmark() {
    "use server";
    const user = await getCurrentUser();
    if (!user) {
      redirect("/auth/login");
    }
    const resolved = await getChannelBySlug(slug);
    if (!resolved) return;
    await toggleBookmark(user.id, resolved.slug);
    revalidatePath(`/channel/${resolved.slug}`);
    revalidatePath("/account");
    revalidatePath("/");
  }

  return (
    <MobileShell>
      <Header user={currentUser} />

      <main className="flex flex-1 flex-col gap-11 px-4 pt-4">
        <Breadcrumbs>Головна / Добірки / {channel.tags} / {channel.name}</Breadcrumbs>

        <section className="relative w-full min-h-[485px] overflow-visible rounded-[10px] bg-white pb-4">
          <img
            src={channel.avatar}
            alt={channel.name}
            className="absolute left-[7px] top-[-10px] z-10 h-20 w-20 rounded-full object-cover"
          />

          <div className="flex items-start justify-between pl-[97px] pr-4 pt-4">
            <div className="min-w-0 pr-2">
              <h1 className="text-[20px] font-bold leading-none text-[#0f3a61]">{channel.name}</h1>
              <p className="mt-2 text-[12px] leading-none text-[#0f3a61]">{channel.tags}</p>
            </div>
            <form action={toggleChannelBookmark} className="shrink-0">
              <button
                type="submit"
                className="flex h-8 w-8 items-center justify-center"
                aria-label={isBookmarked ? "Прибрати із збережених" : "Додати в збережені"}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill={isBookmarked ? "#207CD3" : "none"}
                  stroke={isBookmarked ? "#207CD3" : "#0F3A61"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            </form>
          </div>

          <a
            href={channel.youtubeUrl}
            target="_blank"
            rel="noreferrer"
            className="mx-4 mt-[22px] flex h-10 w-[calc(100%-2rem)] max-w-[328px] items-center justify-center gap-1.5 rounded-[10px] bg-[#cf2a1e] text-[16px] font-semibold text-white"
          >
            <img src="/figma-assets/youtube.svg" alt="" className="h-[18px] w-[25px] brightness-0 invert" />
            Перейти на канал
          </a>

          <div className="mx-4 mt-3 flex w-[calc(100%-2rem)] max-w-[328px] items-center justify-between text-center">
            <div className="flex w-[120px] flex-col items-center gap-2">
              <span className="text-[11px] tracking-[-0.121px] text-[#9da8b2]">Підписники</span>
              <span className="whitespace-nowrap text-[25px] font-semibold leading-none text-[#207cd3]">{channel.subs}</span>
            </div>
            <div className="flex w-[92px] flex-col items-center gap-2">
              <span className="text-[11px] tracking-[-0.121px] text-[#9da8b2]">Відео</span>
              <span className="whitespace-nowrap text-[25px] font-semibold leading-none text-[#207cd3]">{channel.videos}</span>
            </div>
            <div className="flex w-[80px] flex-col items-center gap-2">
              <span className="text-[11px] tracking-[-0.121px] text-[#9da8b2]">Оцінка</span>
              <span className="flex items-center justify-center gap-1 whitespace-nowrap text-[25px] font-semibold leading-none text-[#207cd3]">
                <img src="/figma-assets/star-small.svg" alt="" className="h-5 w-5" />
                {channel.rating}
              </span>
            </div>
          </div>

          <div className="mx-4 mt-4 w-[calc(100%-2rem)] max-w-[328px]">
            <ChannelDescription html={aboutHtml} />
          </div>
        </section>

        <section className="flex flex-col gap-6 rounded-[10px] px-2 pb-4 pt-6">
          <SectionTitle>Рекомендовані відео</SectionTitle>
          {channel.recommendedVideos && channel.recommendedVideos.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {channel.recommendedVideos.slice(0, 3).map((video, index) => (
                <a
                  key={`${video.url}-${index}`}
                  href={video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="relative w-[264px] shrink-0 rounded-[10px] border-4 border-[#d4e7fa] bg-white p-3 shadow-[0_1px_1px_rgba(0,0,0,0.07)]"
                >
                  <div className="relative h-[136px] w-full overflow-hidden rounded-[8px]">
                    <img src={video.thumbnailUrl} alt={video.title} className="h-full w-full object-cover" />
                    <img
                      src="/figma-assets/youtube.svg"
                      alt=""
                      className="absolute left-1/2 top-1/2 h-[50px] w-[50px] -translate-x-1/2 -translate-y-1/2"
                    />
                  </div>
                  <p className="mt-3 line-clamp-2 text-[14px] font-semibold leading-normal text-[#0f3a61]">{video.title}</p>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#4d5a66]">Поки немає рекомендованих відео для цього каналу.</p>
          )}
        </section>

        <section className="flex flex-col items-center gap-2">
          <h2 className="text-center text-[13px] font-bold leading-none text-[#0f3a61]">Оцініть канал!</h2>
          {currentUser ? (
            <form action={submitRating} className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((item) => (
                <button key={item} type="submit" name="rating" value={item} className="p-0.5 transition-transform hover:scale-105">
                  <img
                    src="/figma-assets/star-big.svg"
                    alt=""
                    className={`h-[46px] w-[46px] ${item <= userRating ? "" : "opacity-40 grayscale"}`}
                  />
                </button>
              ))}
            </form>
          ) : (
            <Link href="/auth/login" className="text-sm font-semibold text-[#207cd3] hover:underline">
              Увійдіть, щоб поставити оцінку
            </Link>
          )}
        </section>

        <ChannelComments
          slug={canonicalSlug}
          comments={commentData.comments}
          currentPage={commentData.currentPage}
          totalPages={commentData.totalPages}
          currentUser={currentUser}
        />

        <section className="flex flex-col gap-6 rounded-[10px] pb-4 pt-6">
          <SectionTitle className="px-2">Подібні канали</SectionTitle>
          <SimilarChannelsCarousel channels={similar} />
        </section>
      </main>

      <Footer />
    </MobileShell>
  );
}
