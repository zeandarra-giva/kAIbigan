import { Activity, AlertTriangle, HeartPulse, Users } from "lucide-react";
import PageHeader from "../components/PageHeader";
import KpiCard from "../components/KpiCard";
import Card from "../components/Card";
import AreaTrendChart from "../components/charts/AreaChart";
import BarList from "../components/charts/BarList";
import Donut from "../components/charts/Donut";
import Heatmap from "../components/charts/Heatmap";
import { overview } from "../mockData";
import { theme } from "../theme";

const iconMap = {
  activeStudents: Users,
  sessionsThisWeek: Activity,
  wellbeingScore: HeartPulse,
  redFlagEvents90d: AlertTriangle,
};

const labelMap = {
  activeStudents: "Active students",
  sessionsThisWeek: "Sessions this week",
  wellbeingScore: "Wellbeing score (0–10)",
  redFlagEvents90d: "Red Flag events (90d)",
};

function Overview({ dateRange }) {
  const currentKpis = overview.kpisByRange[dateRange];

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <PageHeader title="Overview" subtitle="The investor money shot: engagement, risk, and ROI in one screen." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 24 }}>
        {Object.entries(currentKpis).map(([key, value]) => {
          const Icon = iconMap[key];
          return (
            <KpiCard
              key={key}
              label={labelMap[key]}
              value={typeof value.value === "number" && key !== "wellbeingScore" ? value.value.toLocaleString() : value.value}
              delta={key === "wellbeingScore" ? `+${value.delta} vs. last month` : value.delta}
              trend={value.trend}
              icon={Icon}
              tone={key === "redFlagEvents90d" ? "danger" : "success"}
              sparkline={value.sparkline}
            />
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24 }}>
        <Card title="Daily Active Students">
          <AreaTrendChart data={overview.dailyActive} />
        </Card>
        <Card title="Top Stressors (aggregated)">
          <BarList data={overview.topStressors} horizontal />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card title="Intake Triage Distribution">
          <Donut data={overview.triageDistribution} centerLabel={overview.totalIntakes.toLocaleString()} />
        </Card>
        <Card title="AI Chat Topics (this month)">
          <BarList data={overview.chatTopics} dataKey="count" labelKey="topic" horizontal />
        </Card>
      </div>

      <Card title="Counselor activation" action={<a href="/providers" style={{ color: theme.text, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>See counselor utilization →</a>}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
          {overview.counselorActivation.map((item) => (
            <div key={item.label} style={{ padding: 14, borderRadius: 14, background: theme.surfaceAlt }}>
              <p style={{ margin: 0, fontSize: 11, color: theme.textMute, textTransform: "uppercase", letterSpacing: 1 }}>{item.label}</p>
              <p style={{ margin: "8px 0 0", fontSize: 20, fontWeight: 700 }}>{item.value}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card
        action={<a href="/crisis" style={{ color: theme.danger, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>See full log</a>}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 14, background: "rgba(255,82,82,0.12)", color: theme.danger, display: "grid", placeItems: "center" }}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <strong style={{ display: "block", fontSize: 18 }}>23 Red Flag events handled this quarter.</strong>
              <span style={{ fontSize: 13, color: theme.textMute }}>Every record remains aggregated and opaque.</span>
            </div>
          </div>
        </div>
        <Heatmap data={overview.redFlagHeatmap} tone="danger" compact />
      </Card>
    </div>
  );
}

export default Overview;
