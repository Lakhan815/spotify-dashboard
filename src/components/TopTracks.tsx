import { motion } from "motion/react";
//sets up the interfaces:
//this interface reflects the format the data is outputted from the spotify API
interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  popularity: number;
}

interface Artist {
  name: string;
}

interface Album {
  name: string;
  images: { url: string }[];
}
//this is where the data from page.tsx goes
interface Props {
  tracks: Track[];
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

//actually displaying the tracks
export default function TopTracks({ tracks }: Props) {
  const topTracks = tracks.map((track) => (
    <motion.li
      key={track.id}
      className="flex flex-col p-2 rounded-lg border border-white/50"
    >
      <img src={track.album.images?.[0]?.url} alt={track.album.name} />{" "}
      <p>{track.name}</p>
      <p>{track.artists.map((a) => a.name).join(", ")}</p>
    </motion.li>
  ));
  return (
    <div className="flex justify-center px-8 pt-8 ">
      <motion.ul
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 rounded-lg"
        initial="hidden"
        animate="show"
      >
        {topTracks}
      </motion.ul>
    </div>
  );
}
