import { Line, LineChart, ResponsiveContainer } from "recharts";

function Sparkline({ data, color }) {
  return (
    <div style={{ width: 84, height: 44 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Sparkline;
