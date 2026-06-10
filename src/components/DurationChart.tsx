import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DurationData {
  name: string;
  duration: number;
}

interface Props {
  durationData: DurationData[];
}

export default function DurationChart({ durationData }: Props) {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={durationData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="name"
            stroke="#ffffff"
            tick={{ fill: "#ffffff", fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#ffffff" tick={{ fill: "#ffffff" }} />
          <Tooltip />
          <Legend />
          <Bar fill="#82ca9d" radius={[10, 10, 0, 0]} dataKey="duration" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
