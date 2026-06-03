interface Artist {
  id: string;
  name: string;
  genres: string[];
  images: { url: string }[];
}

interface Props {
  artists: Artist[];
}

export default function TopArtists({ artists }: Props) {
  const TopArtists = artists.map((artist) => (
    <li
      key={artist.id}
      className="flex flex-col p-2 rounded-lg border border-white/50"
    >
      <img src={artist.images[0].url} alt={artist.name} />
      <p>{artist.name}</p>
      <p>{artist.genres.join(", ")}</p>
    </li>
  ));
  return (
    <div className="flex justify-center px-8 pt-8 ">
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 rounded-lg">
        {TopArtists}
      </ul>
    </div>
  );
}
