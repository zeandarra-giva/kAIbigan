import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";
import PageHeader from "../components/PageHeader";
import KpiCard from "../components/KpiCard";
import Card from "../components/Card";
import { theme } from "../theme";
import { wellbeing } from "../mockData";

function Wellbeing() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <PageHeader title="Wellbeing Trends" subtitle="Measurable shifts in student wellbeing, split by cohort and mood pattern." />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 360px)", gap: 24 }}>
        <KpiCard label="Average Wellbeing Score" value={wellbeing.averageScore.value} delta={`+${wellbeing.averageScore.delta} vs. last month`} trend={wellbeing.averageScore.trend} sparkline={wellbeing.averageScore.sparkline} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
        <Card title="Wellbeing over time">
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={wellbeing.scoreTrend}>
                <CartesianGrid stroke={theme.divider} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: theme.textSoft }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: theme.textSoft }} tickLine={false} axisLine={false} />
                <Tooltip />
                {["Overall", "SHS", "Undergrad", "Grad"].map((series, index) => (
                  <Line key={series} type="monotone" dataKey={series} stroke={theme.chart[index]} strokeWidth={3} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Patterns worth watching">
          <div style={{ display: "grid", gap: 14 }}>
            {wellbeing.insights.map((insight) => (
              <div key={insight} style={{ background: theme.surfaceAlt, borderRadius: 14, padding: 16, border: `1px solid ${theme.divider}` }}>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: theme.text }}>{insight}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card title="Mood distribution">
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={wellbeing.moodDistribution}>
                <CartesianGrid stroke={theme.divider} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: theme.textSoft }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: theme.textSoft }} tickLine={false} axisLine={false} />
                <Tooltip />
                {Object.entries(theme.mood).map(([series, color]) => (
                  <Area key={series} type="monotone" dataKey={series} stackId="mood" stroke={color} fill={color} fillOpacity={0.75} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="PHQ-9 cohort comparison">
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={wellbeing.phqByCollege} layout="vertical" stackOffset="sign">
                <CartesianGrid stroke={theme.divider} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: theme.textSoft }} tickLine={false} axisLine={false} />
                <YAxis dataKey="college" type="category" tick={{ fontSize: 11, fill: theme.textSoft }} tickLine={false} axisLine={false} width={90} />
                <Tooltip />
                <Bar dataKey="negative" fill={theme.accent} radius={[8, 0, 0, 8]} />
                <Bar dataKey="positive" fill={theme.primary} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Wellbeing;
