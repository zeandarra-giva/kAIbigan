import { theme } from "../../theme";

function colorForValue(value, tone = "primary") {
  const base = tone === "danger" ? "255,82,82" : "126,214,162";
  const alpha = 0.08 + Math.min(0.9, value / 100);
  return `rgba(${base}, ${alpha})`;
}

function Heatmap({ data, cols = 13, tone = "primary", compact = false }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: compact ? 4 : 6,
      }}
    >
      {data.flat().map((cell) => (
        <div
          key={`${cell.row}-${cell.col}`}
          style={{
            aspectRatio: "1 / 1",
            borderRadius: compact ? 4 : 8,
            background: colorForValue(cell.value, tone),
            border: `1px solid ${theme.divider}`,
          }}
          title={`${cell.value}`}
        />
      ))}
    </div>
  );
}

export default Heatmap;
