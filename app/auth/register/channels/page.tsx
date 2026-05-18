import { getChannels } from "@/lib/channels";
import { RegisterChannelsStep } from "./RegisterChannelsStep";

export default async function RegisterChannelsPage() {
  const channels = await getChannels({ sort: "recommended", limit: 100 });

  return <RegisterChannelsStep channels={channels} />;
}
