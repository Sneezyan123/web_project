import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getChannels, normalizeChannelSlug } from "@/lib/channels";
import type { ChannelItem } from "@/lib/channels";

type BookmarkDoc = {
  _id?: ObjectId;
  userId: string;
  channelSlug: string;
  createdAt: Date;
};

async function findBookmarkDoc(userId: string, channelSlug: string) {
  const db = await getDb();
  const collection = db.collection<BookmarkDoc>("user_bookmarks");
  const normalized = normalizeChannelSlug(channelSlug);
  const docs = await collection.find({ userId }).toArray();
  return docs.find((doc) => normalizeChannelSlug(doc.channelSlug) === normalized) ?? null;
}

export async function addBookmarks(userId: string, channelSlugs: string[]) {
  const uniqueSlugs = [...new Set(channelSlugs.map((slug) => normalizeChannelSlug(slug)).filter(Boolean))];
  if (uniqueSlugs.length === 0) return;

  const db = await getDb();
  const collection = db.collection<BookmarkDoc>("user_bookmarks");
  const existing = await collection.find({ userId }).toArray();
  const existingSlugs = new Set(existing.map((doc) => normalizeChannelSlug(doc.channelSlug)));
  const toInsert = uniqueSlugs
    .filter((slug) => !existingSlugs.has(slug))
    .map((channelSlug) => ({
      userId,
      channelSlug,
      createdAt: new Date(),
    }));

  if (toInsert.length > 0) {
    await collection.insertMany(toInsert);
  }
}

export async function toggleBookmark(userId: string, channelSlug: string) {
  const normalized = normalizeChannelSlug(channelSlug);
  const db = await getDb();
  const collection = db.collection<BookmarkDoc>("user_bookmarks");
  const existing = await findBookmarkDoc(userId, normalized);

  if (existing) {
    await collection.deleteOne({ _id: existing._id });
    return false;
  }

  await collection.insertOne({
    userId,
    channelSlug: normalized,
    createdAt: new Date(),
  });
  return true;
}

export async function getUserBookmarks(userId: string): Promise<string[]> {
  const db = await getDb();
  const docs = await db
    .collection<BookmarkDoc>("user_bookmarks")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();

  return [...new Set(docs.map((doc) => normalizeChannelSlug(doc.channelSlug)))];
}

export async function isChannelBookmarked(userId: string, channelSlug: string) {
  const bookmarks = await getUserBookmarks(userId);
  const normalized = normalizeChannelSlug(channelSlug);
  return bookmarks.includes(normalized);
}

export async function getBookmarkedChannels(userId: string): Promise<ChannelItem[]> {
  const slugs = await getUserBookmarks(userId);
  if (slugs.length === 0) return [];

  const allChannels = await getChannels({ limit: 1000 });
  const map = new Map(allChannels.map((channel) => [normalizeChannelSlug(channel.slug), channel]));

  return slugs.map((slug) => map.get(slug)).filter(Boolean) as ChannelItem[];
}
