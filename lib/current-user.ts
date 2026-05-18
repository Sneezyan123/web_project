import { ObjectId } from "mongodb";
import { normalizeAvatarUrl } from "@/lib/avatar-url";
import { getSessionFromCookies } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

type DbUser = {
  _id: ObjectId;
  nickname?: string;
  avatarUrl?: string;
  email: string;
  createdAt?: Date;
  role?: "user" | "moderator";
};

export type CurrentUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt?: string;
  role: "user" | "moderator";
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getSessionFromCookies();
  if (!session) return null;

  const db = await getDb();
  const users = db.collection<DbUser>("users");
  const user = await users.findOne({ _id: new ObjectId(session.userId) });

  if (!user) return null;

  return {
    id: user._id.toString(),
    email: user.email,
    displayName: user.nickname || user.email.split("@")[0],
    avatarUrl: user.avatarUrl?.trim() ? normalizeAvatarUrl(user.avatarUrl) : undefined,
    createdAt: user.createdAt?.toISOString(),
    role: user.role ?? "user",
  };
}
