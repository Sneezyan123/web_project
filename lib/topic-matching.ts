import { getFilterTopicKeywords } from "@/lib/filter-topics";
import { findThematicTopic, thematicTopicNames } from "@/lib/thematic-topics";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function keywordToPattern(keyword: string) {
  const escaped = escapeRegex(keyword);
  if (keyword.length <= 3 && /^[a-z]+$/i.test(keyword)) {
    return `(?:^|[^a-zа-яіїєґ0-9])${escaped}(?:[^a-zа-яіїєґ0-9]|$)`;
  }
  return escaped;
}

export function buildKeywordRegex(keywords: string[]) {
  const patterns = keywords.map((keyword) => keywordToPattern(keyword));
  return new RegExp(patterns.join("|"), "i");
}

export function resolveTopicKeywords(topicLabel: string): string[] {
  const filterKeywords = getFilterTopicKeywords(topicLabel);
  if (filterKeywords.length > 1 || filterKeywords[0] !== topicLabel.toLowerCase()) {
    return filterKeywords;
  }

  const thematic = findThematicTopic(topicLabel);
  if (thematic) return thematic.keywords;

  return filterKeywords;
}

export function buildTopicMongoFilter(topicLabel: string) {
  const regex = buildKeywordRegex(resolveTopicKeywords(topicLabel));
  return {
    $or: [
      { topic: { $regex: regex } },
      { tags: { $regex: regex } },
      { name: { $regex: regex } },
    ],
  };
}

export function buildThematicCollectionMongoFilter(topicLabel: string) {
  const regex = buildKeywordRegex(resolveTopicKeywords(topicLabel));
  const thematic = findThematicTopic(topicLabel);
  const topicMatch = thematic
    ? { topic: { $in: thematicTopicNames(thematic) } }
    : { topic: topicLabel };
  return {
    $or: [{ about: { $regex: regex } }, { tags: { $regex: regex } }, topicMatch],
  };
}

export function buildTopicsMongoFilter(topicLabels: string[], mode: "filter" | "thematic" = "filter") {
  const labels = [...new Set(topicLabels.map((label) => label.trim()).filter(Boolean))];
  if (labels.length === 0) return {};

  const build = mode === "thematic" ? buildThematicCollectionMongoFilter : buildTopicMongoFilter;
  if (labels.length === 1) return build(labels[0]);
  return { $and: labels.map((label) => build(label)) };
}
