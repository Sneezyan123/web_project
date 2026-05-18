import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getCurrentUser } from "@/lib/current-user";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 3 * 1024 * 1024;

function extFromType(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/jpeg" || type === "image/jpg") return "jpg";
  return null;
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("avatar");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Файл не знайдено" }, { status: 400 });
  }
  if (file.size <= 0 || file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ message: "Файл має бути до 3MB" }, { status: 400 });
  }

  const ext = extFromType(file.type);
  if (!ext) {
    return NextResponse.json({ message: "Дозволено лише JPG/PNG/WEBP" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const relativeDir = "public/uploads/avatars";
  const absoluteDir = join(process.cwd(), relativeDir);
  await mkdir(absoluteDir, { recursive: true });

  const fileName = `${user.id}-${Date.now()}.${ext}`;
  const absolutePath = join(absoluteDir, fileName);
  await writeFile(absolutePath, bytes);

  return NextResponse.json({ ok: true, avatarUrl: `/uploads/avatars/${fileName}` });
}
