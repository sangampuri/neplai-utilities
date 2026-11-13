// Quick manual check of the converter. Run: node scripts/try-convert.mjs
//
// The "expected" values are MY OWN mental conversions. They are NOT verified.
// A FAIL means either the converter or my expectation is wrong.
// Decide by typing the input in Word with your Preeti font.

import { convertPreetiToUnicode } from '../src/lib/convert.js'

const cases = [
  ['g]kfn', 'नेपाल'],
  ['g]kfnL', 'नेपाली'],
  ['df]afOn', 'मोबाइल'],
  ['s[lif', 'कृषि'], // "if" sequence plus ि reordering
  ['lj1fg', 'विज्ञान'], // ि reordering
  ['l;tf', 'सिता'], // ि reordering
  ['k|of]u', 'प्रयोग'], // rakar
  ['wd{', 'धर्म'], // reph
  ['stf{', 'कर्ता'], // reph after a matra
  ['efiff', 'भाषा'], // "if" sequence
  ['नेपाल', 'नेपाल'], // Devanagari passes through
]

let failures = 0
for (const [input, expected] of cases) {
  const { text } = convertPreetiToUnicode(input)
  const ok = text === expected
  if (!ok) failures += 1
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${input.padEnd(8)} -> ${text}${ok ? '' : `   (expected ${expected})`}`)
}

// Flag demo: "2" is not mapped, so it must be flagged and kept.
const demo = convertPreetiToUnicode('g]2')
console.log('\nFlag demo for "g]2":')
console.log(`text:  ${demo.text}`)
console.log(`flags: ${JSON.stringify(demo.flags)}`)

// ि flags are all "uncertain" until the l/I notes are cleared from mapping.js.
const iFlags = convertPreetiToUnicode('l;tf').flags
console.log(`\nFlags for "l;tf": ${iFlags.length} (expected 1: the doubtful "l")`)

console.log(failures === 0 ? '\nAll cases match my expectations.' : `\n${failures} case(s) differ.`)
process.exitCode = failures === 0 ? 0 : 1