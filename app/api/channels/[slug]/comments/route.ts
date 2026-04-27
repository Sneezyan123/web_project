import { NextResponse } from "next/server";
import { createChannelComment, getChannelComments } from "@/lib/channels";
import { getCurrentUser } from "@/lib/current-user";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comments = await getChannelComments(slug);
  return NextResponse.json({ comments });
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const body = (await request.json()) as { text?: string; rating?: number };
  const text = body.text?.trim();
  if (!text) {
    return NextResponse.json({ message: "Текст коментаря порожній" }, { status: 400 });
  }

  await createChannelComment({
    channelSlug: slug,
    userId: user.id,
    userName: user.displayName,
    text,
    rating: body.rating ?? 5,
  });

  return NextResponse.json({ ok: true });
}
