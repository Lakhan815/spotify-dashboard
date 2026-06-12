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
    "https://api.spotify.com/v1/me/player/recently-played?limit=50",
    accessToken,
  );
}

export async function getAudioFeatures(accessToken: string, ids: string[]) {
  return spotifyFetch(
    "https://api.spotify.com/v1/audio-features?ids=" + ids.join(","),
    accessToken,
  );
}

//full map of how it works
// Spotify sends the login token -> jwt stores it -> session callback exposes it -> getServerSession() reads it -> top-tracks passes it -> getTopTracks recieves it -> Spotify fetch uses it
