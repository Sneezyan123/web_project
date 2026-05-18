import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { deleteChannelBySlug, updateChannelBySlug } from "@/lib/channels";

export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "moderator") {
    return NextResponse.json({ message: "Доступ заборонено" }, { status: 403 });
  }

  const body = (await request.json()) as {
    name?: string;
    topic?: string;
    about?: string;
    youtubeUrl?: string;
    language?: string;
    avgDuration?: number;
  };

  if (!body.name || !body.topic || !body.about || !body.youtubeUrl) {
    return NextResponse.json({ message: "Заповніть обов'язкові поля" }, { status: 400 });
  }

  const { slug } = await params;
  await updateChannelBySlug(slug, {
    name: body.name,
    topic: body.topic,
    about: body.about,
    youtubeUrl: body.youtubeUrl,
    language: body.language,
    avgDuration: Number(body.avgDuration ?? 15),
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "moderator") {
    return NextResponse.json({ message: "Доступ заборонено" }, { status: 403 });
  }

  const { slug } = await params;
  await deleteChannelBySlug(slug);
  return NextResponse.json({ ok: true });
}
