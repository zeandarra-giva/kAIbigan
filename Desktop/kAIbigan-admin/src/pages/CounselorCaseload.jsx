import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import { counselorWorkspace } from "../mockData";

function CounselorCaseload() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <PageHeader title="My Caseload" subtitle="Anonymous students, intake summaries, and who needs contact today." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}>
        {[
          { label: "Active caseload", value: counselorWorkspace.kpis.caseload },
          { label: "Unread messages", value: counselorWorkspace.kpis.unread },
          { label: "Sessions today", value: counselorWorkspace.kpis.sessionsToday },
          { label: "High-priority", value: counselorWorkspace.kpis.highPriority },
        ].map((item) => (
          <Card key={item.label} padding={18}>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(26,26,46,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>{item.label}</p>
            <p style={{ margin: "8px 0 0", fontSize: 24, fontWeight: 700 }}>{item.value}</p>
          </Card>
        ))}
      </div>
      <Card title="Students needing outreach">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Alias", "Intake lane", "Last activity", "Risk", "Next step"].map((head) => (
                <th key={head} style={{ textAlign: "left", paddingBottom: 12, fontSize: 12 }}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {counselorWorkspace.caseload.map((row) => (
              <tr key={row.alias}>
                <td style={{ padding: "12px 0", borderTop: "1px solid rgba(0,0,0,0.05)", fontWeight: 700 }}>{row.alias}</td>
                <td style={{ padding: "12px 0", borderTop: "1px solid rgba(0,0,0,0.05)" }}>{row.lane}</td>
                <td style={{ padding: "12px 0", borderTop: "1px solid rgba(0,0,0,0.05)" }}>{row.lastActivity}</td>
                <td style={{ padding: "12px 0", borderTop: "1px solid rgba(0,0,0,0.05)" }}>{row.risk}</td>
                <td style={{ padding: "12px 0", borderTop: "1px solid rgba(0,0,0,0.05)" }}>{row.nextStep}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default CounselorCaseload;
