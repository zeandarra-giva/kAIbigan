import { theme } from "../../theme";

function RetentionGrid({ data }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {data.map((row) => (
        <div key={row.cohort} style={{ display: "grid", gridTemplateColumns: "100px repeat(8, 1fr)", gap: 6, alignItems: "center" }}>
          <div style={{ fontSize: 12, color: theme.textMute }}>{row.cohort}</div>
          {row.values.map((value, index) => (
            <div
              key={index}
              style={{
                height: 32,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                color: value ? theme.text : theme.textSoft,
                background: value ? `rgba(126,214,162, ${0.15 + value / 120})` : theme.surfaceAlt,
                border: `1px solid ${theme.divider}`,
              }}
            >
              {value ? `${value}%` : "—"}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default RetentionGrid;
