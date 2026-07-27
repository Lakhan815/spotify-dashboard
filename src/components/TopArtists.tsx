import { motion } from "motion/react";

interface Artist {
  id: string;
  name: string;
  genres: string[];
  images: { url: string }[];
}

interface Props {
  artists: Artist[];
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

export default function TopArtists({ artists }: Props) {
  const TopArtists = artists.map((artist) => (
    <motion.li
      key={artist.id}
      variants={item}
      className="flex flex-col p-2 rounded-lg border border-white/50"
    >
      <img src={artist.images?.[0]?.url} alt={artist.name} />
      <p>{artist.name}</p>
      <p>{(artist.genres || []).join(", ")}</p>
    </motion.li>
  ));
  return (
    <div className="flex justify-center px-8 pt-8 ">
      <motion.ul
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 rounded-lg"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {TopArtists}
      </motion.ul>
    </div>
  );
}
