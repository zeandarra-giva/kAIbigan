import Card from "../components/Card";
import PageHeader from "../components/PageHeader";

function CounselorSettings() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <PageHeader title="Counselor Settings" subtitle="Workspace preferences and response commitments." />
      <Card title="Preferences">
        <div style={{ display: "grid", gap: 8 }}>
          <div>Notifications: Enabled</div>
          <div>Default response window: 6 hours</div>
          <div>Availability sync: Connected</div>
          <div>Bulk export: Disabled (privacy-by-design)</div>
        </div>
      </Card>
    </div>
  );
}

export default CounselorSettings;
