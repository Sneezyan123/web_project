import Link from "next/link";
import { getChannels } from "@/lib/channels";
import { getCurrentUser } from "@/lib/current-user";
import { getBookmarkedChannels } from "@/lib/bookmarks";
import { parseTopicsFromSearchParams, toggleTopicHref } from "@/lib/home-query";
import { MultilineText } from "@/components/MultilineText";
import { HOME_ADD_CHANNEL_LOGGED_IN, GUEST_ADD_CHANNEL, ADD_CHANNEL_ATTENTION_BOLD } from "@/lib/copy";
import { AssistantBubble, SectionTitle, SortTabs, ViewAllLink } from "@/components/ui/app-ui";
import { ChannelCard, Footer, Header, MobileShell, topicPills } from "./_components/u2u";

type SearchParams = Promise<{
  search?: string;
  sort?: "recommended" | "new" | "top";
  topic?: string;
  topics?: string | string[];
}>;

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const currentUser = await getCurrentUser();

  const activeSort = params.sort ?? "recommended";
  const activeTopics = parseTopicsFromSearchParams(params);

  const channels = await getChannels({
    sort: params.sort,
    topics: activeTopics.length > 0 ? activeTopics : undefined,
    search: params.search,
    limit: 5,
  });

  const savedChannels = currentUser ? await getBookmarkedChannels(currentUser.id) : [];

  return (
    <MobileShell>
      <Header />
      <main className="flex flex-1 flex-col space-y-4 px-4 pb-8 pt-[14px]">
        {currentUser ? (
          <Link
            href="/account#saved"
            className="flex h-[62px] items-center justify-between rounded-[10px] bg-[#d4e7fa] pl-4 pr-[18px] transition-colors hover:bg-[#c8def5]"
          >
            <p className="text-[22px] font-bold leading-none text-[#0f3a61]">Збережені канали</p>
            <div className="flex items-center gap-2">
              <div className="grid size-7 place-items-center rounded-full bg-white text-base font-bold text-[#0f3a61]">
                {savedChannels.length}
              </div>
              <img src="/figma-assets/chevron.svg" alt="" className="h-6 w-6" />
            </div>
          </Link>
        ) : null}

        <section className="space-y-4 rounded-[12px] px-2 pt-6">
          <div className="flex items-end justify-between">
            <SectionTitle className="text-[22px]">Тематичні добірки</SectionTitle>
            <ViewAllLink href="/collections" />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {topicPills.map((topic) => {
              const isActive = activeTopics.includes(topic.label);
              return (
                <Link
                  href={toggleTopicHref(activeTopics, topic.label, activeSort, params.search)}
                  key={topic.label}
                  className={`flex h-10 items-center justify-center gap-2 rounded-[50px] px-4 text-base font-semibold transition-colors ${
                    isActive ? "bg-[#207cd3] text-white" : "bg-[#ebeff2] text-[#0f3a61]"
                  }`}
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
            <SectionTitle className="pl-2 text-[22px]">Ютуб-канали</SectionTitle>
            <span className="pr-2">
              <ViewAllLink href="/channels" />
            </span>
          </div>

          <div className="pl-2">
            <SortTabs
              basePath="/"
              activeSort={activeSort}
              search={params.search}
              topics={activeTopics.length > 0 ? activeTopics : undefined}
            />
          </div>

          {channels.length === 0 ? (
            <p className="pl-2 text-[16px] text-[#4d5a66]">
              {activeTopics.length > 0
                ? "Немає каналів, що відповідають усім обраним добіркам."
                : "Поки немає каналів у базі."}
            </p>
          ) : (
            channels.map((channel) => <ChannelCard key={channel.slug} channel={channel} />)
          )}
        </section>

        <section className="space-y-4 rounded-[10px] bg-white px-2 pt-6">
          <SectionTitle className="text-[22px]">Додати ютуб-канал</SectionTitle>
          {currentUser ? (
            <p className="text-base text-black">
              <MultilineText text={HOME_ADD_CHANNEL_LOGGED_IN} boldSegments={[ADD_CHANNEL_ATTENTION_BOLD]} />
            </p>
          ) : (
            <p className="text-base text-black">
              <MultilineText
                text={GUEST_ADD_CHANNEL}
                boldSegments={[ADD_CHANNEL_ATTENTION_BOLD]}
              />
            </p>
          )}
          <Link
            href={currentUser ? "/add-channel" : "/auth/login"}
            className="grid h-10 w-full place-items-center rounded-[8px] bg-[#207cd3] text-[16px] font-medium text-white transition-colors hover:bg-[#1a6bb8]"
          >
            {currentUser ? "Заповнити форму" : "Увійти або зареєструватись"}
          </Link>
        </section>
      </main>
      <AssistantBubble />
      <Footer />
    </MobileShell>
  );
}
