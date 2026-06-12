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

export default function RecentlyPlayed({ tracks }: Props) {
  const [dateRange, setDateRange] = useState(7);

  if (tracks.length === 0) return null;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - dateRange);
  const filtered = tracks.filter((track) => new Date(track.played_at) > cutoff);
  const group = groupByDay(filtered);

  const btnClass = "px-4 py-2 rounded-full border text-sm font-medium";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {[7, 30, 90].map((days) => (
          <button
            key={days}
            onClick={() => setDateRange(days)}
            className={`${btnClass} ${dateRange === days ? "bg-white text-black" : "border-white/20 text-white"}`}
          >
            {days === 7
              ? "Last 7 Days"
              : days === 30
                ? "Last 30 Days"
                : "Last 3 Months"}
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
  );
}
