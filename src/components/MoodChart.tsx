import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

type Tag = {
  tag: string;
  plays: number;
};

type Props = {
  tags: Tag[];
};

export default function MoodChart({ tags }: Props) {
  return (
    <div style={{ width: 300, height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "500px",
            maxHeight: "80vh",
            aspectRatio: 1,
          }}
          responsive
          outerRadius="80%"
          data={tags}
          margin={{
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
          }}
        >
          <PolarGrid />
          <PolarAngleAxis dataKey="tag" />
          <PolarRadiusAxis />
          <Radar
            dataKey="plays"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
