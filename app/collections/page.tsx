import Link from "next/link";
import { topicToSlug } from "@/lib/channels";
import { Footer, Header, MobileShell, topicPills } from "../_components/u2u";

export default function CollectionsPage() {
  return (
    <MobileShell>
      <Header />
      <main className="space-y-4 px-4 pb-8 pt-[13px]">
        <p className="pl-2 text-xs text-[#4d5a66]">Головна / Добірки</p>
        <section className="rounded-[10px] bg-white px-0 pb-4 pt-6">
          <h1 className="mb-4 px-2 text-[22px] font-bold text-[#0f3a61]">Тематичні добірки</h1>
          <input className="mb-4 h-10 w-full rounded-[8px] border border-[#d4e7fa] px-3 text-sm outline-none" placeholder="Пошук добірок" />
          <div className="space-y-3">
            {topicPills.concat(topicPills).map((topic, index) => (
              <Link
                href={`/collections/${topicToSlug(topic)}`}
                key={`${topic}-${index}`}
                className="block w-full rounded-[50px] bg-[#ebeff2] px-4 py-2 text-base font-semibold text-[#0f3a61]"
              >
                {topic}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </MobileShell>
  );
}
