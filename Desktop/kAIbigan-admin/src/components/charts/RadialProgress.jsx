import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { theme } from "../../theme";

function RadialProgress({ value, color, label }) {
  return (
    <div style={{ width: 220, height: 220, position: "relative" }}>
      <ResponsiveContainer>
        <RadialBarChart innerRadius="68%" outerRadius="100%" data={[{ value: value * 100 }]} startAngle={90} endAngle={-270}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar dataKey="value" cornerRadius={12} fill={color} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <strong style={{ fontSize: 32, color: theme.text }}>{Math.round(value * 100)}%</strong>
        <span style={{ fontSize: 12, color: theme.textMute, textAlign: "center", maxWidth: 110 }}>{label}</span>
      </div>
    </div>
  );
}

export default RadialProgress;
