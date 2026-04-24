import Chip from "./Chip";

function FilterBar({ dateRange, cohort, onChange }) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {["7d", "30d", "90d", "semester"].map((value) => (
        <Chip key={value} label={value === "semester" ? "This semester" : `Last ${value.slice(0, -1)} days`} active={dateRange === value} onClick={() => onChange({ dateRange: value })} />
      ))}
      {["all", "year", "college"].map((value) => (
        <Chip key={value} label={value === "all" ? "All students" : value === "year" ? "By year level" : "By college"} active={cohort === value} onClick={() => onChange({ cohort: value })} />
      ))}
    </div>
  );
}

export default FilterBar;
