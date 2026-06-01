import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getTopTracks } from "@/lib/spotify";

export async function GET() {
  const session = await getServerSession();
  if (session == null) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const tracks = await getTopTracks(session.accessToken!);
  return NextResponse.json(tracks);
}
