//private helper to reduce redundancy in the functions.
//takes a spotify URL and an access token and makes the request with the proper header and returns a JSON
//The "Bearer" is what spotify needs to know its legit
async function spotifyFetch(url: string, accessToken: string, range?: string) {
  const fullUrl = range ? url + "?time_range=" + range : url;
  const response = await fetch(fullUrl, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
  const data = await response.json();
  return data;
}
//you get the access token from getTopTracks
export async function getTopTracks(accessToken: string, range: string) {
  return spotifyFetch(
    "https://api.spotify.com/v1/me/top/tracks",
    accessToken,
    range,
  );
}

export async function getTopArtists(accessToken: string, range: string) {
  return spotifyFetch(
    "https://api.spotify.com/v1/me/top/artists",
    accessToken,
    range,
  );
}

export async function getRecentlyPlayed(accessToken: string) {
  return spotifyFetch(
    "https://api.spotify.com/v1/me/player/recently-played",
    accessToken,
  );
}

export async function getTopArtistsWithGenres(
  accessToken: string,
  range: string,
) {
  const topArtists = await spotifyFetch(
    "https://api.spotify.com/v1/me/top/artists",
    accessToken,
    range,
  );

  const ids = topArtists.items.map((a: any) => a.id).join(",");
  const full = await fetch(`https://api.spotify.com/v1/artists?ids=${ids}`, {
    headers: { authorization: "Bearer " + accessToken },
  });
  const fullData = await full.json();

  // Merge genres back into the original items
  const genreMap = new Map(fullData.artists.map((a: any) => [a.id, a.genres]));
  topArtists.items = topArtists.items.map((a: any) => ({
    ...a,
    genres: genreMap.get(a.id) ?? [],
  }));

  return topArtists;
}

//full map of how it works
// Spotify sends the login token -> jwt stores it -> session callback exposes it -> getServerSession() reads it -> top-tracks passes it -> getTopTracks recieves it -> Spotify fetch uses it
