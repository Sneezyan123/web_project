import Link from "next/link";
import { getChannels } from "@/lib/channels";
import { topicToSlug } from "@/lib/channels";
import { findThematicTopic } from "@/lib/thematic-topics";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { MultilineText } from "@/components/MultilineText";
import { GUEST_ADD_CHANNEL, ADD_CHANNEL_ATTENTION_BOLD } from "@/lib/copy";
import { AssistantBubble, SectionTitle, SortTabs, ViewAllLink } from "@/components/ui/app-ui";
import { ChannelCard, Footer, Header, MobileShell, topicPills } from "../_components/u2u";

type SearchParams = Promise<{ sort?: "recommended" | "new" | "top" }>;

export default async function GuestHomePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect("/");
  }
  const activeSort = params.sort ?? "recommended";
  const channels = await getChannels({ sort: activeSort, limit: 8 });

  return (
    <MobileShell>
      <Header />
      <main className="flex flex-1 flex-col space-y-4 px-4 pb-8 pt-[14px]">
        <section className="rounded-xl bg-white px-2 pt-6">
          <div className="mb-4 flex items-end justify-between">
            <SectionTitle>Тематичні добірки</SectionTitle>
            <ViewAllLink href="/collections" />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {topicPills.map((topic) => {
              const collection = findThematicTopic(topic.label);
              const href = collection
                ? `/collections/${topicToSlug(collection.name)}`
                : `/collections/${topicToSlug(topic.label)}`;
              return (
              <Link
                key={topic.label}
                href={href}
                className="flex h-10 items-center justify-center gap-2 rounded-[50px] bg-[#ebeff2] px-4 text-base font-semibold text-[#0f3a61]"
              >
                <img src={topic.icon} alt="" className="h-5 w-5 shrink-0 object-contain" />
                <span>{topic.label}</span>
              </Link>
            );
            })}
          </div>
        </section>
        <section className="space-y-4 rounded-[10px] bg-white px-2 pt-6">
          <div className="flex items-center justify-between">
            <SectionTitle className="pl-2">Ютуб-канали</SectionTitle>
            <span className="pr-2">
              <ViewAllLink href="/channels" />
            </span>
          </div>
          <div className="pl-2">
            <SortTabs basePath="/guest" activeSort={activeSort} />
          </div>
          {channels.map((channel) => (
            <ChannelCard key={channel.slug} channel={channel} />
          ))}
        </section>
        <section className="space-y-4 rounded-[10px] bg-white px-2 pt-6">
          <SectionTitle>Додати ютуб-канал</SectionTitle>
          <p className="text-base leading-relaxed text-[#1b2630]">
            <MultilineText text={GUEST_ADD_CHANNEL} boldSegments={[ADD_CHANNEL_ATTENTION_BOLD]} />
          </p>
          <Link
            href="/auth/login"
            className="grid h-10 w-full place-items-center rounded-[8px] bg-[#207cd3] text-[16px] font-medium text-white transition-colors hover:bg-[#1a6bb8]"
          >
            Увійти або зареєструватись
          </Link>
        </section>
      </main>
      <AssistantBubble />
      <Footer />
    </MobileShell>
  );
}
