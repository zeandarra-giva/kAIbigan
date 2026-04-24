import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { theme } from "../theme";
import Sparkline from "./Sparkline";

const iconMap = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: ArrowRight,
};

function formatDelta(delta) {
  if (typeof delta === "string") return delta;
  const sign = delta > 0 ? "+" : "";
  return `${sign}${(delta * 100).toFixed(1)}%`;
}

function KpiCard({ label, value, delta, trend = "flat", icon: Icon, tone = "default", sparkline }) {
  const TrendIcon = iconMap[trend] || ArrowRight;
  const toneColor = tone === "danger" ? theme.danger : tone === "success" ? theme.success : theme.text;

  return (
    <div
      style={{
        background: theme.surface,
        borderRadius: theme.radius.lg,
        border: `1px solid ${theme.border}`,
        boxShadow: theme.shadow,
        padding: 24,
        minHeight: 172,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, letterSpacing: 1.1, textTransform: "uppercase", color: theme.textSoft, fontWeight: 700 }}>{label}</p>
          <p style={{ margin: "12px 0 0", fontSize: 40, lineHeight: 1, fontWeight: 700, color: theme.text }}>{value}</p>
        </div>
        {Icon ? <Icon size={20} color={toneColor} /> : null}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 18 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: toneColor, fontSize: 13, fontWeight: 600 }}>
          <TrendIcon size={16} />
          <span>{formatDelta(delta)}</span>
        </div>
        <Sparkline data={sparkline} color={toneColor === theme.text ? theme.primary : toneColor} />
      </div>
    </div>
  );
}

export default KpiCard;
