import { theme } from "../theme";

function Chip({ label, tone = "default", active = false, onClick, onRemove }) {
  const bgMap = {
    default: active ? theme.primary : theme.surfaceAlt,
    danger: active ? theme.danger : "rgba(255,82,82,0.08)",
    warning: active ? theme.warning : "rgba(255,184,77,0.12)",
  };

  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        border: "none",
        cursor: onClick ? "pointer" : "default",
        padding: "8px 12px",
        borderRadius: 999,
        background: bgMap[tone] || bgMap.default,
        color: active ? "#1a1a2e" : theme.text,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {label}
      {onRemove ? <span onClick={onRemove}>×</span> : null}
    </button>
  );
}

export default Chip;
