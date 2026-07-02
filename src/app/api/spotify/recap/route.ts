import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTopTracks, getTopArtists } from "@/lib/spotify";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "short_term";

  const session = await getServerSession(authOptions);

  if (session == null) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You will receive two arrays of listening data: Top Tracks (each item has: title, rank, artists — rank 1 is the most played): ${JSON.stringify(trimmedTracks)} Top Artists (each item has: name, rank — rank 1 is the most played): ${JSON.stringify(trimmedArtists)} Write a 1-2 sentence summary of EACH list in a witty, affectionate, playful tone — like a friend teasing you about your music taste, not roasting you. Return ONLY valid JSON, no markdown formatting, no preamble, no code fences. Use exactly this shape: {"tracksCaption": "...", "artistsCaption": "..."}`,
        },
      ],
    }),
  });

  const data = await response.json();

  const rawText = data.content[0].text;
  const parsedData = JSON.parse(rawText);

  try {
    const cleanText = rawText.replace(/'''json|''''/g, "").trim();
    const parsedData = JSON.parse(cleanText);
    return NextResponse.json(parsedData);
  } catch (err) {
    console.error("Failed to parse Claude Response:", err);
    return NextResponse.json(
      { error: "Failed to generate recap" },
      { status: 500 },
    );
  }
}
