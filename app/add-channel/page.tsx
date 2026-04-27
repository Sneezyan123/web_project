import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createChannel } from "@/lib/channels";
import { getCurrentUser } from "@/lib/current-user";
import { MobileShell } from "../_components/u2u";
import { RichTextInput } from "./rich-text-input";

export default async function AddChannelPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/auth/login");
  }

  async function submitChannel(formData: FormData) {
    "use server";
    const user = await getCurrentUser();
    if (!user) {
      redirect("/auth/login");
    }

    const explicitName = String(formData.get("name") ?? "").trim();
    const youtubeUrl = String(formData.get("youtubeUrl") ?? "").trim();
    const about = String(formData.get("about") ?? "").trim();
    const topic = String(formData.get("topic") ?? "").trim();
    const language = String(formData.get("language") ?? "Українська").trim();
    const avgDuration = Number(formData.get("avgDuration") ?? 15);

    if (!youtubeUrl || !about || !topic) {
      return;
    }

    const fallbackName = youtubeUrl
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split(/[/?#]/)[0]
      .slice(0, 60);
    const name = explicitName || fallbackName || "Новий канал";

    await createChannel({
      name,
      youtubeUrl,
      about,
      topic,
      language,
      avgDuration,
      createdBy: user.id,
    });

    revalidatePath("/");
    revalidatePath("/channels");
    redirect("/add-channel/success");
  }

  return (
    <MobileShell>
      <main className="min-h-screen bg-white p-2">
        <section className="rounded-[10px] bg-white px-4 pb-4 pt-3">
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-[39px]/[1] font-bold text-[#0f3a61]">Додати ютуб-канал</h1>
            <Link href="/" aria-label="Закрити" className="text-2xl leading-none text-black">
              ×
            </Link>
          </div>
          <p className="mb-4 text-[14px]/[1.35] text-[#1b2630]">
            <strong>Увага: розглядаються лише україномовні канали, російськомовні не додаються!</strong>
            <br />
            Перевірте, чи каналу ще немає на сайті.
            <br />
            Статус запиту можна відстежувати в акаунті.
          </p>

          <form action={submitChannel} className="space-y-4">
            <input name="name" type="hidden" value="Новий канал" />
            <div>
              <label className="mb-2 block text-base text-[#1b2630]">
                URL-адреса каналу<span className="text-[#cf2a1e]">*</span>
              </label>
              <input
                name="youtubeUrl"
                type="url"
                required
                className="h-10 w-full rounded-[8px] border-2 border-[#bbdbf8] px-3 text-base outline-none placeholder:text-[#9da8b2]"
                placeholder="Введіть посилання на канал."
              />
            </div>

            <div>
              <label className="mb-2 block text-base text-[#1b2630]">
                Опис каналу (до 1000 символів)<span className="text-[#cf2a1e]">*</span>
              </label>
              <RichTextInput
                name="about"
                required
                maxLength={1000}
                placeholder="Введіть опис каналу."
              />
            </div>

            <div>
              <label className="mb-2 block text-base text-[#1b2630]">
                Оберіть тематику каналу (до 3 категорій)<span className="text-[#cf2a1e]">*</span>
              </label>
              <textarea
                name="topic"
                required
                className="h-[74px] w-full resize-none rounded-[8px] border-2 border-[#bbdbf8] p-3 text-base outline-none placeholder:text-[#9da8b2]"
                placeholder="Напишіть тематику."
              />
            </div>

            <input type="hidden" name="language" value="Українська" />
            <input type="hidden" name="avgDuration" value="20" />

            <button type="submit" className="grid h-10 w-full place-items-center rounded-[8px] bg-[#207cd3] text-base font-semibold text-white">
              Відправити
            </button>
          </form>
        </section>
      </main>
    </MobileShell>
  );
}
