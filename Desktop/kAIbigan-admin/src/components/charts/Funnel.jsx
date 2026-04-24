import { theme } from "../../theme";

function Funnel({ stages }) {
  const max = Math.max(...stages.map((stage) => stage.value));

  return (
    <div style={{ display: "grid", gap: 18 }}>
      {stages.map((stage, index) => {
        const width = `${(stage.value / max) * 100}%`;
        const next = stages[index + 1];
        const dropOff = next ? `${Math.round(((stage.value - next.value) / stage.value) * 100)}% drop-off` : "Final stage";

        return (
          <div key={stage.name}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>{stage.name}</span>
              <span style={{ fontSize: 13, color: theme.textMute }}>{stage.value.toLocaleString()}</span>
            </div>
            <div style={{ background: theme.surfaceAlt, borderRadius: 999, overflow: "hidden", height: 26 }}>
              <div style={{ width, height: "100%", borderRadius: 999, background: stage.color }} />
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 12, color: theme.textSoft }}>{dropOff}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Funnel;
