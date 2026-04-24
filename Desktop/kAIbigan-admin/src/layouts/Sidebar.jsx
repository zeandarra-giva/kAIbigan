import { NavLink } from "react-router-dom";
import {
  BookOpen,
  Briefcase,
  CalendarDays,
  Filter,
  HeartPulse,
  LayoutDashboard,
  MessageSquare,
  Settings,
  ShieldAlert,
  UserCheck,
  Users,
} from "lucide-react";
import { theme } from "../theme";

const adminItems = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/engagement", label: "Engagement", icon: Users },
  { to: "/wellbeing", label: "Wellbeing", icon: HeartPulse },
  { to: "/triage", label: "Triage", icon: Filter },
  { to: "/crisis", label: "Crisis", icon: ShieldAlert },
  { to: "/resources", label: "Resources", icon: BookOpen },
  { to: "/providers", label: "Providers", icon: UserCheck },
  { to: "/settings", label: "Settings", icon: Settings },
];

const counselorItems = [
  { to: "/", label: "My Caseload", icon: Briefcase },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/schedule", label: "Schedule", icon: CalendarDays },
  { to: "/handbook", label: "Handbook", icon: BookOpen },
  { to: "/settings", label: "Settings", icon: Settings },
];

function Sidebar({ role }) {
  const items = role === "admin" ? adminItems : counselorItems;

  return (
    <aside
      style={{
        width: 240,
        minWidth: 240,
        background: theme.surfaceAlt,
        borderRight: `1px solid ${theme.border}`,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: theme.primary }} />
          <h2 style={{ margin: 0, fontFamily: "'Playfair Display', Georgia, serif", color: theme.text }}>kAIbigan</h2>
        </div>
        <p style={{ margin: "8px 0 0", fontSize: 12, color: theme.textMute }}>
          {role === "admin" ? "Admin Dashboard" : "Counselor Workspace"}
        </p>
      </div>
      <nav style={{ display: "grid", gap: 8 }}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderRadius: 16,
                color: isActive ? theme.text : theme.textMute,
                background: isActive ? theme.surface : "transparent",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: isActive ? 700 : 600,
                border: isActive ? `1px solid ${theme.border}` : "1px solid transparent",
              })}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
