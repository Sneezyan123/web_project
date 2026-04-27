import Link from "next/link";
import { getChannels } from "@/lib/channels";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/current-user";
import { updateUserProfile } from "@/lib/users";
import { LogoutButton } from "../_components/logout-button";
import { ChannelCard, Footer, Header, MobileShell } from "../_components/u2u";

export default async function AccountPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/auth/login");
  }
  const channels = await getChannels({ sort: "recommended", limit: 3 });

  async function saveProfile(formData: FormData) {
    "use server";
    const user = await getCurrentUser();
    if (!user) {
      redirect("/auth/login");
    }
    const nickname = String(formData.get("nickname") ?? "").trim();
    const avatarUrl = String(formData.get("avatarUrl") ?? "").trim();
    if (!nickname) return;
    await updateUserProfile({
      userId: user.id,
      nickname,
      avatarUrl: avatarUrl || "/figma-assets/menu-avatar.png",
    });
    revalidatePath("/account");
    revalidatePath("/");
  }

  return (
    <MobileShell>
      <Header />
      <main className="space-y-4 px-4 pb-8 pt-2">
        <section className="rounded-[10px] bg-white p-0">
          <div className="flex items-center gap-3 px-1 py-2">
            <img
              src={currentUser.avatarUrl || "/figma-assets/menu-avatar.png"}
              alt="Avatar"
              className="h-[80px] w-[80px] rounded-full border-4 border-[#d4e7fa] object-cover"
            />
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[22px] font-bold text-[#0f3a61]">{currentUser.displayName}</h1>
              <p className="truncate text-base text-[#0f3a61]">{currentUser.email}</p>
            </div>
          </div>
          <form action={saveProfile} className="space-y-2 px-1 pb-2">
            <input
              name="nickname"
              defaultValue={currentUser.displayName}
              className="h-10 w-full rounded-[8px] border border-[#d4e7fa] px-3 text-sm text-[#0f3a61] outline-none"
              placeholder="Ваше ім'я"
            />
            <input
              name="avatarUrl"
              defaultValue={currentUser.avatarUrl ?? ""}
              className="h-10 w-full rounded-[8px] border border-[#d4e7fa] px-3 text-sm text-[#0f3a61] outline-none"
              placeholder="URL картинки профілю"
            />
            <button type="submit" className="grid h-10 w-full place-items-center rounded-[8px] bg-[#207cd3] text-sm font-semibold text-white">
              Зберегти профіль
            </button>
          </form>

          <div className="mt-2 rounded-[8px] bg-[#207cd3] px-3 py-2">
            <div className="flex items-center justify-center gap-2 text-white">
              <img src="/figma-assets/youtube.svg" alt="YouTube" className="h-5 w-7 brightness-0 invert" />
              <span className="text-base font-semibold">YouTube підключено</span>
            </div>
          </div>

          <Link
            href="/auth/register/channels"
            className="mt-3 flex h-[48px] items-center justify-between rounded-[8px] bg-[#d4e7fa] px-4"
          >
            <span className="text-[22px] font-bold text-[#0f3a61]">Вподобання</span>
            <img src="/figma-assets/menu-chevron.svg" alt="" className="h-4 w-2" />
          </Link>
        </section>

        <section className="rounded-[10px] bg-white px-0 py-0">
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="text-[22px] font-bold text-[#0f3a61]">Збережені канали</h2>
          </div>
          <div className="space-y-4">
            {channels.slice(0, 3).map((channel) => (
              <ChannelCard key={channel.slug} channel={channel} compact showBookmark />
            ))}
          </div>
        </section>

        <section className="rounded-[10px] bg-white px-2 pb-2 pt-6">
          <h2 className="mb-3 text-[22px] font-bold text-[#0f3a61]">Додати ютуб-канал</h2>
          <p className="mb-4 text-base text-[#1b2630]">Заповніть форму, щоб запропонувати канал.</p>
          <Link href="/add-channel" className="grid h-10 w-full place-items-center rounded-lg bg-[#207cd3] text-base font-semibold text-white">
            Заповнити форму
          </Link>
        </section>

        <LogoutButton className="h-12 w-full rounded-[10px] border border-[#d4e7fa] bg-white px-4 text-left text-base font-semibold text-[#0f3a61]" />
      </main>
      <Footer />
    </MobileShell>
  );
}
