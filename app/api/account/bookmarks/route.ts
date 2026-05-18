import { NextResponse } from "next/server";
import { addBookmarks } from "@/lib/bookmarks";
import { getCurrentUser } from "@/lib/current-user";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { channelSlugs?: string[] };
  const channelSlugs = Array.isArray(body.channelSlugs) ? body.channelSlugs : [];

  await addBookmarks(user.id, channelSlugs);

  return NextResponse.json({ ok: true });
}
