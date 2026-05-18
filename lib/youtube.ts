type YouTubeChannelMeta = {
  title?: string;
  avatarUrl?: string;
  subscribers?: number;
  videoCount?: number;
  latestVideos: Array<{
    videoId: string;
    title: string;
    thumbnailUrl: string;
    publishedAt?: string;
  }>;
};

function parseYouTubeUrl(input: string) {
  try {
    const url = new URL(input.trim());
    const host = url.hostname.replace(/^www\./, "");
    const parts = url.pathname.split("/").filter(Boolean);

    if (host === "youtu.be") {
      return { videoId: parts[0] };
    }

    if (!host.endsWith("youtube.com")) {
      return {};
    }

    if (url.pathname === "/watch") {
      return { videoId: url.searchParams.get("v") ?? undefined };
    }

    if (parts[0] === "channel" && parts[1]) {
      return { channelId: parts[1] };
    }

    if (parts[0]?.startsWith("@")) {
      return { handle: parts[0].slice(1) };
    }

    if ((parts[0] === "c" || parts[0] === "user") && parts[1]) {
      return { query: parts[1] };
    }

    return {};
  } catch {
    return {};
  }
}

async function youtubeGetJson<T>(path: string, params: Record<string, string>) {
  const key = process.env.YOUTUBE_API_KEY?.trim();
  if (!key) return null;

  const searchParams = new URLSearchParams({ ...params, key });
  const response = await fetch(`https://www.googleapis.com/youtube/v3/${path}?${searchParams.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) return null;
  return (await response.json()) as T;
}

async function resolveChannelIdFromVideo(videoId: string) {
  type VideoResponse = {
    items?: Array<{ snippet?: { channelId?: string } }>;
  };
  const data = await youtubeGetJson<VideoResponse>("videos", {
    id: videoId,
    part: "snippet",
    maxResults: "1",
  });
  return data?.items?.[0]?.snippet?.channelId;
}

async function resolveChannelIdBySearch(query: string) {
  type SearchResponse = {
    items?: Array<{ id?: { channelId?: string } }>;
  };
  const data = await youtubeGetJson<SearchResponse>("search", {
    q: query,
    part: "snippet",
    type: "channel",
    maxResults: "1",
  });
  return data?.items?.[0]?.id?.channelId;
}

export async function getYouTubeChannelMeta(channelUrl: string): Promise<YouTubeChannelMeta> {
  const parsed = parseYouTubeUrl(channelUrl);

  let channelId = parsed.channelId;
  if (!channelId && parsed.videoId) {
    channelId = await resolveChannelIdFromVideo(parsed.videoId);
  }
  if (!channelId && parsed.handle) {
    channelId = await resolveChannelIdBySearch(parsed.handle);
  }
  if (!channelId && parsed.query) {
    channelId = await resolveChannelIdBySearch(parsed.query);
  }
  if (!channelId) {
    return { latestVideos: [] };
  }

  type ChannelResponse = {
    items?: Array<{
      statistics?: { subscriberCount?: string; videoCount?: string };
      snippet?: {
        title?: string;
        thumbnails?: {
          high?: { url?: string };
          medium?: { url?: string };
          default?: { url?: string };
        };
      };
    }>;
  };

  const data = await youtubeGetJson<ChannelResponse>("channels", {
    id: channelId,
    part: "snippet,statistics",
    maxResults: "1",
  });

  const channel = data?.items?.[0];
  if (!channel) return { latestVideos: [] };

  type SearchVideosResponse = {
    items?: Array<{
      id?: { videoId?: string };
      snippet?: {
        title?: string;
        publishedAt?: string;
        thumbnails?: {
          high?: { url?: string };
          medium?: { url?: string };
          default?: { url?: string };
        };
      };
    }>;
  };

  const videosData = await youtubeGetJson<SearchVideosResponse>("search", {
    channelId,
    part: "snippet",
    type: "video",
    order: "date",
    maxResults: "3",
  });

  const latestVideos =
    videosData?.items
      ?.map((item) => ({
        videoId: item.id?.videoId ?? "",
        title: item.snippet?.title ?? "Без назви",
        thumbnailUrl:
          item.snippet?.thumbnails?.high?.url ??
          item.snippet?.thumbnails?.medium?.url ??
          item.snippet?.thumbnails?.default?.url ??
          "",
        publishedAt: item.snippet?.publishedAt,
      }))
      .filter((item) => item.videoId && item.thumbnailUrl) ?? [];

  return {
    title: channel.snippet?.title,
    avatarUrl:
      channel.snippet?.thumbnails?.high?.url ??
      channel.snippet?.thumbnails?.medium?.url ??
      channel.snippet?.thumbnails?.default?.url,
    subscribers: Number(channel.statistics?.subscriberCount ?? 0),
    videoCount: Number(channel.statistics?.videoCount ?? 0),
    latestVideos,
  };
}
