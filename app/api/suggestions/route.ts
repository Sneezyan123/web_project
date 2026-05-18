import { NextResponse } from "next/server";
import { createSiteSuggestion } from "@/lib/suggestions";
import { getCurrentUser } from "@/lib/current-user";

export async function POST(request: Request) {
  const body = (await request.json()) as { text?: string };
  const text = body.text?.trim() ?? "";

  if (!text) {
    return NextResponse.json({ message: "Напишіть пропозицію перед відправкою." }, { status: 400 });
  }

  const user = await getCurrentUser();

  try {
    await createSiteSuggestion({
      text,
      userId: user?.id,
      userName: user?.displayName,
      userEmail: user?.email,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "TOO_LONG") {
      return NextResponse.json({ message: "Забагато символів (максимум 2000)." }, { status: 400 });
    }
    throw error;
  }

  return NextResponse.json({ ok: true });
}
