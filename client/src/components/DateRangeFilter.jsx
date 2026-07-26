/* ── DateRangeFilter ──
   Props:
   - from: string (YYYY-MM-DD)
   - to:   string (YYYY-MM-DD)
   - onChange: ({ from, to }) => void
   - onReset: () => void
*/
function DateRangeFilter({ from, to, onChange, onReset }) {
  return (
    <div className="date-range-filter">
      <div className="date-range-inputs">
        <div className="date-input-group">
          <label htmlFor="date-from">From</label>
          <input
            id="date-from"
            type="date"
            value={from}
            max={to}
            onChange={(e) => onChange({ from: e.target.value, to })}
          />
        </div>
        <span className="date-range-sep">→</span>
        <div className="date-input-group">
          <label htmlFor="date-to">To</label>
          <input
            id="date-to"
            type="date"
            value={to}
            min={from}
            onChange={(e) => onChange({ from, to: e.target.value })}
          />
        </div>
      </div>
      <button className="btn btn-ghost text-sm" onClick={onReset}>
        Reset to this month
      </button>
    </div>
  );
}

export default DateRangeFilter;