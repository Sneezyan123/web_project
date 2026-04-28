import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getChannels } from "@/lib/channels";
import type { ChannelItem } from "@/lib/channels";

type BookmarkDoc = {
  _id?: ObjectId;
  userId: string;
  channelSlug: string;
  createdAt: Date;
};

export async function toggleBookmark(userId: string, channelSlug: string) {
  const db = await getDb();
  const collection = db.collection<BookmarkDoc>("user_bookmarks");
  
  const existing = await collection.findOne({ userId, channelSlug });
  
  if (existing) {
    await collection.deleteOne({ _id: existing._id });
    return false; // removed
  } else {
    await collection.insertOne({
      userId,
      channelSlug,
      createdAt: new Date()
    });
    return true; // added
  }
}

export async function getUserBookmarks(userId: string): Promise<string[]> {
  const db = await getDb();
  const docs = await db.collection<BookmarkDoc>("user_bookmarks")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
    
  return docs.map(doc => doc.channelSlug);
}

export async function getBookmarkedChannels(userId: string): Promise<ChannelItem[]> {
  const slugs = await getUserBookmarks(userId);
  if (slugs.length === 0) return [];
  
  // To avoid multiple queries, we can just fetch all channels and filter, 
  // or use the DB directly. For simplicity, fetch channels:
  const db = await getDb();
  const channelDocs = await db.collection("channels").find({ slug: { $in: slugs } }).toArray();
  
  // Format them like getChannels does
  const allChannels = await getChannels({ limit: 1000 });
  const map = new Map(allChannels.map(c => [c.slug, c]));
  
  return slugs.map(slug => map.get(slug)).filter(Boolean) as ChannelItem[];
}
