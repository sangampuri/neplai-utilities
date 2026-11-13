// Turns converter flags into display items: the flagged text plus a little
// context on each side. Pure logic, no React.
//
// flags    array from convertPreetiToUnicode: { index, length, kind, note, source }
// options  includeUncertain (default false): also show kind 'uncertain'
//          limit (default 100): maximum items returned
// Returns  { items, total }. total counts every matching flag, even past the limit.

const CONTEXT_CHARS = 12

// Newlines and runs of spaces become one space so the list stays on one line.
function tidy(text) {
  return text.replace(/\s+/g, ' ')
}

export function describeFlags(text, flags, { includeUncertain = false, limit = 100 } = {}) {
  const wanted = flags
    .filter((flag) => includeUncertain || flag.kind === 'unsupported')
    .sort((a, b) => a.index - b.index)

  const items = wanted.slice(0, limit).map((flag, position) => {
    const start = flag.index
    const end = flag.index + flag.length
    return {
      key: `${flag.index}-${position}`,
      kind: flag.kind,
      note: flag.note,
      source: flag.source,
      before: tidy(text.slice(Math.max(0, start - CONTEXT_CHARS), start)),
      marked: text.slice(start, end),
      after: tidy(text.slice(end, end + CONTEXT_CHARS)),
    }
  })

  return { items, total: wanted.length }
}