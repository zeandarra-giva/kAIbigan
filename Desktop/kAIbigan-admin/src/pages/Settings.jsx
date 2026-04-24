import { useState } from "react";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import { settings } from "../mockData";
import { theme } from "../theme";

function Settings() {
  const [researchEnabled, setResearchEnabled] = useState(settings.privacy.researchEnabled);

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <PageHeader title="Institution Settings & Privacy" subtitle="What the platform shares, what it never shares, and how the partner school is configured." />
      <Card title="Institution profile">
        <div style={{ display: "grid", gap: 10 }}>
          <div><strong>{settings.institutionProfile.name}</strong></div>
          <div>Primary contact: {settings.institutionProfile.contact}</div>
          <div>Admins: {settings.institutionProfile.admins.join(", ")}</div>
        </div>
      </Card>
      <Card title="Privacy controls">
        <div style={{ display: "grid", gap: 12 }}>
          {settings.privacy.doesNotShare.map((item) => (
            <div key={item} style={{ padding: 14, borderRadius: 14, background: theme.surfaceAlt }}>{item}</div>
          ))}
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 14, borderRadius: 14, background: theme.surfaceAlt }}>
            <span>Allow anonymized aggregates for academic research partnerships</span>
            <input type="checkbox" checked={researchEnabled} onChange={() => setResearchEnabled((value) => !value)} />
          </label>
        </div>
      </Card>
      <Card title="Integration">
        <div style={{ display: "grid", gap: 10 }}>
          <div>SSO with school email: {settings.integration.sso}</div>
          <div>Crisis response contacts: {settings.integration.crisisContacts.join(", ")}</div>
          <button style={{ width: "fit-content", border: "none", background: theme.text, color: "#fff", padding: "10px 14px", borderRadius: 12, cursor: "pointer" }}>Download Data Processing Agreement (DPA)</button>
        </div>
      </Card>
    </div>
  );
}

export default Settings;
