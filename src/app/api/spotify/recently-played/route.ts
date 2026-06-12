import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getRecentlyPlayed } from "@/lib/spotify";
import { authOptions } from "@/lib/auth";
//whenever I fetch smth, this is where it goes
export async function GET() {
  //looks up the users session to see if ur logged in. authOptions says where to look
  const session = await getServerSession(authOptions);
  //if ur not logged in it throws an error
  if (session == null) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  //if they are logged in, take there access token and call it from Spotify
  const tracks = await getRecentlyPlayed(session.accessToken!);
  return NextResponse.json(tracks);
}
