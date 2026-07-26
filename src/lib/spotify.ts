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

async function spotifyPostFetch(url: string, accessToken: string, body: any) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: "Bearer" + accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
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

export async function searchTrack(
  accessToken: string,
  artist: string,
  track: string,
) {
  const params = new URLSearchParams({
    q: `track:${track} artist:${artist}`,
    type: "track",
    limit: "1",
  });

  return spotifyFetch(
    "https://api.spotify.com/v1/search?" + params.toString(),
    accessToken,
  );
}

export async function getCurrentUser(accessToken: string) {
  return spotifyFetch("https://api.spotify.com/v1/me", accessToken);
}

export async function createPlaylist(
  userId: string,
  accessToken: string,
  body: any,
) {
  return spotifyPostFetch(
    "https://api.spotify.com/v1/users/" + userId + "/playlists",
    accessToken,
    body,
  );
}

export async function addTracksToPlaylist(
  playlistId: string,
  accessToken: string,
  body: any,
) {
  return spotifyPostFetch(
    "https://api.spotify.com/v1/playlists/" + playlistId + "/items",
    accessToken,
    body,
  );
}

//full map of how it works
// Spotify sends the login token -> jwt stores it -> session callback exposes it -> getServerSession() reads it -> top-tracks passes it -> getTopTracks recieves it -> Spotify fetch uses it
