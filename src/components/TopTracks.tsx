interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
}

interface Artist {
  name: string;
}

interface Album {
  name: string;
  images: { url: string }[];
}

interface Props {
  tracks: Track[];
}

export default function TopTracks({ tracks }: Props) {
  const topTracks = tracks.map((track) => (
    <li key={track.id} className="flex flex-col p-2 rounded-lg">
      <img src={track.album.images[0].url} alt={track.album.name} />
      <p>{track.name}</p>
      <p>{track.artists.map((a) => a.name).join(", ")}</p>
    </li>
  ));
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 rounded-lg border-white-30/80 w-full md:w-1/2">
      {topTracks}
    </ul>
  );
}
