import { MobileShell } from "@/components/layout/MobileShell";
import { CloseButton } from "@/components/ui/app-ui";
import ChatContainer from "./ChatContainer";

export default function AssistantPage() {
  return (
    <MobileShell>
      <div className="flex min-h-[calc(100dvh-0px)] flex-col px-4 pb-4 pt-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium uppercase tracking-wide text-[#686e74]">AI помічник</span>
            <h1 className="text-[25px] font-bold leading-none text-[#0f3a61]">Помічник</h1>
          </div>
          <CloseButton href="/" />
        </div>
        <ChatContainer />
      </div>
    </MobileShell>
  );
}
