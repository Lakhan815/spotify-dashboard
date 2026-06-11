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

function groupByDay({ tracks }: Props) {
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
  return Array.from(groupMap.entries()).map(([key, value]) => {
    date: key;
    plays: value.val;
  });
}

export default function RecentlyPlayed({ tracks }: Props) {
  const group = groupByDay({ tracks });
  return (
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
  );
}
