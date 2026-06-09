import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getTopTracks } from "@/lib/spotify";
import { authOptions } from "@/lib/auth";
//whenever I fetch smth, this is where it goes
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "short_term";
  //looks up the users session to see if ur logged in. authOptions says where to look
  const session = await getServerSession(authOptions);
  //if ur not logged in it throws an error
  if (session == null) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  //if they are logged in, take there access token and call it from Spotify
  const tracks = await getTopTracks(session.accessToken!, range);
  return NextResponse.json(tracks);
}
