import { ImageResponse } from "@vercel/og";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTopTracks, getTopArtists } from "@/lib/spotify";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const tracksData = await getTopTracks(session.accessToken!, "short_term");
  const artistsData = await getTopArtists(session.accessToken!, "short_term");

  const topTracks = tracksData.items.slice(0, 5);
  const topArtists = artistsData.items.slice(0, 5);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        color: "white",
        padding: "40px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {topTracks.map((track: any, index: number) => (
          <div
            key={index}
            style={{ display: "flex", fontSize: 24, marginBottom: 10 }}
          >
            {index + 1}. {track.name}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {topArtists.map((artist: any, index: number) => (
          <div
            key={index}
            style={{ display: "flex", fontSize: 24, marginBottom: 10 }}
          >
            {index + 1}. {artist.name}
          </div>
        ))}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
