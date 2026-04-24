import { Download, UserCircle2 } from "lucide-react";
import { theme } from "../theme";
import PrivacyBadge from "../components/PrivacyBadge";

function TopBar({ role, institution, user, dateRange, cohort, onExport, onFilterChange, onRoleSwitch }) {
  return (
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 24 }}>
      <div>
        <p style={{ margin: 0, fontSize: 13, color: theme.textMute }}>
          {institution.name} — {role === "admin" ? institution.unit : "Guidance Counseling Office"}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ padding: "6px 10px", borderRadius: 999, background: theme.surfaceAlt, border: `1px solid ${theme.border}`, fontSize: 12, color: theme.text }}>
          {role === "admin" ? "Student Affairs" : "Guidance Counselor"}
        </span>
        <button
          onClick={() => onRoleSwitch(role === "admin" ? "counselor" : "admin")}
          style={{ borderRadius: 12, padding: "9px 12px", border: `1px solid ${theme.border}`, background: theme.surface, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
        >
          {role === "admin" ? "Switch to Counselor view" : "Switch to Admin view"}
        </button>
        {role === "admin" ? (
          <>
            <select value={dateRange} onChange={(event) => onFilterChange({ dateRange: event.target.value })} style={{ borderRadius: 12, padding: "10px 12px", border: `1px solid ${theme.border}`, background: theme.surface }}>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="semester">This semester</option>
            </select>
            <select value={cohort} onChange={(event) => onFilterChange({ cohort: event.target.value })} style={{ borderRadius: 12, padding: "10px 12px", border: `1px solid ${theme.border}`, background: theme.surface }}>
              <option value="all">All students</option>
              <option value="year">By year level</option>
              <option value="college">By college</option>
            </select>
            <button onClick={onExport} style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "none", background: theme.text, color: "#fff", padding: "10px 14px", borderRadius: 12, cursor: "pointer", fontWeight: 600 }}>
              <Download size={16} />
              Export
            </button>
          </>
        ) : null}
        <PrivacyBadge />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, paddingLeft: 8 }}>
          <UserCircle2 color={theme.textMute} size={26} />
          <span style={{ fontSize: 13, color: theme.text }}>{user}</span>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
