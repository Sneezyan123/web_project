import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export type SiteSuggestionDoc = {
  _id?: ObjectId;
  text: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  createdAt: Date;
};

const MAX_LENGTH = 2000;

export async function createSiteSuggestion(input: {
  text: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
}) {
  const text = input.text.trim();
  if (!text) {
    throw new Error("EMPTY");
  }
  if (text.length > MAX_LENGTH) {
    throw new Error("TOO_LONG");
  }

  const db = await getDb();
  await db.collection<SiteSuggestionDoc>("site_suggestions").insertOne({
    text,
    userId: input.userId,
    userName: input.userName,
    userEmail: input.userEmail,
    createdAt: new Date(),
  });
}
