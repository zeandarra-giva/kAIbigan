import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { theme } from "../../theme";

function BarList({ data, dataKey = "value", labelKey = "label", horizontal = false, colors = theme.chart }) {
  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout={horizontal ? "vertical" : "horizontal"} margin={{ left: horizontal ? 24 : 0 }}>
          <CartesianGrid stroke={theme.divider} vertical={!horizontal} horizontal={horizontal} />
          <XAxis type={horizontal ? "number" : "category"} dataKey={horizontal ? undefined : labelKey} tick={{ fontSize: 11, fill: theme.textSoft }} tickLine={false} axisLine={false} />
          <YAxis type={horizontal ? "category" : "number"} dataKey={horizontal ? labelKey : undefined} tick={{ fontSize: 11, fill: theme.textSoft }} tickLine={false} axisLine={false} width={horizontal ? 110 : 30} />
          <Tooltip />
          <Bar dataKey={dataKey} radius={horizontal ? [0, 10, 10, 0] : [10, 10, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={entry[labelKey] || index} fill={entry.color || colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarList;
