//private helper to reduce redundancy in the functions.
//takes a spotify URL and an access token and makes the request with the proper header and returns a JSON
//The "Bearer" is what spotify needs to know its legit
async function spotifyFetch(url: string, accessToken: string) {
  const response = await fetch(url, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
  const data = await response.json();
  return data;
}
//you get the access token from getTopTracks
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

//full map of how it works
// Spotify sends the login token -> jwt stores it -> session callback exposes it -> getServerSession() reads it -> top-tracks passes it -> getTopTracks recieves it -> Spotify fetch uses it
