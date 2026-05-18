import { MobileShell } from "@/components/layout/MobileShell";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AboutFaq } from "./AboutFaq";
import { AboutFeedback } from "./AboutFeedback";
import { AssistantBubble, Breadcrumbs, SectionTitle } from "@/components/ui/app-ui";

const aboutBodyParagraphs = [
  <>
    <span className="font-semibold">U2U: Ukrainians to Ukrainians</span>
    {
      " — простір для українців, які шукають україномовний контент, що надихає та відповідає їхнім інтересам. Після початку повномасштабного вторгнення, для багатьох українців постало питання: як відмовитися від російськомовного контенту та знайти якісну альтернативу українською? Ми створили U2U, щоб зробити цей шлях простішим і приємнішим, об'єднуючи в одному місці найкращі україномовні ресурси."
    }
  </>,
  "Наш сайт призначений для молоді, яка хоче відкривати нове та унікальне. На U2U ви знайдете добірки від популярних YouTube-каналів до менш відомих, але не менш цікавих українських креаторів, що заслуговують на увагу.",
  "Наша місія — зробити український контент більш доступним, підтримати розвиток українських контент-мейкерів і надати платформу, де кожен може знайти щось для себе. З U2U ви відкриєте, наскільки різнобарвним та цікавим є український інформаційний простір.",
  "У майбутньому ми плануємо розширити платформу і включити до неї музику, ігри українського виробництва. Ми віримо, що кожен зможе знайти вітчизняний контент для душі, відкрити нових авторів та насолодитися українською культурою.",
];

export default function AboutPage() {
  return (
    <MobileShell>
      <Header />
      <main className="flex flex-1 flex-col pb-8">
        <div className="px-[16.5px]">
          <div className="px-2 py-[5px]">
            <Breadcrumbs>Головна / Про проєкт</Breadcrumbs>
          </div>

          <div className="mt-[13px] flex w-full max-w-[360px] flex-col">
            <section className="flex flex-col px-2 pb-4 pt-6">
              <SectionTitle>Про проєкт</SectionTitle>
              <div className="mt-4 w-full max-w-[344px] text-[16px] font-normal leading-normal text-black">
                <p className="mb-0">{aboutBodyParagraphs[0]}</p>
                {aboutBodyParagraphs.slice(1).map((paragraph) => (
                  <p key={typeof paragraph === "string" ? paragraph.slice(0, 32) : "closing"} className="mb-0 pt-4">
                    {paragraph}
                  </p>
                ))}
                <p className="mb-0 pt-4 font-semibold">
                  U2U — українці для українців. Разом ми будуємо простір для себе та про себе.
                </p>
              </div>
            </section>

            <section className="flex flex-col gap-6 px-2 pb-4 pt-6">
              <SectionTitle>Питання та відповіді</SectionTitle>
              <AboutFaq />
            </section>

            <section className="flex flex-col gap-6 px-2 pb-4 pt-6">
              <SectionTitle className="max-w-[318px] leading-snug">
                Маєш пропозиції для покращення сайту?
              </SectionTitle>
              <AboutFeedback />
            </section>
          </div>
        </div>
      </main>
      <AssistantBubble />
      <Footer />
    </MobileShell>
  );
}
