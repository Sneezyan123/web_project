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
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChannelCard from "@/components/ChannelCard";

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
    <div className="bg-white min-h-screen font-sans text-gray-900 max-w-md mx-auto relative shadow-xl overflow-x-hidden pb-10 flex flex-col">
      <Header user={currentUser} />

      <main className="px-4 pt-4 flex flex-col gap-6 flex-1">
        {/* Breadcrumbs */}
        <div className="text-gray-400 text-[11px] font-medium pl-1">
          Головна / Добірки / {channel.tags} / {channel.name}
        </div>

        {/* Channel Details Section */}
        <section className="flex flex-col gap-4 pl-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 relative rounded-full overflow-hidden shrink-0 border border-blue-100">
                <img src={channel.avatar} alt={channel.name} className="object-cover w-full h-full" />
              </div>
              <div className="flex flex-col">
                <h1 className="font-bold text-gray-900 text-[22px] leading-tight">{channel.name}</h1>
                <span className="text-xs text-gray-400 mt-0.5">{channel.tags}</span>
              </div>
            </div>
            
            {/* Bookmark button */}
            <button className="w-10 h-10 border border-blue-200 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>

          <a
            href={channel.youtubeUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12 rounded-[12px] flex items-center justify-center gap-2 shadow-sm transition-colors text-[15px] mt-1"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/>
            </svg>
            Перейти на канал
          </a>

          {/* Stats Row */}
          <div className="flex items-center justify-between text-center px-4 py-2 bg-gray-50 rounded-[16px]">
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-[11px] mb-1">Підписники</span>
              <span className="font-bold text-gray-900 text-[20px]">{channel.subs}</span>
            </div>
            <div className="w-px h-8 bg-gray-200/50"></div>
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-[11px] mb-1">Відео</span>
              <span className="font-bold text-gray-900 text-[20px]">{channel.videos}</span>
            </div>
            <div className="w-px h-8 bg-gray-200/50"></div>
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-[11px] mb-1">Оцінка</span>
              <span className="font-bold text-gray-900 text-[20px] flex items-center gap-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" strokeWidth="1" className="translate-y-[-1px]">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                {channel.rating}
              </span>
            </div>
          </div>

          {/* Description */}
          <div 
            className="text-[14px] text-gray-700 leading-relaxed font-normal pl-1"
            dangerouslySetInnerHTML={{ __html: aboutHtml }}
          />
        </section>

        {/* Recommended Videos */}
        <section className="flex flex-col gap-4 mt-2 pl-1">
          <h2 className="text-[18px] font-bold text-gray-900">Рекомендовані відео</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
            <div className="relative w-64 aspect-video rounded-[16px] overflow-hidden border border-gray-100 flex-shrink-0 snap-center shadow-sm">
              <img src="/assets/channel_I298_947;191:1886.png" alt="Video thumbnail" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-bold text-[14px] leading-tight">Початок гри на виживання</span>
                <span className="text-gray-300 text-[11px] mt-1">12:45 • 28 тис. переглядів</span>
              </div>
            </div>
            <div className="relative w-64 aspect-video rounded-[16px] overflow-hidden border border-gray-100 flex-shrink-0 snap-center shadow-sm">
              <img src="/assets/channel_I298_947;191:1886.png" alt="Video thumbnail" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-bold text-[14px] leading-tight">Огляд української гри</span>
                <span className="text-gray-300 text-[11px] mt-1">9:31 • 15 тис. переглядів</span>
              </div>
            </div>
          </div>
        </section>

        {/* Rate Channel Block */}
        <section className="flex flex-col items-center gap-3 bg-blue-50/50 rounded-[20px] p-6 border border-blue-50 mt-2">
          <h2 className="text-[18px] font-bold text-blue-900">Оцініть канал!</h2>
          {currentUser ? (
            <form action={submitRating} className="flex items-center gap-2 mt-1">
              {[1, 2, 3, 4, 5].map((item) => (
                <button key={item} type="submit" name="rating" value={item} className="p-1 hover:scale-110 transition-transform">
                  <svg 
                    width="32" height="32" viewBox="0 0 24 24" 
                    fill={item <= userRating ? "#FBBF24" : "none"} 
                    stroke={item <= userRating ? "#FBBF24" : "#94A3B8"} 
                    strokeWidth="2"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </button>
              ))}
            </form>
          ) : (
            <Link href="/auth/login" className="text-sm text-blue-600 font-semibold hover:underline mt-1">
              Увійдіть, щоб поставити оцінку
            </Link>
          )}
        </section>

        {/* Comments Block */}
        <section className="flex flex-col gap-4 mt-2 pl-1">
          <div className="flex items-center gap-3">
            <h2 className="text-[18px] font-bold text-gray-900">Коментарі</h2>
            <span className="bg-blue-100 text-blue-800 font-bold text-xs h-6 px-3 rounded-full flex items-center justify-center shadow-sm">
              {comments.length}
            </span>
          </div>

          {currentUser ? (
            <form action={submitComment} className="flex flex-col gap-3 mt-1 bg-white border border-blue-100 rounded-[16px] p-4 shadow-sm">
              <textarea
                name="comment"
                required
                className="w-full h-24 border border-blue-50 rounded-[12px] p-3 text-[13px] outline-none placeholder-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all resize-none"
                placeholder="Напишіть коментар..."
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400 max-w-[160px] leading-tight">Коментарі приймаються тільки українською мовою.</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <label key={item} className="cursor-pointer hover:scale-105 transition-transform">
                      <input type="radio" name="commentRating" value={item} defaultChecked={item === 5} className="peer sr-only" />
                      <svg 
                        width="18" height="18" viewBox="0 0 24 24" 
                        className="peer-checked:fill-yellow-400 peer-checked:stroke-yellow-400 fill-none stroke-gray-300 transition-colors"
                        strokeWidth="2.5"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 rounded-[12px] shadow-sm transition-colors text-[13px] mt-1">
                Коментувати
              </button>
            </form>
          ) : (
            <Link href="/auth/login" className="block text-center text-sm text-blue-600 font-semibold hover:underline bg-gray-50 border border-gray-100 rounded-[12px] py-4">
              Щоб залишити коментар, увійдіть у свій акаунт.
            </Link>
          )}

          {/* Comments List */}
          <div className="flex flex-col gap-3 mt-1">
            {comments.length === 0 ? (
              <p className="text-gray-400 text-center py-6 text-sm">Ще немає коментарів. Будьте першим!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-[16px] p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[14px] text-gray-900">{comment.userName}</span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <svg 
                          key={item} width="14" height="14" viewBox="0 0 24 24" 
                          fill={item <= comment.rating ? "#FBBF24" : "none"} 
                          stroke={item <= comment.rating ? "#FBBF24" : "#CBD5E1"} 
                          strokeWidth="2"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-[13px] text-gray-700 leading-relaxed">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Similar Channels */}
        <section className="flex flex-col gap-4 mt-4 pl-1">
          <h2 className="text-[18px] font-bold text-gray-900">Подібні канали</h2>
          <div className="flex flex-col gap-4">
            {similar.map((item, i) => (
              <ChannelCard key={i} channel={item} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
