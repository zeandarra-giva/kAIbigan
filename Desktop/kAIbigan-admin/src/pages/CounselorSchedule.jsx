import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import { counselorWorkspace } from "../mockData";

function CounselorSchedule() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <PageHeader title="Schedule" subtitle="Today's sessions and upcoming slots in one timeline." />
      <Card title="Upcoming sessions">
        <div style={{ display: "grid", gap: 10 }}>
          {counselorWorkspace.schedule.map((session) => (
            <div key={`${session.alias}-${session.time}`} style={{ border: "1px solid rgba(0,0,0,0.07)", borderRadius: 14, padding: 14, background: "#fff", display: "flex", justifyContent: "space-between" }}>
              <div>
                <strong>{session.alias}</strong>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(26,26,46,0.7)" }}>{session.type}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <strong>{session.time}</strong>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(26,26,46,0.7)" }}>{session.status}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default CounselorSchedule;
