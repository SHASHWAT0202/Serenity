export interface SpotifyTrackItem {
  id: string;
  title: string;
  artist: string;
  url: string;
  previewUrl?: string;
  albumImage?: string;
}

// NOTE: For secure production usage, use a backend to exchange Client ID/Secret
// with Spotify (Client Credentials) and proxy search requests. As a client-only
// fallback, we can use the public oEmbed endpoint to get metadata from track URLs.

export async function fetchSpotifyOEmbed(url: string): Promise<any | null> {
  try {
    const res = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error('[Spotify] oEmbed error', e);
    return null;
  }
}

// Very lightweight client-side search using Spotify web search page parsing is
// not reliable and not recommended. Prefer using a backend for real search.
// This function is a placeholder to keep API surface consistent.
export async function searchSpotifyTracksClientSide(_query: string): Promise<SpotifyTrackItem[]> {
  console.warn('[Spotify] Client-side search is not supported. Use backend proxy with Client Credentials.');
  return [];
}
