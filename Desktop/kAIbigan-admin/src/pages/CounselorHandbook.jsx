import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import { counselorWorkspace } from "../mockData";

function CounselorHandbook() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <PageHeader title="Counselor Handbook" subtitle="Escalation reminders and response standards for partner schools." />
      <Card title="Escalation path">
        <ol style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
          {counselorWorkspace.handbook.map((step) => (
            <li key={step} style={{ fontSize: 14, lineHeight: 1.6 }}>{step}</li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

export default CounselorHandbook;
