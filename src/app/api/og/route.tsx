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
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #a3e635 0%, #000000 60%)",
        color: "white",
        padding: "40px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          fontSize: 48,
          fontWeight: "bold",
          marginBottom: 30,
        }}
      >
        Your Weekly Recap
      </div>
      <div style={{ display: "flex", flexDirection: "row", flex: 1 }}>
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
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
