import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  searchTrack,
  getCurrentUser,
  createPlaylist,
  addTracksToPlaylist,
  addTracksToPlaylistWithRetry,
} from "@/lib/spotify";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (session == null) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log("TEMP TOKEN:", session.accessToken);
  const { trackRecIds } = await request.json();
  const validTrackIds = trackRecIds.filter((id: string) => id !== "");
  const trackUris = validTrackIds.map((id: string) => "spotify:track:" + id);
  const getUser = await getCurrentUser(session.accessToken!);
  console.log("getUser response:", getUser);
  const spotifyPost = await createPlaylist(getUser.id, session.accessToken!, {
    name: "My Recommendations",
  });
  console.log("createPlaylist response:", spotifyPost);
  console.log("trackUris:", trackUris);
  const playlistPost = await addTracksToPlaylistWithRetry(
    spotifyPost.id,
    session.accessToken!,
    { uris: trackUris },
  );
  console.log("addTracksToPlaylist response:", playlistPost);
  return NextResponse.json({
    playlistUrl: spotifyPost.external_urls?.spotify,
    playlistName: spotifyPost.name,
  });
}
