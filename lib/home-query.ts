import { decodeParam } from "@/lib/url-params";

export function parseTopicsFromSearchParams(params: {
  topic?: string;
  topics?: string | string[];
}): string[] {
  const raw = params.topics;
  const fromList = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const legacy = params.topic ? [params.topic] : [];
  return [...new Set([...fromList, ...legacy].map((value) => decodeParam(value)).filter(Boolean))];
}

export function buildHomeHref(options: {
  sort?: string;
  topics?: string[];
  search?: string;
}) {
  const params = new URLSearchParams();
  if (options.search) params.set("search", options.search);
  if (options.sort && options.sort !== "recommended") params.set("sort", options.sort);
  options.topics?.forEach((topic) => params.append("topics", topic));
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export function toggleTopicHref(
  activeTopics: string[],
  clickedLabel: string,
  sort: string,
  search?: string,
) {
  const next = activeTopics.includes(clickedLabel)
    ? activeTopics.filter((topic) => topic !== clickedLabel)
    : [...activeTopics, clickedLabel];
  return buildHomeHref({ sort, topics: next, search });
}
