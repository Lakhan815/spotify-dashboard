import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getTopTracks } from "@/lib/spotify";
import { getTrackTags } from "@/lib/lastfm";
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
  //gets the array of tracks, slices it into the tracks 1-20 and then gets only the name and artist name and sends it to
  //getTrackTags
  const results = await Promise.all(
    tracks.items
      .slice(0, 20)
      .map((track: any) => getTrackTags(track.artists[0].name, track.name)),
  );
  const groupMap = new Map();
  for (var i = 0; i < 20; i++) {
    for (var j = 0; j < results[i].track.toptags.tag.length; j++) {
      const temp = results[i].track.toptags.tag[j].name;
      if (!groupMap.has(temp)) {
        groupMap.set(temp, { val: 1 });
      } else {
        groupMap.get(temp).val++;
      }
    }
  }
  const tagArray = Array.from(groupMap.entries())
    .map(([key, value]) => ({
      tag: key,
      plays: value.val,
    }))
    .sort((a, b) => b.plays - a.plays);
  return NextResponse.json(tagArray);
}
