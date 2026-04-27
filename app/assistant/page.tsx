import { MobileShell } from "../_components/u2u";

import Link from "next/link";

export default function AssistantPage() {
  return (
    <MobileShell>
      <main className="space-y-4 px-2 pb-8 pt-6">
        <h1 className="px-2 text-[22px] font-bold text-[#0f3a61]">AI помічник</h1>
        <div className="max-w-[308px] rounded-[30px] bg-[#fddba5] p-3 text-sm text-black">
          Привіт! Підкажу, які канали або добірки найкраще підійдуть під твої інтереси.
        </div>
        <div className="flex flex-wrap gap-2 px-2">
          <Link href="/collections/ihry" className="rounded-full bg-[#ebeff2] px-4 py-2 text-sm font-semibold text-[#0f3a61]">Летсплеї</Link>
          <Link href="/collections/ihry" className="rounded-full bg-[#ebeff2] px-4 py-2 text-sm font-semibold text-[#0f3a61]">Шортси</Link>
          <Link href="/collections/ihry" className="rounded-full bg-[#ebeff2] px-4 py-2 text-sm font-semibold text-[#0f3a61]">Книги</Link>
        </div>
        <p className="px-2 text-xs text-[#4d5a66]">*Потрібна авторизація через YouTube для деяких функцій</p>
        <div className="fixed bottom-4 left-1/2 flex w-[344px] -translate-x-1/2 gap-2 rounded-xl bg-white p-2 shadow">
          <input className="h-10 flex-1 rounded-lg border border-[#d4e7fa] px-3 text-sm outline-none" placeholder="Ваше повідомлення..." />
          <Link href="/channels" className="grid h-10 w-20 place-items-center rounded-lg bg-[#207cd3] text-white">Надіслати</Link>
        </div>
      </main>
    </MobileShell>
  );
}
