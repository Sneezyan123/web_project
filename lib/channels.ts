import { ObjectId } from "mongodb";
import { normalizeAvatarUrl } from "@/lib/avatar-url";
import { getDb } from "@/lib/mongodb";
import {
  findThematicTopic,
  thematicTopicLabel,
  thematicTopicNames,
  THEMATIC_COLLECTION_TOPICS,
} from "@/lib/thematic-topics";
import { buildKeywordRegex, buildTopicsMongoFilter } from "@/lib/topic-matching";
import { sanitizeRichHtml } from "@/lib/channel-about-html";
import { decodeParam } from "@/lib/url-params";
import { getYouTubeChannelMeta } from "@/lib/youtube";

export { FILTER_TOPICS } from "@/lib/filter-topics";

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
  recommendedVideos?: Array<{
    title: string;
    url: string;
    thumbnailUrl: string;
    publishedAt?: string;
  }>;
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
  recommendedVideos?: Array<{
    title: string;
    url: string;
    thumbnailUrl: string;
    publishedAt?: string;
  }>;
};

type ChannelSubmissionStatus = "pending" | "approved" | "rejected";

type ChannelSubmissionDoc = {
  _id?: ObjectId;
  name: string;
  youtubeUrl: string;
  about: string;
  topic: string;
  language: string;
  avgDuration: number;
  createdBy: string;
  createdAt: Date;
  status: ChannelSubmissionStatus;
  moderatedBy?: string;
  moderatedAt?: Date;
  rejectionReason?: string;
};

type CommentDoc = {
  _id?: ObjectId;
  channelSlug: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  text: string;
  rating: number;
  createdAt: Date;
  parentId?: string;
};

type ChannelRatingDoc = {
  _id?: ObjectId;
  channelSlug: string;
  userId: string;
  rating: number;
  updatedAt: Date;
};

function formatSubs(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(".", ",")} млн.`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(".", ",")} тис.`;
  }
  return String(value);
}

