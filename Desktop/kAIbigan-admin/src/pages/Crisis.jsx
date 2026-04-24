import { useMemo, useState } from "react";
import { ShieldAlert } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import KpiCard from "../components/KpiCard";
import Chip from "../components/Chip";
import PrivacyBadge from "../components/PrivacyBadge";
import { crisis } from "../mockData";
import { theme } from "../theme";

function formatDateTime(value) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Crisis() {
  const [severity, setSeverity] = useState("All");
  const [trigger, setTrigger] = useState("All");
  const [status, setStatus] = useState("All");
  const [showProtocol, setShowProtocol] = useState(false);

  const filteredEvents = useMemo(
    () =>
      crisis.events.filter((event) => {
        return (severity === "All" || event.severity === severity) &&
          (trigger === "All" || event.trigger === trigger) &&
          (status === "All" || event.status === status);
      }),
    [severity, trigger, status],
  );

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <PageHeader
        title="Crisis & Red Flag Log"
        subtitle="Every case is anonymized. Administrators see patterns, not people."
        actions={<button onClick={() => setShowProtocol(true)} style={{ border: "none", background: theme.danger, color: "#fff", padding: "10px 14px", borderRadius: 12, cursor: "pointer", fontWeight: 700 }}>Contact protocol</button>}
      />
      <div style={{ position: "sticky", top: 12, zIndex: 5, background: "rgba(247,246,242,0.9)", backdropFilter: "blur(10px)", paddingBottom: 6 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 14px", background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 16 }}>
          <ShieldAlert size={18} color={theme.danger} />
          <span style={{ fontSize: 13, color: theme.text }}>All records are k-anonymized. Individual identity is never surfaced to administrators.</span>
          <PrivacyBadge />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 24 }}>
        <KpiCard label="Events (90d)" value={crisis.kpis.events90d} delta="Live aggregate" trend="flat" tone="danger" sparkline={[{ value: 18 }, { value: 16 }, { value: 20 }, { value: 19 }, { value: 15 }]} />
        <KpiCard label="Avg response time (sec)" value={crisis.kpis.avgResponseSec} delta="-6 sec" trend="down" tone="success" sparkline={[{ value: 54 }, { value: 49 }, { value: 45 }, { value: 41 }, { value: 38 }]} />
        <KpiCard label="% closed without escalation" value={`${Math.round(crisis.kpis.closedWithoutEscalationPct * 100)}%`} delta="+4 pts" trend="up" tone="success" sparkline={[{ value: 64 }, { value: 67 }, { value: 70 }, { value: 74 }, { value: 78 }]} />
      </div>
      <Card title="Filters">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["All", "High", "Medium"].map((value) => <Chip key={value} label={`Severity: ${value}`} active={severity === value} tone={value === "High" ? "danger" : "default"} onClick={() => setSeverity(value)} />)}
          {["All", "AI Chat", "Intake Q5", "SOS Button"].map((value) => <Chip key={value} label={`Trigger: ${value}`} active={trigger === value} onClick={() => setTrigger(value)} />)}
          {["All", "Closed", "Ongoing", "Escalated"].map((value) => <Chip key={value} label={`Status: ${value}`} active={status === value} onClick={() => setStatus(value)} />)}
        </div>
      </Card>
      <Card title="Red Flag event log">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Case ID", "Trigger", "Severity", "Date / Time", "Response", "Status"].map((head) => (
                  <th key={head} style={{ textAlign: "left", padding: "0 0 14px", fontSize: 12, color: theme.textMute, fontWeight: 700 }}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td style={{ padding: "14px 0", borderTop: `1px solid ${theme.divider}`, fontWeight: 700 }}>{event.id}</td>
                  <td style={{ padding: "14px 0", borderTop: `1px solid ${theme.divider}` }}>{event.trigger}</td>
                  <td style={{ padding: "14px 0", borderTop: `1px solid ${theme.divider}` }}>
                    <span style={{ display: "inline-block", padding: "6px 10px", borderRadius: 999, background: event.severity === "High" ? "rgba(255,82,82,0.10)" : "rgba(255,184,77,0.12)", color: event.severity === "High" ? theme.danger : "#996300", fontSize: 12, fontWeight: 700 }}>{event.severity}</span>
                  </td>
                  <td style={{ padding: "14px 0", borderTop: `1px solid ${theme.divider}` }}>{formatDateTime(event.dateTime)}</td>
                  <td style={{ padding: "14px 0", borderTop: `1px solid ${theme.divider}` }}>{event.response}</td>
                  <td style={{ padding: "14px 0", borderTop: `1px solid ${theme.divider}` }}>{event.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {showProtocol ? (
        <>
          <div onClick={() => setShowProtocol(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.28)" }} />
          <div style={{ position: "fixed", top: "18%", left: "50%", transform: "translateX(-50%)", width: 520, background: theme.surface, borderRadius: 20, padding: 24, boxShadow: theme.shadow, zIndex: 20 }}>
            <h3 style={{ marginTop: 0 }}>School crisis response chain</h3>
            <div style={{ display: "grid", gap: 12 }}>
              {crisis.protocol.map((step) => (
                <div key={step} style={{ background: theme.surfaceAlt, borderRadius: 14, padding: 14 }}>{step}</div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default Crisis;
