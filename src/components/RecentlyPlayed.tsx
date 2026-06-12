import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Track {
  name: string;
  played_at: string;
  albumImage: string;
}

interface Props {
  tracks: Track[];
}

function groupByDay(tracks: Track[]): { date: string; plays: number }[] {
  const groupMap = new Map();
  for (var i = 0; i < tracks.length; i++) {
    const temp = tracks[i].played_at.substring(
      0,
      tracks[i].played_at.indexOf("T"),
    );
    if (!groupMap.has(temp)) {
      groupMap.set(temp, { val: 1 });
    } else {
      groupMap.get(temp).val++;
    }
  }
  return Array.from(groupMap.entries())
    .map(([key, value]) => ({
      date: key,
      plays: value.val,
    }))
    .reverse();
}

function getRelativeTime(played_at: string) {
  const now = new Date();
  const playedAt = new Date(played_at);
  const diff = Math.round((now.getTime() - playedAt.getTime()) / 1000);
  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(diff / 60 / 60);
  const days = Math.floor(diff / 60 / 60 / 24);

  if (minutes < 60) return minutes + " minutes ago";
  else if (hours < 24) return hours + " hours ago";
  else return days + " days ago";
}

export default function RecentlyPlayed({ tracks }: Props) {
  const [dateRange, setDateRange] = useState(7);

  if (tracks.length === 0) return null;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - dateRange);
  const filtered = tracks.filter((track) => new Date(track.played_at) > cutoff);
  const group = groupByDay(filtered);

  const btnClass =
    "relative inline-flex items-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-lime-300 to-[#363636] hover:from-lime-400 hover:to-[#444]";
  const spanClass =
    "relative px-4 py-2 bg-black rounded-lg text-white group-hover:bg-transparent transition-all duration-75";

  return (
    <div className="flex gap-4">
      <div className="w-1/4">
        {" "}
        <div className="w-full p-6 bg-white/5 border border-white/20 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-semibold text-white">
              Recently Played
            </h5>
          </div>
          <div className="flow-root">
            <ul className="flex flex-col divide-y divide-white/10">
              {tracks.map((track, i) => (
                <li key={i} className="py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={track.albumImage}
                      alt={track.name}
                      className="w-10 h-10 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">
                        {track.name}
                      </p>
                      <p className="text-sm text-white/60">
                        {getRelativeTime(track.played_at)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="w-3/4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                onClick={() => setDateRange(days)}
                className={btnClass}
              >
                <span className={spanClass}>
                  {days === 7
                    ? "Last 7 Days"
                    : days === 30
                      ? "Last 30 Days"
                      : "Last 3 Months"}
                </span>
              </button>
            ))}
          </div>
          <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={group}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis
                  dataKey="date"
                  stroke="#ffffff"
                  tick={{ fill: "#ffffff", fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#ffffff" tick={{ fill: "#ffffff" }} />
                <Tooltip />
                <Legend />
                <Line stroke="#82ca9d" dataKey="plays" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
