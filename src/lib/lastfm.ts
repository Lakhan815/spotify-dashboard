const LASTFM_BASE_URL = "https://ws.audioscrobbler.com/2.0/";

async function lastfmFetch(params: Record<string, string>) {
  const queryString = new URLSearchParams({
    ...params,
    api_key: process.env.LASTFM_API_KEY!,
    format: "json",
  }).toString();

  const response = await fetch(LASTFM_BASE_URL + "?" + queryString);
  const data = await response.json();
  return data;
}

export async function getTrackTags(artist: string, track: string) {
  let record = {
    //method call is to let lastfm know what we want to do, we need to add it
    method: "track.getInfo",
    track: track,
    artist: artist,
  };
  return lastfmFetch(record);
}

export async function getSimilarArtists(artist: string) {
  const data = await lastfmFetch({
    method: "artist.getsimilar",
    artist: artist,
    limit: "5",
  });

  return data.similarartists?.artist ?? [];
}

export async function getSimilarTracks(artist: string, track: string) {
  const data = await lastfmFetch({
    method: "track.getsimilar",
    artist: artist,
    track: track,
    limit: "5",
  });

  return data.similartracks?.track ?? [];
}
