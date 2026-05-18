import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ensureModeratorAccount } from "@/lib/users";
import { sessionCookieName, sessionMaxAge, signSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      nickname?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    };

    const nickname = body.nickname?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();
    const confirmPassword = body.confirmPassword?.trim();

    if (!nickname || !email || !password || !confirmPassword) {
      return NextResponse.json({ message: "Заповніть всі поля" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Пароль має бути мінімум 6 символів" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Паролі не співпадають" }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection("users");
    await ensureModeratorAccount();
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ message: "Користувач вже існує" }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);

    const insert = await users.insertOne({
      nickname,
      email,
      passwordHash,
      role: "user",
      createdAt: new Date(),
    });

    const token = await signSession({
      userId: insert.insertedId.toString(),
      email,
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: sessionCookieName,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: sessionMaxAge,
    });

    return response;
  } catch {
    return NextResponse.json({ message: "Помилка сервера" }, { status: 500 });
  }
}
