import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { theme } from "../../theme";

function Donut({ data, centerLabel }) {
  return (
    <div style={{ width: "100%", height: 280, position: "relative" }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="level" innerRadius={70} outerRadius={100} paddingAngle={2}>
            {data.map((entry) => (
              <Cell key={entry.level} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: theme.text }}>{centerLabel}</div>
          <div style={{ fontSize: 12, color: theme.textMute }}>Total intakes</div>
        </div>
      </div>
    </div>
  );
}

export default Donut;
