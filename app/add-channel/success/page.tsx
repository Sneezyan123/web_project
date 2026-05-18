import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { ModalPage, PrimaryLink } from "@/components/ui/app-ui";

export default async function AddChannelSuccessPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/auth/login");
  }

  return (
    <ModalPage
      title="Дякуємо!"
      closeHref="/"
      footer={
        <PrimaryLink href="/" className="font-semibold">
          Зрозуміло!
        </PrimaryLink>
      }
    >
      <div className="flex flex-col gap-4 text-[16px] leading-[22px] text-black">
        <p className="font-semibold">Канал успішно надіслано на розгляд.</p>
        <p>
          Після перевірки модераторами він може з&apos;явитися на сайті. Ви можете відстежувати статус у своєму
          акаунті.
        </p>
        <p>Разом популяризуємо український контент!</p>
      </div>
    </ModalPage>
  );
}
