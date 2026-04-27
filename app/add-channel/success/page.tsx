import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { MobileShell } from "../../_components/u2u";

export default async function AddChannelSuccessPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/auth/login");
  }

  return (
    <MobileShell>
      <main className="space-y-6 px-4 pb-8 pt-6">
        <h1 className="text-[22px] font-bold text-[#0f3a61]">Дякуємо!</h1>
        <p className="text-sm text-[#1b2630]">
          Канал успішно надіслано на розгляд. Після перевірки модераторами він може з’явитися на сайті.
        </p>
        <Link href="/account" className="grid h-10 w-full place-items-center rounded-lg bg-[#207cd3] text-base font-semibold text-white">
          Добре
        </Link>
      </main>
    </MobileShell>
  );
}