function mapChannel(doc: ChannelDoc): ChannelItem {
  return {
    slug: doc.slug,
    name: doc.name,
    tags: doc.tags,
    subs: formatSubs(doc.subscribers),
    videos: String(doc.videos),
    rating: doc.rating.toFixed(1),
    avatar: normalizeAvatarUrl(doc.avatar),
    about: doc.about,
    youtubeUrl: doc.youtubeUrl,
    topic: doc.topic,
    language: doc.language,
    avgDuration: doc.avgDuration,
    recommendedVideos: doc.recommendedVideos ?? [],
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

export function normalizeChannelSlug(slug: string) {
  const raw = decodeParam(slug);
  if (!raw) return raw;
  return raw.toLowerCase();
}

export function topicToSlug(topic: string) {
  return slugify(topic);
}

const thematicCollections = THEMATIC_COLLECTION_TOPICS;

export type ThematicCollectionItem = {
  slug: string;
  name: string;
  label: string;
  emoji: string;
  count: number;
};

export type FilterLanguage = "ukrainian" | "bilingual";

export type ChannelsQuery = {
  search?: string;
  sort?: "recommended" | "new" | "top" | "subs" | "videos" | "rating";
  topic?: string;
  topics?: string[];
  language?: string;
  duration?: "short" | "medium" | "long";
  limit?: number;
};

export function channelCountLabel(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} канал`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${count} канали`;
  return `${count} каналів`;
}

export async function getChannels(query: ChannelsQuery = {}) {
  const db = await getDb();
  const collection = db.collection<ChannelDoc>("channels");

  const filter: Record<string, unknown> = {};

  if (query.search?.trim()) {
    const escaped = query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [{ name: { $regex: escaped, $options: "i" } }, { tags: { $regex: escaped, $options: "i" } }];
  }
  const topicLabels =
    query.topics && query.topics.length > 0 ? query.topics : query.topic ? [query.topic] : [];
  if (topicLabels.length > 0) {
    const topicFilter = buildTopicsMongoFilter(
      topicLabels,
      query.topics && query.topics.length > 0 ? "thematic" : "filter",
    );
    if (filter.$or) {
      filter.$and = [{ $or: filter.$or }, topicFilter];
      delete filter.$or;
    } else {
      Object.assign(filter, topicFilter);
    }
  }
  if (query.language === "ukrainian") {
    filter.language = "Українська";
  } else if (query.language === "bilingual") {
    filter.language = { $ne: "Українська" };
  } else if (query.language) {
    filter.language = query.language;
  }
  if (query.duration === "short") filter.avgDuration = { $lt: 10 };
  if (query.duration === "medium") filter.avgDuration = { $gte: 10, $lte: 30 };
  if (query.duration === "long") filter.avgDuration = { $gt: 30 };

  const sort: Record<string, 1 | -1> =
    query.sort === "new"
      ? { createdAt: -1 }
      : query.sort === "top"
        ? { subscribers: -1, rating: -1 }
        : query.sort === "subs"
          ? { subscribers: -1 }
          : query.sort === "videos"
            ? { videos: -1 }
            : query.sort === "rating"
              ? { rating: -1 }
              : { rating: -1, subscribers: -1, createdAt: -1 };

  const effectiveLimit = query.limit ?? 200;
  const docs = await collection.find(filter).sort(sort).limit(effectiveLimit).toArray();
  return docs.map(mapChannel);
}

export async function getChannelBySlug(slug: string) {
  const db = await getDb();
  const collection = db.collection<ChannelDoc>("channels");
  const normalizedSlug = normalizeChannelSlug(slug);
  const doc = await collection.findOne({ slug: normalizedSlug });
  return doc ? mapChannel(doc) : null;
}

export async function getSimilarChannels(slug: string, limit = 2) {
  const db = await getDb();
  const collection = db.collection<ChannelDoc>("channels");
  const normalizedSlug = normalizeChannelSlug(slug);
  const docs = await collection
    .find({ slug: { $ne: normalizedSlug } })
    .sort({ rating: -1, subscribers: -1 })
    .limit(limit)
    .toArray();
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
  const db = await getDb();
  const collection = db.collection<ChannelDoc>("channels");
  const youtubeMeta = await getYouTubeChannelMeta(input.youtubeUrl);

  const baseSlug = slugify(input.name);
  const existing = await collection.countDocuments({ slug: { $regex: `^${baseSlug}` } });
  const slug = existing > 0 ? `${baseSlug}-${existing + 1}` : baseSlug;

  const doc: ChannelDoc = {
    slug,
    name: input.name.trim(),
    tags: input.topic,
    subscribers: youtubeMeta.subscribers ?? 0,
    videos: youtubeMeta.videoCount ?? 0,
    rating: 0,
    avatar: youtubeMeta.avatarUrl ?? "/figma-assets/avatar-header.png",
    about: sanitizeRichHtml(input.about.trim()),
    youtubeUrl: input.youtubeUrl.trim(),
    topic: input.topic.trim(),
    language: input.language.trim(),
    avgDuration: input.avgDuration,
    createdBy: input.createdBy,
    createdAt: new Date(),
    recommendedVideos: youtubeMeta.latestVideos.map((item) => ({
      title: item.title,
      url: `https://www.youtube.com/watch?v=${item.videoId}`,
      thumbnailUrl: item.thumbnailUrl,
      publishedAt: item.publishedAt,
    })),
  };

  await collection.insertOne(doc);
  return slug;
}

export async function createChannelSubmission(input: {
  name: string;
  youtubeUrl: string;
  about: string;
  topic: string;
  language: string;
  avgDuration: number;
  createdBy: string;
}) {
  const db = await getDb();
  await db.collection<ChannelSubmissionDoc>("channel_submissions").insertOne({
    name: input.name.trim(),
    youtubeUrl: input.youtubeUrl.trim(),
    about: sanitizeRichHtml(input.about.trim()),
    topic: input.topic.trim(),
    language: input.language.trim(),
    avgDuration: input.avgDuration,
    createdBy: input.createdBy,
    createdAt: new Date(),
    status: "pending",
  });
}

export type ChannelSubmissionItem = {
  id: string;
  name: string;
  youtubeUrl: string;
  about: string;
  topic: string;
  language: string;
  avgDuration: number;
  createdBy: string;
  status: ChannelSubmissionStatus;
  createdAt: string;
};

export async function getChannelSubmissions(status?: ChannelSubmissionStatus) {
  const db = await getDb();
  const filter = status ? { status } : {};
  const docs = await db
    .collection<ChannelSubmissionDoc>("channel_submissions")
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map((doc) => ({
    id: doc._id?.toString() ?? "",
    name: doc.name,
    youtubeUrl: doc.youtubeUrl,
    about: doc.about,
    topic: doc.topic,
    language: doc.language,
    avgDuration: doc.avgDuration,
    createdBy: doc.createdBy,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
  }));
}

export async function getUserChannelSubmissions(userId: string, status?: ChannelSubmissionStatus) {
  const db = await getDb();
  const baseFilter: Record<string, unknown> = { createdBy: userId };
  if (status) {
    baseFilter.status = status;
  }
  const docs = await db
    .collection<ChannelSubmissionDoc>("channel_submissions")
    .find(baseFilter)
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map((doc) => ({
    id: doc._id?.toString() ?? "",
    name: doc.name,
    youtubeUrl: doc.youtubeUrl,
    about: doc.about,
    topic: doc.topic,
    language: doc.language,
    avgDuration: doc.avgDuration,
    createdBy: doc.createdBy,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
  }));
}

export async function moderateChannelSubmission(input: {
  submissionId: string;
  moderatorId: string;
  action: "approve" | "reject";
}) {
  const db = await getDb();
  const submissions = db.collection<ChannelSubmissionDoc>("channel_submissions");
  const submission = await submissions.findOne({ _id: new ObjectId(input.submissionId) });
  if (!submission || submission.status !== "pending") {
    return { ok: false as const, message: "Заявку не знайдено або вже оброблено" };
  }

  if (input.action === "approve") {
    const slug = await createChannel({
      name: submission.name,
      youtubeUrl: submission.youtubeUrl,
      about: submission.about,
      topic: submission.topic,
      language: submission.language,
      avgDuration: submission.avgDuration,
      createdBy: submission.createdBy,
    });
    const { addBookmarks } = await import("@/lib/bookmarks");
    await addBookmarks(submission.createdBy, [slug]);
  }

  await submissions.updateOne(
    { _id: submission._id },
    {
      $set: {
        status: input.action === "approve" ? "approved" : "rejected",
        moderatedBy: input.moderatorId,
        moderatedAt: new Date(),
      },
    },
  );

  return { ok: true as const };
}

export async function getThematicCollections(
  search?: string,
  sort: "alphabet" | "count" | "rating" = "alphabet",
) {
  const db = await getDb();
  const collection = db.collection<ChannelDoc>("channels");

  const items = await Promise.all(
    thematicCollections.map(async (item) => {
      const keywordRegex = buildKeywordRegex(item.keywords);
      const docs = await collection
        .find({
          $or: [
            { about: { $regex: keywordRegex } },
            { tags: { $regex: keywordRegex } },
            { topic: { $in: thematicTopicNames(item) } },
          ],
        })
        .toArray();
      const count = docs.length;
      const avgRating =
        docs.length > 0 ? docs.reduce((sum, doc) => sum + (doc.rating ?? 0), 0) / docs.length : 0;
      return {
        slug: topicToSlug(item.name),
        name: item.name,
        label: thematicTopicLabel(item),
        emoji: item.emoji,
        count,
        avgRating,
      };
    }),
  );

  const filtered = search?.trim()
    ? items.filter((item) => {
        const q = search.trim().toLowerCase();
        return item.label.toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
      })
    : items;

  if (sort === "count") {
    return filtered.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "uk"));
  }

  if (sort === "rating") {
    return filtered.sort(
      (a, b) => b.avgRating - a.avgRating || a.label.localeCompare(b.label, "uk"),
    );
  }

  return filtered.sort((a, b) => a.label.localeCompare(b.label, "uk"));
}

