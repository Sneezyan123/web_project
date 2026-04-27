import Link from "next/link";
import { Footer, Header, MobileShell } from "../_components/u2u";

const faq = [
  "Що таке U2U?",
  "Як додати канал?",
  "Як працюють рекомендації?",
  "Чи є модерація?",
  "Як зв'язатися з командою?",
];

export default function AboutPage() {
  return (
    <MobileShell>
      <Header />
      <main className="space-y-4 px-4 pb-8 pt-[13px]">
        <p className="pl-2 text-xs text-[#4d5a66]">Головна / Про проєкт</p>

        <section className="rounded-[10px] bg-white px-2 pb-4 pt-6">
          <h1 className="mb-4 text-[22px] font-bold text-[#0f3a61]">Про проєкт</h1>
          <p className="text-sm leading-[1.2] text-[#1b2630]">
            U2U: Ukrainians to Ukrainians — простір для українців, які шукають україномовний контент. Ми створили платформу,
            щоб швидко знаходити якісні канали, добірки та нових авторів.
          </p>
        </section>

        <section className="rounded-[10px] bg-white px-2 pb-4 pt-6">
          <h2 className="mb-4 text-[22px] font-bold text-[#0f3a61]">Питання та відповіді</h2>
          <div className="space-y-3">
            {faq.map((item) => (
              <Link key={item} href="/assistant" className="block w-full rounded-[8px] border border-[#d4e7fa] p-3 text-left text-sm font-semibold text-[#0f3a61]">
                {item}
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[10px] bg-white px-2 pb-4 pt-6">
          <h2 className="mb-3 text-[22px] font-bold text-[#0f3a61]">Маєш пропозиції для покращення сайту?</h2>
          <textarea className="h-[228px] w-full resize-none rounded-[8px] border border-[#d4e7fa] p-3 text-sm outline-none" placeholder="Напиши нам..." />
        </section>
      </main>
      <Footer />
    </MobileShell>
  );
}
