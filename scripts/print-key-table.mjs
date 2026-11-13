// Prints the Preeti mapping so you can check it against a real Preeti font.
// Run: node scripts/print-key-table.mjs

import { KEY_MAP, SEQUENCE_MAP, HIGH_MAP, MAPPING_STATUS } from '../src/lib/mapping.js'

console.log(`Mapping status: ${MAPPING_STATUS}\n`)

function line(key, entry) {
  const doubt = entry.doubt ? `   <-- DOUBT: ${entry.doubt}` : ''
  return `${key.padEnd(4)} ${entry.type.padEnd(9)}  ${entry.out}${doubt}`
}

// Every printable ASCII character, in order (codes 33 to 126).
let allKeys = ''
const unmapped = []
let mappedCount = 0

for (let code = 33; code <= 126; code += 1) {
  const key = String.fromCharCode(code)
  allKeys += key
  const entry = KEY_MAP[key]
  if (!entry) {
    unmapped.push(key)
    continue
  }
  mappedCount += 1
  console.log(line(key, entry))
}

console.log('\nSequences:')
for (const [keys, entry] of Object.entries(SEQUENCE_MAP)) {
  console.log(line(keys, entry))
}

console.log('\nHigh-code characters:')
for (const [key, entry] of Object.entries(HIGH_MAP)) {
  console.log(line(key, entry))
}

console.log(`\nMapped ASCII keys: ${mappedCount} of 94`)
console.log(`Unmapped ASCII keys: ${unmapped.length === 0 ? 'none' : unmapped.join(' ')}`)
console.log(`Sequences: ${Object.keys(SEQUENCE_MAP).length}`)
console.log(`High-code entries: ${Object.keys(HIGH_MAP).length}`)
console.log('\nAll ASCII keys in order (paste into Word with a Preeti font):')
console.log(allKeys)