export async function getChannelsByThematicCollectionSlug(slug: string) {
  const normalizedSlug = topicToSlug(decodeParam(slug));
  const matched = findThematicTopic(normalizedSlug);
  if (!matched) {
    return { title: normalizedSlug.replace(/-/g, " "), channels: [] as ChannelItem[] };
  }

  const db = await getDb();
  const keywordRegex = buildKeywordRegex(matched.keywords);
  const topicNames = thematicTopicNames(matched);
  const docs = await db
    .collection<ChannelDoc>("channels")
    .find({
      $or: [
        { about: { $regex: keywordRegex } },
        { tags: { $regex: keywordRegex } },
        { topic: { $in: topicNames } },
      ],
    })
    .sort({ rating: -1, subscribers: -1, createdAt: -1 })
    .toArray();

  return {
    title: thematicTopicLabel(matched),
    channels: docs.map(mapChannel),
  };
}

export type ChannelComment = {
  id: string;
  userName: string;
  userAvatarUrl: string;
  text: string;
  rating: number;
  createdAt: string;
  parentId?: string;
};

export async function getChannelComments(
  channelSlug: string,
  options?: { page?: number; pageSize?: number },
) {
  const db = await getDb();
  const normalizedSlug = normalizeChannelSlug(channelSlug);
  const page = Math.max(1, options?.page ?? 1);
  const pageSize = options?.pageSize ?? 10;

  const allDocs = await db
    .collection<CommentDoc>("channel_comments")
    .find({ channelSlug: normalizedSlug })
    .sort({ createdAt: -1 })
    .toArray();

  const mapComment = (doc: CommentDoc) => ({
    id: doc._id?.toString() ?? crypto.randomUUID(),
    userName: doc.userName,
    userAvatarUrl: normalizeAvatarUrl(doc.userAvatarUrl),
    text: doc.text,
    rating: doc.rating,
    createdAt: doc.createdAt.toISOString(),
    parentId: doc.parentId,
  });

  const rootDocs = allDocs.filter((doc) => !doc.parentId);
  const total = rootDocs.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageRoots = rootDocs.slice(start, start + pageSize);
  const pageRootIds = new Set(pageRoots.map((doc) => doc._id?.toString()).filter(Boolean) as string[]);
  const replies = allDocs.filter((doc) => doc.parentId && pageRootIds.has(doc.parentId));

  return {
    comments: [...pageRoots, ...replies].map(mapComment),
    total,
    totalPages,
    currentPage: safePage,
  };
}

