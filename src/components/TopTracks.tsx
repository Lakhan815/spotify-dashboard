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
    <li key={track.id}>
      {track.name}
      {track.artists[0].name}
      <img src={track.album.images[0].url} alt={track.album.name} />
    </li>
  ));
  return <ul>{topTracks}</ul>;
}
