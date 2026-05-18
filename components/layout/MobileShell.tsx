export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[393px] flex-col overflow-x-hidden bg-white font-sans text-[#0f3a61] shadow-xl">
      {children}
    </div>
  );
}
