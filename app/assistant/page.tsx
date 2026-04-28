import Link from "next/link";
import Image from "next/image";
import ChatContainer from "./ChatContainer";

export default function AssistantPage() {
  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 max-w-md mx-auto relative shadow-xl px-0 pt-10 flex flex-col justify-between overflow-hidden">
      <div>
        <div className="flex items-center justify-between px-6 mb-4">
          <Link href="/">
            <Image src="/assets/layer_2.svg" alt="UU Logo" width={40} height={40} />
          </Link>
          <Link href="/" aria-label="Закрити" className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 px-6">AI помічник</h1>
        <p className="text-xs text-gray-500 px-6 mt-1">*Працює на базі Groq LLaMA 3</p>
      </div>

      <ChatContainer />
    </div>
  );
}
