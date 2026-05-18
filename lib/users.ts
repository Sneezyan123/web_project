import { ObjectId } from "mongodb";
import { hash } from "bcryptjs";
import { getDb } from "@/lib/mongodb";

type UserDoc = {
  _id?: ObjectId;
  email?: string;
  passwordHash?: string;
  nickname?: string;
  avatarUrl?: string;
  role?: "user" | "moderator";
  createdAt?: Date;
  oauthProvider?: "google" | "facebook";
  oauthProviderId?: string;
};

export async function updateUserIdentity(input: { userId: string; nickname: string; email: string; avatarUrl?: string }) {
  const db = await getDb();
  const users = db.collection<UserDoc>("users");
  const normalizedEmail = input.email.trim().toLowerCase();
  const nickname = input.nickname.trim();

  const existing = await users.findOne({
    email: normalizedEmail,
    _id: { $ne: new ObjectId(input.userId) },
  });

  if (existing) {
    return { ok: false as const, message: "Користувач з таким email вже існує" };
  }

  const updatePayload: { nickname: string; email: string; avatarUrl?: string } = {
    nickname,
    email: normalizedEmail,
  };
  if (typeof input.avatarUrl === "string") {
    updatePayload.avatarUrl = input.avatarUrl.trim();
  }

  await users.updateOne(
    { _id: new ObjectId(input.userId) },
    { $set: updatePayload },
  );

  return { ok: true as const };
}

export async function ensureModeratorAccount() {
  const db = await getDb();
  const users = db.collection<UserDoc>("users");
  const email = "moderator@u2u.local";
  const existing = await users.findOne({ email });
  if (existing) return;

  const passwordHash = await hash("moderator123", 12);
  await users.insertOne({
    nickname: "U2U Moderator",
    email,
    passwordHash,
    role: "moderator",
    createdAt: new Date(),
  });
}

export async function findOrCreateOAuthUser(input: {
  email: string;
  nickname: string;
  avatarUrl?: string;
  provider: "google" | "facebook";
  providerId: string;
}) {
  const db = await getDb();
  const users = db.collection<UserDoc>("users");
  const normalizedEmail = input.email.trim().toLowerCase();

  const existingByProvider = await users.findOne({
    oauthProvider: input.provider,
    oauthProviderId: input.providerId,
  });
  if (existingByProvider?._id && existingByProvider.email) {
    return { id: existingByProvider._id.toString(), email: existingByProvider.email };
  }

  const existingByEmail = await users.findOne({ email: normalizedEmail });
  if (existingByEmail?._id && existingByEmail.email) {
    await users.updateOne(
      { _id: existingByEmail._id },
      {
        $set: {
          oauthProvider: input.provider,
          oauthProviderId: input.providerId,
          nickname: existingByEmail.nickname || input.nickname.trim(),
          avatarUrl: existingByEmail.avatarUrl || input.avatarUrl || "",
        },
      },
    );
    return { id: existingByEmail._id.toString(), email: existingByEmail.email };
  }

  const insert = await users.insertOne({
    email: normalizedEmail,
    nickname: input.nickname.trim(),
    avatarUrl: input.avatarUrl?.trim() || "",
    role: "user",
    oauthProvider: input.provider,
    oauthProviderId: input.providerId,
    createdAt: new Date(),
  });

  return { id: insert.insertedId.toString(), email: normalizedEmail };
}
