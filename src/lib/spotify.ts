async function spotifyFetch(url: string, accessToken: string) {
  const response = await fetch(url, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
  const data = await response.json();
  return data;
}

export async function getTopTracks(accessToken: string) {
  return spotifyFetch("https://api.spotify.com/v1/me/top/tracks", accessToken);
}

export async function getTopArtists(accessToken: string) {
  return spotifyFetch("https://api.spotify.com/v1/me/top/artists", accessToken);
}

export async function getRecentlyPlayed(accessToken: string) {
  return spotifyFetch(
    "https://api.spotify.com/v1/me/player/recently-played",
    accessToken,
  );
}
