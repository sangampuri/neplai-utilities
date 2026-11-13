import '../styles/patro-rail.css'

// BS month names in order, Baisakh to Chaitra.
// Spelling follows common modern usage. Variants exist (e.g. भदौ / भाद्र);
// change the text here if you prefer another spelling.
const BS_MONTHS = [
  'बैशाख',
  'जेठ',
  'असार',
  'श्रावण',
  'भदौ',
  'असोज',
  'कार्तिक',
  'मंसिर',
  'पौष',
  'माघ',
  'फागुन',
  'चैत',
]

// activeMonth: 0 to 11, or null for "none highlighted".
// Right now nothing passes it, because finding today's BS month needs the
// date logic from Milestone 7. We never guess it.
export default function PatroRail({ activeMonth = null }) {
  return (
    // Decorative for now, so screen readers skip it.
    // Milestone 9 turns it into a real month picker and removes aria-hidden.
    <div className="patro-rail" aria-hidden="true" lang="ne">
      <ol>
        {BS_MONTHS.map((name, index) => (
          <li key={name} className={index === activeMonth ? 'is-active' : undefined}>
            {name}
          </li>
        ))}
      </ol>
    </div>
  )
}