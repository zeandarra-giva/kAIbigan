import { useMemo } from "react";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import BarList from "../components/charts/BarList";
import { resources } from "../mockData";

function Resources() {
  const sorted = useMemo(
    () => [...resources.items].sort((a, b) => b.completionRate - a.completionRate),
    [],
  );

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <PageHeader title="Resource Performance" subtitle="Which self-help content is being opened, finished, and saved." actions={<button style={{ border: "none", borderRadius: 12, padding: "10px 14px", cursor: "pointer" }}>Request new resource</button>} />
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24 }}>
        <Card title="Resource table">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Title", "Category", "Views", "Completion rate", "Avg session length", "Save rate"].map((head) => (
                  <th key={head} style={{ textAlign: "left", paddingBottom: 12, fontSize: 12 }}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resources.items.map((item) => (
                <tr key={item.title}>
                  <td style={{ padding: "12px 0", borderTop: "1px solid rgba(0,0,0,0.05)", fontWeight: 600 }}>{item.title}</td>
                  <td style={{ padding: "12px 0", borderTop: "1px solid rgba(0,0,0,0.05)" }}>{item.category}</td>
                  <td style={{ padding: "12px 0", borderTop: "1px solid rgba(0,0,0,0.05)" }}>{item.views.toLocaleString()}</td>
                  <td style={{ padding: "12px 0", borderTop: "1px solid rgba(0,0,0,0.05)" }}>{Math.round(item.completionRate * 100)}%</td>
                  <td style={{ padding: "12px 0", borderTop: "1px solid rgba(0,0,0,0.05)" }}>{item.avgSessionLength}</td>
                  <td style={{ padding: "12px 0", borderTop: "1px solid rgba(0,0,0,0.05)" }}>{Math.round(item.saveRate * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <div style={{ display: "grid", gap: 24 }}>
          <Card title="Top 3">
            {sorted.slice(0, 3).map((item) => <div key={item.title} style={{ padding: "10px 0" }}>{item.title}</div>)}
          </Card>
          <Card title="Bottom 3">
            {sorted.slice(-3).map((item) => <div key={item.title} style={{ padding: "10px 0" }}>{item.title}</div>)}
          </Card>
        </div>
      </div>
      <Card title="Category engagement">
        <BarList data={resources.categoryEngagement} dataKey="value" labelKey="name" horizontal />
      </Card>
    </div>
  );
}

export default Resources;
