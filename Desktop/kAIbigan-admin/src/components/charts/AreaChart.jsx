import { Area, AreaChart as ReAreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { theme } from "../../theme";

function AreaTrendChart({ data, dataKey = "value", color = theme.primary }) {
  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <ReAreaChart data={data}>
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.32} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={theme.divider} vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: theme.textSoft }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: theme.textSoft }} tickLine={false} axisLine={false} />
          <Tooltip />
          <Area type="monotone" dataKey={dataKey} stroke={color} fill="url(#areaFill)" strokeWidth={3} />
        </ReAreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AreaTrendChart;
