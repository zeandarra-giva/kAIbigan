import { useState } from "react";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Chip from "../components/Chip";
import Heatmap from "../components/charts/Heatmap";
import { coaches } from "../mockData";

function Coaches() {
  const [tab, setTab] = useState("counselors");
  const rows = coaches.tabs[tab] || [];

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <PageHeader title="Counselor & Professional Utilization" subtitle="Capacity, wait times, and where the schedule still has room." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}>
        {[
          { label: "Live session cap", value: coaches.policy.liveSessionCap },
          { label: "Async response target", value: coaches.policy.asyncResponse },
          { label: "Live capacity used", value: coaches.policy.liveSessionUtilization },
          { label: "Async threads", value: coaches.policy.asyncThreads },
        ].map((item) => (
          <Card key={item.label} padding={18}>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(26,26,46,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>{item.label}</p>
            <p style={{ margin: "8px 0 0", fontSize: 20, fontWeight: 700 }}>{item.value}</p>
          </Card>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Chip label="Counselors" active={tab === "counselors"} onClick={() => setTab("counselors")} />
        <Chip label="Professionals" active={tab === "professionals"} onClick={() => setTab("professionals")} />
        <Chip label="Pool Health" active={tab === "poolHealth"} onClick={() => setTab("poolHealth")} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24 }}>
        <Card title={tab === "counselors" ? "Guidance counselor roster" : tab === "professionals" ? "Professional roster" : "Partnered pool health"}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {Object.keys(rows[0] || { Provider: "", Metric: "" }).map((head) => (
                  <th key={head} style={{ textAlign: "left", paddingBottom: 12, fontSize: 12 }}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value, colIndex) => (
                    <td key={colIndex} style={{ padding: "12px 0", borderTop: "1px solid rgba(0,0,0,0.05)", fontWeight: colIndex === 0 ? 600 : 400 }}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="Underutilized slots">
          <div style={{ display: "grid", gap: 12 }}>
            {coaches.underutilized.map((slot) => (
              <div key={slot} style={{ padding: 14, borderRadius: 14, background: "rgba(126,214,162,0.08)" }}>{slot}</div>
            ))}
          </div>
        </Card>
      </div>
      <Card title="Booking heatmap">
        <Heatmap data={coaches.bookingHeatmap} cols={8} />
      </Card>
    </div>
  );
}

export default Coaches;
