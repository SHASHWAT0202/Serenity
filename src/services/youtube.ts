export interface YouTubeSearchItem {
  videoId: string;
  title: string;
  channelTitle: string;
  description: string;
  publishedAt?: string;
}

export interface YouTubeSearchOptions {
  maxResults?: number;
  regionCode?: string;
  safeSearch?: 'none' | 'moderate' | 'strict';
  type?: 'video' | 'channel' | 'playlist';
}

const getApiKey = (): string | null => {
  const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env;
  return (
    env?.VITE_YT_API_KEY ||
    env?.VITE_YOUTUBE_API_KEY ||
    env?.VITE_YOUTUBE_DATA_API_KEY ||
    null
  );
};

export async function searchYouTube(query: string, opts: YouTubeSearchOptions = {}): Promise<YouTubeSearchItem[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn('[YouTube] API key not set (VITE_YT_API_KEY). Returning empty results.');
    return [];
  }

  const params = new URLSearchParams({
    key: apiKey,
    part: 'snippet',
    q: query,
    maxResults: String(opts.maxResults ?? 5),
    type: opts.type ?? 'video',
    regionCode: opts.regionCode ?? 'IN',
    safeSearch: opts.safeSearch ?? 'strict',
  });

  const url = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error('[YouTube] Search failed', res.status, await res.text());
    return [];
  }
  const data = await res.json();
  const items = Array.isArray(data.items) ? data.items : [];
  return items
    .map((it: any) => ({
      videoId: it.id?.videoId || '',
      title: it.snippet?.title || '',
      channelTitle: it.snippet?.channelTitle || '',
      description: it.snippet?.description || '',
      publishedAt: it.snippet?.publishedAt || undefined,
    }))
    .filter((i: YouTubeSearchItem) => i.videoId && i.title);
}
