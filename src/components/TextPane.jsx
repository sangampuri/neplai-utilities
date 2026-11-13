// A labeled text area. The visible label is tied to the textarea with htmlFor/id,
// so screen readers announce it and clicking the label focuses the box.
export default function TextPane({
  id,
  label,
  value,
  onChange,
  readOnly = false,
  className = '',
  lang,
  describedBy,
}) {
  return (
    <div className="text-pane">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={className}
        lang={lang}
        spellCheck={false}
        aria-describedby={describedBy}
      />
    </div>
  )
}