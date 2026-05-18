import { NextResponse } from "next/server";
import { createChannelSubmission, getChannels } from "@/lib/channels";
import { getCurrentUser } from "@/lib/current-user";
import { getYouTubeChannelMeta } from "@/lib/youtube";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channels = await getChannels({
    search: searchParams.get("search") ?? undefined,
    sort: (searchParams.get("sort") as "recommended" | "new" | "top" | null) ?? undefined,
    topic: searchParams.get("topic") ?? undefined,
    language: searchParams.get("language") ?? undefined,
    duration: (searchParams.get("duration") as "short" | "medium" | "long" | null) ?? undefined,
  });

  return NextResponse.json({ channels });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    youtubeUrl?: string;
    about?: string;
    topic?: string;
    language?: string;
    avgDuration?: number;
  };

  if (!body.youtubeUrl || !body.about || !body.topic) {
    return NextResponse.json({ message: "Не всі поля заповнені" }, { status: 400 });
  }

  const youtubeMeta = await getYouTubeChannelMeta(body.youtubeUrl);
  const channelName = youtubeMeta.title?.trim();
  if (!channelName) {
    return NextResponse.json(
      { message: "Не вдалося отримати назву каналу з YouTube. Перевірте посилання." },
      { status: 400 },
    );
  }

  await createChannelSubmission({
    name: channelName,
    youtubeUrl: body.youtubeUrl,
    about: body.about,
    topic: body.topic,
    language: body.language ?? "Українська",
    avgDuration: Number(body.avgDuration ?? 15),
    createdBy: user.id,
  });

  return NextResponse.json({ ok: true });
}
