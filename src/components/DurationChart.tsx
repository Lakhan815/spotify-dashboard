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
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        style={{
          width: "100%",
          maxWidth: "700px",
          maxHeight: "70vh",
          aspectRatio: 1.618,
        }}
        data={durationData}
        margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
      >
        <XAxis
          dataKey="name"
          stroke="#ffffff"
          tick={{ fill: "#ffffff", fontSize: 10 }}
        />
        <YAxis stroke="#ffffff" tick={{ fill: "#ffffff" }} />
        <Tooltip />
        <Legend />
        <Bar fill="#82ca9d" radius={[10, 10, 0, 0]} dataKey="duration" />
      </BarChart>
    </ResponsiveContainer>
  );
}