export async function createChannelComment(input: {
  channelSlug: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  text: string;
  rating?: number;
  parentId?: string;
}) {
  const db = await getDb();
  const normalizedSlug = normalizeChannelSlug(input.channelSlug);
  await db.collection<CommentDoc>("channel_comments").insertOne({
    channelSlug: normalizedSlug,
    userId: input.userId,
    userName: input.userName,
    userAvatarUrl: normalizeAvatarUrl(input.userAvatarUrl),
    text: input.text.trim(),
    rating: input.rating ?? 5,
    createdAt: new Date(),
    parentId: input.parentId,
  });
}

async function recalculateChannelRating(channelSlug: string) {
  const db = await getDb();
  const normalizedSlug = normalizeChannelSlug(channelSlug);
  const ratings = await db.collection<ChannelRatingDoc>("channel_ratings").find({ channelSlug: normalizedSlug }).toArray();
  const avg = ratings.length > 0 ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length : 0;
  await db.collection<ChannelDoc>("channels").updateOne({ slug: normalizedSlug }, { $set: { rating: Number(avg.toFixed(1)) } });
}

export async function rateChannel(input: { channelSlug: string; userId: string; rating: number }) {
  const db = await getDb();
  const normalizedSlug = normalizeChannelSlug(input.channelSlug);
  await db.collection<ChannelRatingDoc>("channel_ratings").updateOne(
    { channelSlug: normalizedSlug, userId: input.userId },
    { $set: { rating: input.rating, updatedAt: new Date() } },
    { upsert: true },
  );
  await recalculateChannelRating(normalizedSlug);
}

export async function getUserChannelRating(channelSlug: string, userId: string) {
  const db = await getDb();
  const normalizedSlug = normalizeChannelSlug(channelSlug);
  const doc = await db.collection<ChannelRatingDoc>("channel_ratings").findOne({ channelSlug: normalizedSlug, userId });
  return doc?.rating ?? 0;
}

export async function updateChannelBySlug(
  slug: string,
  input: { name: string; topic: string; about: string; youtubeUrl: string; language?: string; avgDuration?: number },
) {
  const db = await getDb();
  const normalizedSlug = normalizeChannelSlug(slug);
  const youtubeMeta = await getYouTubeChannelMeta(input.youtubeUrl);
  await db.collection<ChannelDoc>("channels").updateOne(
    { slug: normalizedSlug },
    {
      $set: {
        name: input.name.trim(),
        tags: input.topic.trim(),
        topic: input.topic.trim(),
        about: sanitizeRichHtml(input.about.trim()),
        youtubeUrl: input.youtubeUrl.trim(),
        language: input.language?.trim() || "Українська",
        avgDuration: input.avgDuration ?? 15,
        subscribers: youtubeMeta.subscribers ?? 0,
        videos: youtubeMeta.videoCount ?? 0,
        avatar: youtubeMeta.avatarUrl ?? "/figma-assets/avatar-header.png",
        recommendedVideos: youtubeMeta.latestVideos.map((item) => ({
          title: item.title,
          url: `https://www.youtube.com/watch?v=${item.videoId}`,
          thumbnailUrl: item.thumbnailUrl,
          publishedAt: item.publishedAt,
        })),
      },
    },
  );
}

export async function deleteChannelBySlug(slug: string) {
  const db = await getDb();
  const normalizedSlug = normalizeChannelSlug(slug);
  await Promise.all([
    db.collection<ChannelDoc>("channels").deleteOne({ slug: normalizedSlug }),
    db.collection<CommentDoc>("channel_comments").deleteMany({ channelSlug: normalizedSlug }),
    db.collection<ChannelRatingDoc>("channel_ratings").deleteMany({ channelSlug: normalizedSlug }),
  ]);
}
