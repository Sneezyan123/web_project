import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export type ChannelItem = {
  slug: string;
  name: string;
  tags: string;
  subs: string;
  videos: string;
  rating: string;
  avatar: string;
  about: string;
  youtubeUrl: string;
  topic: string;
  language: string;
  avgDuration: number;
};

type ChannelDoc = {
  _id?: ObjectId;
  slug: string;
  name: string;
  tags: string;
  subscribers: number;
  videos: number;
  rating: number;
  avatar: string;
  about: string;
  youtubeUrl: string;
  topic: string;
  language: string;
  avgDuration: number;
  createdBy?: string;
  createdAt: Date;
};

type CommentDoc = {
  _id?: ObjectId;
  channelSlug: string;
  userId: string;
  userName: string;
  text: string;
  rating: number;
  createdAt: Date;
};

type ChannelRatingDoc = {
  _id?: ObjectId;
  channelSlug: string;
  userId: string;
  rating: number;
  updatedAt: Date;
};

const seedChannels: Omit<ChannelDoc, "_id" | "createdAt">[] = [
  {
    slug: "melior-max",
    name: "Melior Max",
    tags: "Ігри, Летсплеї",
    subscribers: 45100,
    videos: 957,
    rating: 4.8,
    avatar: "/figma-assets/avatar-melior.png",
    about: "Привіт мене звати Макс і я роблю легсплеї українською на моєму каналі.",
    youtubeUrl: "https://www.youtube.com/",
    topic: "Ігри",
    language: "Українська",
    avgDuration: 28,
  },
  {
    slug: "thetremba",
    name: "thetremba",
    tags: "Ігри, Летсплеї, Стріми",
    subscribers: 116000,
    videos: 455,
    rating: 4.9,
    avatar: "/figma-assets/avatar-thetremba.png",
    about: "можна просто Тремба. ми тут проходимо всі ігрові новинки, інді ігри та класику.",
    youtubeUrl: "https://www.youtube.com/",
    topic: "Ігри",
    language: "Українська",
    avgDuration: 35,
  },
  {
    slug: "zagir-kinomaniya",
    name: "Zagir Кіноманія",
    tags: "Кіно, Огляди",
    subscribers: 693000,
    videos: 298,
    rating: 4.3,
    avatar: "/figma-assets/avatar-zagir.png",
    about: "Автор каналу - Віталік Гордієнко. Канал про сенси, змісти та культурний простір.",
    youtubeUrl: "https://www.youtube.com/",
    topic: "Кіно",
    language: "Українська",
    avgDuration: 22,
  },
  {
    slug: "atomicprod",
    name: "ATOMICPROD",
    tags: "Подорожі, Лайфстайл",
    subscribers: 17400,
    videos: 10,
    rating: 4.4,
    avatar: "/figma-assets/avatar-atomicprod.png",
    about: "Радий вітати на своєму каналі - тут зможете побачити незвичайний контент.",
    youtubeUrl: "https://www.youtube.com/",
    topic: "Подорожі",
    language: "Українська",
    avgDuration: 14,
  },
  {
    slug: "volnyckyi",
    name: "Volnyckyi",
    tags: "Стріми, Ігри",
    subscribers: 23000,
    videos: 251,
    rating: 3.8,
    avatar: "/figma-assets/avatar-volynckyi.png",
    about: "Це авторський український канал про комп'ютерні ігри в жанрі FPS.",
    youtubeUrl: "https://www.youtube.com/",
    topic: "Ігри",
    language: "Українська",
    avgDuration: 41,
  },
];

