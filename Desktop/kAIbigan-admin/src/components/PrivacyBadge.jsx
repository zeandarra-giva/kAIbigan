import { ShieldCheck } from "lucide-react";
import { theme } from "../theme";

function PrivacyBadge() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderRadius: 999,
        background: theme.surfaceAlt,
        border: `1px solid ${theme.border}`,
        color: theme.textMute,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      <ShieldCheck size={14} color={theme.primaryDk} />
      <span>k-anonymous · aggregated only</span>
    </div>
  );
}

export default PrivacyBadge;
