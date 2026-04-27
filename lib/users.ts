import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

type UserDoc = {
  _id?: ObjectId;
  nickname?: string;
  avatarUrl?: string;
};

export async function updateUserProfile(input: { userId: string; nickname: string; avatarUrl: string }) {
  const db = await getDb();
  await db.collection<UserDoc>("users").updateOne(
    { _id: new ObjectId(input.userId) },
    { $set: { nickname: input.nickname.trim(), avatarUrl: input.avatarUrl.trim() } },
  );
}
