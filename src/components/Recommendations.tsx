import { motion } from "motion/react";

interface Recommendation {
  artistRec: string[];
  trackRec: string[];
  trackRecIds: string[];
}

interface Props {
  recommendations: Recommendation;
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

export default function Recommendations({ recommendations }: Props) {
  const { artistRec, trackRec, trackRecIds } = recommendations;
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Artists you should check out!
        </h2>
        <motion.ul
          className="flex flex-col gap-2"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {artistRec.map((artist) => (
            <motion.li
              key={artist}
              variants={item}
              className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-white/10"
            >
              {artist}
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">
          Tracks you should check out!
        </h2>
        <motion.ul
          className="flex flex-col gap-2"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {trackRec.map((track, i) => (
            <motion.li
              key={track}
              variants={item}
              className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-white/10"
            >
              {trackRecIds[i] ? (
                <a
                  href={`https://open.spotify.com/track/${trackRecIds[i]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-lime-400 transition-colors"
                >
                  {track}
                </a>
              ) : (
                track
              )}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}
