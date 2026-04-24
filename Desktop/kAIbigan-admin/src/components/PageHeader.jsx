import { theme } from "../theme";

function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 24 }}>
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: title === "Overview" ? 40 : 28,
            lineHeight: 1.05,
            fontWeight: 700,
            color: theme.text,
            fontFamily: title === "Overview" ? "'Playfair Display', Georgia, serif" : "'Inter', sans-serif",
          }}
        >
          {title}
        </h1>
        <p style={{ margin: "10px 0 0", fontSize: 14, color: theme.textMute }}>{subtitle}</p>
      </div>
      {actions}
    </div>
  );
}

export default PageHeader;
