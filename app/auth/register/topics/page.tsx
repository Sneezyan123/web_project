import Link from "next/link";
import { MobileShell, topicPills } from "../../../_components/u2u";

export default function RegisterTopicsPage() {
  return (
    <MobileShell>
      <main className="space-y-6 px-4 pb-8 pt-6">
        <h1 className="text-[22px] font-bold text-[#0f3a61]">Що вам подобається?</h1>
        <section className="rounded-xl bg-[#ebeff2] p-3 text-sm text-[#1b2630]">
          Оберіть ваші вподобання (тематичні добірки) для персоналізованих рекомендацій.
        </section>
        <input className="h-10 w-full rounded-lg border border-[#d4e7fa] px-3 outline-none" placeholder="Пошук тематичних добірок" />
        <div className="max-h-[278px] space-y-2 overflow-auto rounded-xl border border-[#d4e7fa] p-3">
          {topicPills.concat(topicPills).map((topic, index) => (
            <Link key={`${topic}-${index}`} href="/collections/ihry" className="block w-full rounded-full bg-[#ebeff2] px-3 py-2 text-left text-sm font-semibold text-[#0f3a61]">
              {topic}
            </Link>
          ))}
        </div>
        <Link href="/auth/register/channels" className="grid h-10 w-full place-items-center rounded-lg bg-[#207cd3] text-base font-semibold text-white">
          Далі
        </Link>
      </main>
    </MobileShell>
  );
}
