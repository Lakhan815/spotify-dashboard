import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getTopTracks } from "@/lib/spotify";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session == null) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const tracks = await getTopTracks(session.accessToken!);
  return NextResponse.json(tracks);
}
