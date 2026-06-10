import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface PopularityData {
  name: string;
  popularity: number;
}

interface Props {
  popularityData: PopularityData[];
}

export default function PopularityChart({ popularityData }: Props) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        style={{
          width: "100%",
          maxWidth: "700px",
          maxHeight: "70vh",
          aspectRatio: 1.618,
        }}
        data={popularityData}
        margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
      >
        <XAxis dataKey="name" />
        <Tooltip />
        <Legend />
        <Bar fill="#82ca9d" radius={[10, 10, 0, 0]} dataKey="popularity" />
      </BarChart>
    </ResponsiveContainer>
  );
}
