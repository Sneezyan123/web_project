import { getThematicCollections } from "@/lib/channels";
import { getCurrentUser } from "@/lib/current-user";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MobileShell } from "@/components/layout/MobileShell";
import { AssistantBubble, Breadcrumbs, PageTitle } from "@/components/ui/app-ui";
import { CollectionsList } from "./CollectionsList";

type SearchParams = Promise<{ sort?: "alphabet" | "count" | "rating" }>;

export default async function CollectionsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const activeSort: "alphabet" | "count" | "rating" =
    params.sort === "count" || params.sort === "rating" ? params.sort : "alphabet";
  const fullTopicsList = await getThematicCollections(undefined, activeSort);

  return (
    <MobileShell>
      <Header user={user} />

      <main className="flex flex-1 flex-col gap-5 px-4 pb-10 pt-4">
        <Breadcrumbs>Головна / Добірки</Breadcrumbs>

        <PageTitle>Тематичні добірки</PageTitle>

        <CollectionsList topics={fullTopicsList} activeSort={activeSort} />
      </main>

      <AssistantBubble />
      <Footer />
    </MobileShell>
  );
}