function formatSubs(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(".", ",")} тис.`;
  }
  return `${value}`;
}

function mapChannel(doc: ChannelDoc): ChannelItem {
  return {
    slug: doc.slug,
    name: doc.name,
    tags: doc.tags,
    subs: formatSubs(doc.subscribers),
    videos: String(doc.videos),
    rating: doc.rating.toFixed(1),
    avatar: doc.avatar,
    about: doc.about,
    youtubeUrl: doc.youtubeUrl,
    topic: doc.topic,
    language: doc.language,
    avgDuration: doc.avgDuration,
  };
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яіїєґ\s-]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function sanitizeRichHtml(input: string) {
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

export function topicToSlug(topic: string) {
  return slugify(topic);
}

async function ensureSeed() {
  const db = await getDb();
  const collection = db.collection<ChannelDoc>("channels");
  const count = await collection.countDocuments();

  if (count > 0) return;

  await collection.insertMany(
    seedChannels.map((item) => ({
      ...item,
      createdAt: new Date(),
    })),
  );
}

export type ChannelsQuery = {
  search?: string;
  sort?: "recommended" | "new" | "top";
  topic?: string;
  language?: string;
  duration?: "short" | "medium" | "long";
  limit?: number;
};

export async function getChannels(query: ChannelsQuery = {}) {
  await ensureSeed();
  const db = await getDb();
  const collection = db.collection<ChannelDoc>("channels");

  const filter: Record<string, unknown> = {};

  if (query.search?.trim()) {
    const escaped = query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [{ name: { $regex: escaped, $options: "i" } }, { tags: { $regex: escaped, $options: "i" } }];
  }
  if (query.topic) filter.topic = query.topic;
  if (query.language) filter.language = query.language;
  if (query.duration === "short") filter.avgDuration = { $lt: 15 };
  if (query.duration === "medium") filter.avgDuration = { $gte: 15, $lte: 30 };
  if (query.duration === "long") filter.avgDuration = { $gt: 30 };

  const sort: Record<string, 1 | -1> =
    query.sort === "new"
      ? { createdAt: -1 }
      : query.sort === "top"
        ? { rating: -1, subscribers: -1 }
        : { rating: -1, subscribers: -1, createdAt: -1 };

  const docs = await collection.find(filter).sort(sort).limit(query.limit ?? 200).toArray();
  return docs.map(mapChannel);
}

export async function getChannelBySlug(slug: string) {
  await ensureSeed();
  const db = await getDb();
  const collection = db.collection<ChannelDoc>("channels");
  const doc = await collection.findOne({ slug });
  return doc ? mapChannel(doc) : null;
}

export async function getSimilarChannels(slug: string, limit = 2) {
  await ensureSeed();
  const db = await getDb();
  const collection = db.collection<ChannelDoc>("channels");
  const docs = await collection.find({ slug: { $ne: slug } }).sort({ rating: -1, subscribers: -1 }).limit(limit).toArray();
  return docs.map(mapChannel);
}

export async function createChannel(input: {
  name: string;
  youtubeUrl: string;
  about: string;
  topic: string;
  language: string;
  avgDuration: number;
  createdBy?: string;
}) {
  await ensureSeed();
  const db = await getDb();
  const collection = db.collection<ChannelDoc>("channels");

  const baseSlug = slugify(input.name);
  const existing = await collection.countDocuments({ slug: { $regex: `^${baseSlug}` } });
  const slug = existing > 0 ? `${baseSlug}-${existing + 1}` : baseSlug;

  const doc: ChannelDoc = {
    slug,
    name: input.name.trim(),
    tags: input.topic,
    subscribers: 0,
    videos: 0,
    rating: 0,
    avatar: "/figma-assets/avatar-header.png",
    about: sanitizeRichHtml(input.about.trim()),
    youtubeUrl: input.youtubeUrl.trim(),
    topic: input.topic.trim(),
    language: input.language.trim(),
    avgDuration: input.avgDuration,
    createdBy: input.createdBy,
    createdAt: new Date(),
  };

  await collection.insertOne(doc);
  return slug;
}

export async function getTopics() {
  await ensureSeed();
  const db = await getDb();
  const values = await db.collection<ChannelDoc>("channels").distinct("topic");
  return values.sort((a, b) => a.localeCompare(b, "uk"));
}

export async function getLanguages() {
  await ensureSeed();
  const db = await getDb();
  const values = await db.collection<ChannelDoc>("channels").distinct("language");
  return values.sort((a, b) => a.localeCompare(b, "uk"));
}

export type ChannelComment = {
  id: string;
  userName: string;
  text: string;
  rating: number;
  createdAt: string;
};

export async function getChannelComments(channelSlug: string) {
  await ensureSeed();
  const db = await getDb();
  const docs = await db.collection<CommentDoc>("channel_comments").find({ channelSlug }).sort({ createdAt: -1 }).limit(50).toArray();
  return docs.map((doc) => ({
    id: doc._id?.toString() ?? crypto.randomUUID(),
    userName: doc.userName,
    text: doc.text,
    rating: doc.rating,
    createdAt: doc.createdAt.toISOString(),
  }));
}

export async function createChannelComment(input: {
  channelSlug: string;
  userId: string;
  userName: string;
  text: string;
  rating?: number;
}) {
  const db = await getDb();
  await db.collection<CommentDoc>("channel_comments").insertOne({
    channelSlug: input.channelSlug,
    userId: input.userId,
    userName: input.userName,
    text: input.text.trim(),
    rating: input.rating ?? 5,
    createdAt: new Date(),
  });
}

async function recalculateChannelRating(channelSlug: string) {
  const db = await getDb();
  const ratings = await db.collection<ChannelRatingDoc>("channel_ratings").find({ channelSlug }).toArray();
  const avg = ratings.length > 0 ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length : 0;
  await db.collection<ChannelDoc>("channels").updateOne({ slug: channelSlug }, { $set: { rating: Number(avg.toFixed(1)) } });
}

export async function rateChannel(input: { channelSlug: string; userId: string; rating: number }) {
  const db = await getDb();
  await db.collection<ChannelRatingDoc>("channel_ratings").updateOne(
    { channelSlug: input.channelSlug, userId: input.userId },
    { $set: { rating: input.rating, updatedAt: new Date() } },
    { upsert: true },
  );
  await recalculateChannelRating(input.channelSlug);
}

export async function getUserChannelRating(channelSlug: string, userId: string) {
  const db = await getDb();
  const doc = await db.collection<ChannelRatingDoc>("channel_ratings").findOne({ channelSlug, userId });
  return doc?.rating ?? 0;
}
