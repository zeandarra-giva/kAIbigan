import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Funnel from "../components/charts/Funnel";
import RadialProgress from "../components/charts/RadialProgress";
import { triage } from "../mockData";
import { theme } from "../theme";

function Triage() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <PageHeader title="Triage Funnel" subtitle="How the care model routes students from AI to human support." />
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr", gap: 24 }}>
        <Card title="Triage flow">
          <Funnel stages={triage.stages} />
        </Card>
        <Card title="Key metrics">
          <div style={{ display: "grid", gap: 16 }}>
            {Object.values(triage.kpis).map((item) => (
              <div key={item.label} style={{ background: theme.surfaceAlt, borderRadius: 14, padding: 18 }}>
                <p style={{ margin: 0, fontSize: 12, color: theme.textMute }}>{item.label}</p>
                <p style={{ margin: "8px 0 0", fontSize: 28, fontWeight: 700 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card title="Completion rates per level">
        <div style={{ display: "flex", gap: 24, justifyContent: "space-between" }}>
          {triage.completion.map((item) => (
            <RadialProgress key={item.label} value={item.value} color={item.color} label={item.label} />
          ))}
        </div>
      </Card>
      <Card title={triage.explanation.title}>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: theme.text }}>{triage.explanation.body}</p>
      </Card>
    </div>
  );
}

export default Triage;
