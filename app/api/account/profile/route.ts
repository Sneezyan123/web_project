import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { updateUserIdentity } from "@/lib/users";

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { nickname?: string; email?: string; avatarUrl?: string };
  const nickname = body.nickname?.trim();
  const email = body.email?.trim().toLowerCase();

  if (!nickname || !email) {
    return NextResponse.json({ message: "Заповніть ім'я та email" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ message: "Некоректний email" }, { status: 400 });
  }

  const result = await updateUserIdentity({
    userId: user.id,
    nickname,
    email,
    avatarUrl: body.avatarUrl,
  });

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}
