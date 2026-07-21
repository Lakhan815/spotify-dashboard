import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTopTracks, getTopArtists, searchTrack } from "@/lib/spotify";
import prisma from "@/lib/prisma";
import { getSimilarArtists, getSimilarTracks } from "@/lib/lastfm";

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "short_term";

  const session = await getServerSession(authOptions);

  if (session == null) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const existingRec = await prisma.recommendation.findFirst({
    where: { user: { email: session.user!.email! } },
    orderBy: { datePosted: "desc" },
  });
  const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
  const isFresh =
    existingRec !== null &&
    new Date().getTime() - existingRec.datePosted.getTime() < threeDaysInMs;

  if (existingRec && isFresh) {
    return NextResponse.json({
      artistRec: existingRec.artistRec,
      trackRec: existingRec.trackRec,
      trackRecIds: existingRec.trackRecIds,
    });
  } else {
    const tracksData = await getTopTracks(session.accessToken!, range);
    const artistsData = await getTopArtists(session.accessToken!, range);

    const trimmedTracks = (tracksData.items || []).map(
      (item: any, index: number) => ({
        name: item.name,
        rank: index + 1,
        artists: item.artists.map((artist: any) => artist.name),
      }),
    );

    const trimmedArtists = (artistsData.items || []).map(
      (item: any, index: number) => ({
        name: item.name,
        rank: index + 1,
      }),
    );

    const artistRes = await Promise.allSettled(
      trimmedArtists
        .slice(0, 20)
        .map((artist: any) => getSimilarArtists(artist.name)),
    );

    const trackRes = await Promise.allSettled(
      trimmedTracks
        .slice(0, 20)
        .map((track: any) => getSimilarTracks(track.artists[0], track.name)),
    );

    const similarArtists = artistRes
      .filter((r) => r.status === "fulfilled")
      .flatMap((r) => r.value);

    const similarTracks = trackRes
      .filter((r) => r.status === "fulfilled")
      .flatMap((r) => r.value);

    const knownArtistNames = new Set(
      trimmedArtists.map((artist: any) => normalizeName(artist.name)),
    );

    const artistMap = new Map();
    for (var i = 0; i < similarArtists.length; i++) {
      const key = normalizeName(similarArtists[i].name);

      if (knownArtistNames.has(key)) {
        continue;
      }

      if (!artistMap.has(key)) {
        artistMap.set(key, { val: 1, name: similarArtists[i].name });
      } else {
        artistMap.get(key).val++;
      }
    }

    const knownTrackKeys = new Set(
      trimmedTracks.map(
        (track: any) =>
          normalizeName(track.artists[0]) + "|" + normalizeName(track.name),
      ),
    );

    const trackMap = new Map();
    for (var i = 0; i < similarTracks.length; i++) {
      const key =
        normalizeName(similarTracks[i].artist.name) +
        "|" +
        normalizeName(similarTracks[i].name);

      if (knownTrackKeys.has(key)) {
        continue;
      }

      if (!trackMap.has(key)) {
        trackMap.set(key, {
          val: 1,
          trackName: similarTracks[i].name,
          artistName: similarTracks[i].artist.name,
        });
      } else {
        trackMap.get(key).val++;
      }
    }

    const artistArray = Array.from(artistMap, ([key, value]) => ({
      key,
      value,
    }));
    artistArray.sort((a, b) => b.value.val - a.value.val);
    const artistRec = artistArray.map((item) => item.value.name);

    const trackArray = Array.from(trackMap, ([key, value]) => ({
      key,
      value,
    }));
    trackArray.sort((a, b) => b.value.val - a.value.val);

    const trackRec = trackArray.map(
      (item) => `${item.value.trackName} — ${item.value.artistName}`,
    );

    // Look up a Spotify track ID for each recommended track so the frontend
    // can link out to "Play on Spotify" — done once here, at cache-build time,
    // rather than on every render.
    const searchRes = await Promise.allSettled(
      trackArray.map((item: any) =>
        searchTrack(
          session.accessToken!,
          item.value.artistName,
          item.value.trackName,
        ),
      ),
    );

    const trackRecIds = trackArray.map((item, i) => {
      const result = searchRes[i];
      if (result.status === "fulfilled") {
        return result.value.tracks?.items?.[0]?.id ?? "";
      }
      return null;
    });

    const user = await prisma.user.findUnique({
      where: { email: session.user!.email! },
    });

    const newRecommendation = await prisma.recommendation.create({
      data: {
        id: crypto.randomUUID(),
        userId: user!.id,
        artistRec,
        trackRec,
        trackRecIds,
      },
    });

    return NextResponse.json({
      artistRec: newRecommendation.artistRec,
      trackRec: newRecommendation.trackRec,
      trackRecIds: newRecommendation.trackRecIds,
    });
  }
}
