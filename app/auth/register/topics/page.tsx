import Link from "next/link";
import { MultilineText } from "@/components/MultilineText";
import { ModalPage, PrimaryLink, RegistrationStepDots } from "@/components/ui/app-ui";
import { REGISTER_TOPICS_BANNER } from "@/lib/copy";
import { REGISTER_TOPIC_OPTIONS } from "@/lib/thematic-topics";
import { RegisterTopicsClient } from "./RegisterTopicsClient";

const secondaryButton =
  "flex h-10 w-[168px] items-center justify-center text-[16px] font-semibold text-[#207cd3] transition-opacity hover:opacity-80";

export default function RegisterTopicsPage() {
  return (
    <ModalPage
      title="Що вам подобається?"
      closeHref="/"
      largeTitle
      footer={
        <>
          <RegistrationStepDots activeStep={2} />

          <PrimaryLink href="/auth/register/channels" className="mt-2.5 font-semibold">
            Далі
          </PrimaryLink>

          <div className="mt-1 flex w-full gap-2">
            <Link href="/auth/register" className={secondaryButton}>
              Назад
            </Link>
            <Link href="/auth/register/channels" className={secondaryButton}>
              Пропустити
            </Link>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex min-h-[70px] items-center rounded-[10px] bg-[#d4e7fa] px-2 py-4">
          <p className="text-[14px] font-normal leading-normal text-black">
            <MultilineText text={REGISTER_TOPICS_BANNER} boldSegments={["(тематичні добірки)"]} />
          </p>
        </div>

        <RegisterTopicsClient topics={REGISTER_TOPIC_OPTIONS} />
      </div>
    </ModalPage>
  );
}
