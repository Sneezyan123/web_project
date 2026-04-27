import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { sessionCookieName, sessionMaxAge, signSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();

    if (!email || !password) {
      return NextResponse.json({ message: "Введіть email і пароль" }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection("users");
    const user = await users.findOne<{ _id: { toString(): string }; email: string; passwordHash: string }>({ email });

    if (!user) {
      return NextResponse.json({ message: "Невірний email або пароль" }, { status: 401 });
    }

    const isPasswordValid = await compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Невірний email або пароль" }, { status: 401 });
    }

    const token = await signSession({
      userId: user._id.toString(),
      email: user.email,
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
