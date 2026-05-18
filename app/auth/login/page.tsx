import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { ModalPage } from "@/components/ui/app-ui";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect("/account");
  }

  return (
    <ModalPage title="Вхід" closeHref="/" largeTitle>
      <LoginForm />
    </ModalPage>
  );
}
