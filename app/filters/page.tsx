import Link from "next/link";
import { getLanguages, getTopics } from "@/lib/channels";
import { MobileShell } from "../_components/u2u";

const duration = [
  { id: "short", label: "до 15 хв" },
  { id: "medium", label: "15-30 хв" },
  { id: "long", label: "30+ хв" },
];

export default async function FiltersPage() {
  const themes = await getTopics();
  const langs = await getLanguages();

  return (
    <MobileShell>
      <main className="space-y-6 px-4 pb-8 pt-6">
        <h1 className="text-[22px] font-bold text-[#0f3a61]">Фільтри</h1>

        <form action="/channels" className="space-y-6">
          <section>
            <h2 className="mb-2 text-base font-semibold text-[#0f3a61]">Тематика</h2>
            <select name="topic" className="h-10 w-full rounded-lg border border-[#d4e7fa] bg-white px-3 text-sm text-[#0f3a61] outline-none">
              <option value="">Будь-яка</option>
              {themes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[#0f3a61]">Мова</h2>
            <select name="language" className="h-10 w-full rounded-lg border border-[#d4e7fa] bg-white px-3 text-sm text-[#0f3a61] outline-none">
              <option value="">Будь-яка</option>
              {langs.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[#0f3a61]">Тривалість відео</h2>
            <select name="duration" className="h-10 w-full rounded-lg border border-[#d4e7fa] bg-white px-3 text-sm text-[#0f3a61] outline-none">
              <option value="">Будь-яка</option>
              {duration.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </section>

          <button type="submit" className="grid h-10 w-full place-items-center rounded-lg bg-[#207cd3] text-base font-semibold text-white">
            Застосувати
          </button>
          <Link href="/channels" className="grid h-10 w-full place-items-center rounded-lg border border-[#207cd3] text-base font-semibold text-[#207cd3]">
            Скинути
          </Link>
        </form>
      </main>
    </MobileShell>
  );
}
