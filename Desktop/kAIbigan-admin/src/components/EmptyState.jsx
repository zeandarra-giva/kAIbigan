import { theme } from "../theme";

function EmptyState({ icon: Icon, message }) {
  return (
    <div style={{ padding: 32, textAlign: "center", color: theme.textMute }}>
      {Icon ? <Icon size={28} style={{ marginBottom: 12 }} /> : null}
      <p style={{ margin: 0, fontSize: 14 }}>{message}</p>
    </div>
  );
}

export default EmptyState;
