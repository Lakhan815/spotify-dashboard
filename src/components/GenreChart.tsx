import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface GenreData {
  name: string;
  count: number;
}

interface Props {
  genreData: GenreData[];
}

export default function GenreChart({ genreData }: Props) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        style={{
          width: "100%",
          maxWidth: "700px",
          maxHeight: "70vh",
          aspectRatio: 1.618,
        }}
        data={genreData}
        margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
      >
        <XAxis dataKey="name" />
        <Tooltip />
        <Legend />
        <Bar fill="#82ca9d" radius={[10, 10, 0, 0]} dataKey="count" />
      </BarChart>
    </ResponsiveContainer>
  );
}
