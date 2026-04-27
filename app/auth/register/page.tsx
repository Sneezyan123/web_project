import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { MobileShell } from "../../_components/u2u";
import { RegisterForm } from "./RegisterForm";

export default async function RegisterPage() {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect("/account");
  }

  return (
    <MobileShell>
      <main className="min-h-screen bg-white px-3 pt-4">
        <div className="rounded-[10px] bg-white px-3 pb-4 pt-3">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-[38px] leading-none font-bold text-[#0f3a61]">Реєстрація</h1>
            <Link href="/" aria-label="Закрити" className="text-3xl leading-none text-black">
              ×
            </Link>
          </div>
          <section className="mb-4 rounded-xl bg-[#bbd5ef] p-3 text-sm text-[#1b2630]">
            Зареєструвавшись на U2U ви зможете коментувати канали, додавати їх в збережені, додавати канали, яких ще немає на сайті та отримувати персоналізовані рекомендації!
          </section>
          <RegisterForm />
          <Link href="/auth/login" className="mt-3 block text-center text-base font-semibold text-[#207cd3]">
            Вже є акаунт? Увійти
          </Link>
        </div>
      </main>
    </MobileShell>
  );
}
