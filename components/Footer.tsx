import { U2ULogo } from "@/components/U2ULogo";

export default function Footer() {
  return (
    <footer className="relative mt-auto h-[138px] w-full shrink-0 bg-white px-[18px] pt-[24px]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <U2ULogo variant="footer" />
          <p className="mt-2 text-xs leading-normal text-[#0071bc]">Ukrainians to Ukrainians </p>
        </div>
        <p className="shrink-0 text-right text-xs leading-normal text-black">
          Підтримуй українське!
          <br />
          Шукай нас у соцмережах!
        </p>
      </div>
      <div className="absolute bottom-[20px] right-[18px] flex items-center gap-[5px]">
        <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
          <img src="/figma-assets/facebook.svg" alt="" className="h-6 w-6" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
          <img src="/figma-assets/instagram.svg" alt="" className="h-6 w-6" />
        </a>
        <a href="https://t.me" target="_blank" rel="noreferrer" aria-label="Telegram">
          <img src="/figma-assets/telegram.svg" alt="" className="h-6 w-6" />
        </a>
      </div>
    </footer>
  );
}
