import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { RegisterForm } from "./RegisterForm";
import { REGISTER_BANNER } from "@/lib/copy";
import { ModalPage, PrimaryButton, RegistrationStepDots } from "@/components/ui/app-ui";

export default async function RegisterPage() {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect("/account");
  }

  return (
    <ModalPage title="Реєстрація" closeHref="/">
      <div className="flex flex-col gap-6">
        <div className="rounded-[10px] bg-[#d4e7fa] p-4">
          <p className="text-[14px] font-medium leading-normal text-black">{REGISTER_BANNER}</p>
        </div>

        <RegisterForm />

        <RegistrationStepDots activeStep={1} />

        <PrimaryButton type="submit" form="register-form">
          Далі
        </PrimaryButton>

        <Link
          href="/auth/login"
          className="block text-center text-[16px] font-semibold leading-[22px] text-[#207cd3] transition-opacity hover:opacity-80"
        >
          Вже є акаунт? Увійти
        </Link>
      </div>
    </ModalPage>
  );
}
