import { theme } from "../theme";

function Card({ title, action, children, padding = 24, style = {} }) {
  return (
    <section
      style={{
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: theme.radius.lg,
        boxShadow: theme.shadow,
        padding,
        ...style,
      }}
    >
      {(title || action) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          {title ? <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: theme.text }}>{title}</h3> : <span />}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export default Card;
