import { theme } from "../theme";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

function AppShell({ role, institution, user, dateRange, cohort, onExport, onFilterChange, onRoleSwitch, children, toast }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", background: theme.bg, color: theme.text }}>
      <Sidebar role={role} />
      <div style={{ flex: 1, padding: 24, minWidth: 0 }}>
        <TopBar
          role={role}
          institution={institution}
          user={user}
          dateRange={dateRange}
          cohort={cohort}
          onExport={onExport}
          onFilterChange={onFilterChange}
          onRoleSwitch={onRoleSwitch}
        />
        <main>{children}</main>
      </div>
      {toast ? (
        <div style={{ position: "fixed", top: 24, right: 24, background: theme.text, color: "#fff", padding: "12px 16px", borderRadius: 12, boxShadow: theme.shadow, zIndex: 50 }}>
          {toast}
        </div>
      ) : null}
    </div>
  );
}

export default AppShell;
