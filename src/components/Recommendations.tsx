interface Recommendation {
  artistRec: string[];
  trackRec: string[];
  trackRecIds: string[];
}

interface Props {
  recommendations: Recommendation;
}

export default function Recommendations({ recommendations }: Props) {
  const { artistRec, trackRec, trackRecIds } = recommendations;
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Artists you should check out!
        </h2>
        <ul className="flex flex-col gap-2">
          {artistRec.map((artist) => (
            <li
              key={artist}
              className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-white/10"
            >
              {artist}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">
          Tracks you should check out!
        </h2>
        <ul className="flex flex-col gap-2">
          {trackRec.map((track, i) => (
            <li
              key={track}
              className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-white/10"
            >
              {trackRecIds[i] ? (
                <a
                  href={`https://open.spotify.com/track/${trackRecIds[i]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {track}
                </a>
              ) : (
                track
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
