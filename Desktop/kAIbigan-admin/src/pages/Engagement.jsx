import PageHeader from "../components/PageHeader";
import KpiCard from "../components/KpiCard";
import Card from "../components/Card";
import RetentionGrid from "../components/charts/RetentionGrid";
import BarList from "../components/charts/BarList";
import Heatmap from "../components/charts/Heatmap";
import { engagement } from "../mockData";

function Engagement() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <PageHeader title="Engagement & Usage" subtitle="Acquisition, activation, and the hours students actually show up." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 24 }}>
        <KpiCard label="Onboarded (cumulative)" value={engagement.kpis.onboarded.value.toLocaleString()} delta={engagement.kpis.onboarded.delta} trend={engagement.kpis.onboarded.trend} sparkline={engagement.kpis.onboarded.sparkline} />
        <KpiCard label="Weekly actives" value={engagement.kpis.weeklyActives.value.toLocaleString()} delta={engagement.kpis.weeklyActives.delta} trend={engagement.kpis.weeklyActives.trend} sparkline={engagement.kpis.weeklyActives.sparkline} />
        <KpiCard label="Avg sessions / user / week" value={engagement.kpis.avgSessionsPerUser.value} delta={engagement.kpis.avgSessionsPerUser.delta} trend={engagement.kpis.avgSessionsPerUser.trend} sparkline={engagement.kpis.avgSessionsPerUser.sparkline} />
      </div>
      <Card title="Cohort retention grid">
        <RetentionGrid data={engagement.retention} />
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card title="Feature adoption funnel">
          <BarList data={engagement.funnel} dataKey="value" labelKey="stage" />
        </Card>
        <Card title="Time of day heatmap">
          <Heatmap data={engagement.timeOfDay} cols={24} />
        </Card>
      </div>
    </div>
  );
}

export default Engagement;
