'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const faqs = [
  {
    q: "Що таке U2U і як він працює?",
    a: "U2U — це єдиний агрегатор україномовного контенту. Ми допомагаємо користувачам знаходити якісні YouTube-канали, а авторам — свою аудиторію."
  },
  {
    q: "Як U2U підбирає рекомендації для мене?",
    a: "На основі ваших інтересів, обраних тем при реєстрації та взаємодії із контентом на сайті."
  },
  {
    q: "Чи можу я запропонувати YouTube-канал або інший ресурс для U2U?",
    a: "Так! Будь-який користувач може подати форму 'Додати канал' на головній сторінці."
  },
  {
    q: "Чи є можливість знайти менш відомих контент-мейкерів?",
    a: "Звичайно. Ми активно підтримуємо розвиток маленьких і перспективних каналів."
  },
  {
    q: "Чи буде U2U розширювати свою бібліотеку контенту?",
    a: "Так, у майбутньому ми інтегруємо подкасти, українські ігри та блоги."
  }
];

export default function AboutPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="bg-white min-h-screen max-w-md mx-auto shadow-xl flex flex-col font-sans text-gray-900 pb-10">
      {/* Static guest/auth agnostic header */}
      <Header user={null} />

      <main className="px-4 pt-2 flex flex-col gap-6">
        {/* Breadcrumbs */}
        <div className="text-gray-400 text-[11px] font-medium pl-1">
          Головна / Про проєкт
        </div>

        {/* About Body */}
        <section className="flex flex-col gap-5">
          <h1 className="text-[24px] font-bold text-blue-800">Про проєкт</h1>
          
          <p className="text-[14px] text-gray-800 leading-relaxed">
            <span className="font-bold">U2U: Ukrainians to Ukrainians</span> — простір для українців, які шукають україномовний контент, що надихає та відповідає їхнім інтересам. Після початку повномасштабного вторгнення, для багатьох українців постало питання: як відмовитися від російськомовного контенту та знайти якісну альтернативу українською? Ми створили U2U, щоб зробити цей шлях простішим і приємнішим, об&apos;єднуючи в одному місці найкращі україномовні ресурси.
          </p>

          <p className="text-[14px] text-gray-800 leading-relaxed">
            Наш сайт призначений для молоді, яка хоче відкривати нове та унікальне. На U2U ви знайдете добірки від популярних YouTube-каналів до менш відомих, але не менш цікавих українських креаторів, що заслуговують на увагу.<br/>
            <span className="font-bold">Наша місія</span> — зробити український контент більш доступним, підтримати розвиток українських контент-мейкерів і надати платформу, де кожен може знайти щось для себе. З U2U ви відкриєте, наскільки різнобарвним та цікавим є український інформаційний простір.
          </p>

          <p className="text-[14px] text-gray-800 leading-relaxed">
            У майбутньому ми плануємо розширити платформу і включити до неї музику, ігри українського виробництва. Ми віримо, що кожен зможе знайти вітчизняний контент для душі, відкрити нових авторів та насолодитися українською культурою.<br/>
            <span className="font-bold">U2U — українці для українців. Разом ми будуємо простір для себе та про себе.</span>
          </p>
        </section>

        {/* FAQ Section */}
        <section className="flex flex-col gap-4 mt-2">
          <h2 className="text-[20px] font-bold text-blue-800">Питання та відповіді</h2>
          <div className="flex flex-col gap-2">
            {faqs.map((item, i) => (
              <div key={i} className="flex flex-col">
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full bg-blue-50 text-left p-4 rounded-[12px] flex items-center justify-between transition-colors hover:bg-blue-100"
                >
                  <span className="font-bold text-[13px] text-blue-900 leading-snug">{item.q}</span>
                  <svg 
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
                    className={`text-blue-700 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {openIndex === i && (
                  <div className="p-4 bg-white border-x border-b border-blue-50 text-[13px] text-gray-600 rounded-b-[12px] leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Suggestions Section */}
        <section className="flex flex-col gap-3 mt-4">
          <h2 className="text-[20px] font-bold text-blue-800">Маєш пропозиції для покращення сайту?</h2>
          <div className="flex flex-col gap-1">
            <span className="text-gray-700 text-xs font-semibold pl-1">Напишіть пропозиції</span>
            <textarea 
              placeholder="Напр. “Додати коментарі”" 
              className="w-full h-32 border border-blue-100 rounded-[12px] p-3 text-[13px] outline-none placeholder-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all resize-none shadow-sm"
            />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-[12px] transition-all mt-1 shadow-sm">
            Відправити
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
