export function Field({ label, value, onChange, options }) {
  return (
    <label className="field"><span>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o[0]} value={o[0]}>{o[1]}</option>)}
      </select>
    </label>
  );
}

export function Seg({ label, value, onChange, options }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map(o => <button key={o[0]} type="button" aria-pressed={value === o[0]} onClick={() => onChange(o[0])}>{o[1]}</button>)}
    </div>
  );
}
