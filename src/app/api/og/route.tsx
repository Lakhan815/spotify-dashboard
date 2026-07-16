import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tracksParam = searchParams.get("tracks") || "";
  const artistsParam = searchParams.get("artists") || "";

  const topTracks = tracksParam.split(",");
  const topArtists = artistsParam.split(",");

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
        {topTracks.map((track: string, index: number) => (
          <div
            key={index}
            style={{ display: "flex", fontSize: 24, marginBottom: 10 }}
          >
            {index + 1}. {track}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {topArtists.map((artist: string, index: number) => (
          <div
            key={index}
            style={{ display: "flex", fontSize: 24, marginBottom: 10 }}
          >
            {index + 1}. {artist}
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
