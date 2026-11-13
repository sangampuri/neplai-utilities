import { describe, it, expect } from 'vitest'
import { convertPreetiToUnicode } from '../src/lib/convert.js'

// Labels in describe() names:
//   [reviewed]   expected output checked by hand against the rules in convert.js.
//                NOT verified against a real Preeti font or a trusted sample.
//   [UNCERTAIN]  expected output depends on a mapping that is in doubt.
//   [limitation] documents a known limit of the approach.
// Nothing here is marked VERIFIED yet. Verified samples will get their own group.

const convert = (input) => convertPreetiToUnicode(input).text

describe('[reviewed] basic consonants', () => {
  it.each([
    ['s', 'क'],
    ['v', 'ख'],
    ['u', 'ग'],
    ['3', 'घ'],
    ['r', 'च'],
    ['h', 'ज'],
    ['t', 'त'],
    ['xyz', 'हथश'],
    ['kb;', 'पदस'],
  ])('%s -> %s', (input, expected) => {
    expect(convert(input)).toBe(expected)
  })
})

describe('[reviewed] independent vowels', () => {
  it.each([
    ['c', 'अ'],
    ['cf', 'आ'],
    ['O', 'इ'],
    ['O{', 'ई'],
    ['p', 'उ'],
    ['pm', 'ऊ'],
    ['C', 'ऋ'],
    ['P', 'ए'],
    ['P]', 'ऐ'],
    ['cf]', 'ओ'],
    ['cf}', 'औ'],
  ])('%s -> %s', (input, expected) => {
    expect(convert(input)).toBe(expected)
  })
})

describe('[reviewed] matras and signs (not ि)', () => {
  it.each([
    ['sf', 'का'],
    ['sL', 'की'],
    ["s'", 'कु'],
    ['s"', 'कू'],
    ['s]', 'के'],
    ['s}', 'कै'],
    ['sf]', 'को'],
    ['sf}', 'कौ'],
    ['s[', 'कृ'],
    ['sF', 'कँ'],
    ['s+', 'कं'],
    ['sM', 'कः'],
  ])('%s -> %s', (input, expected) => {
    expect(convert(input)).toBe(expected)
  })
})

describe('[UNCERTAIN] ि matra (depends on the unconfirmed l key)', () => {
  it.each([
    ['l;', 'सि'],
    ['l;tf', 'सिता'],
    ['lj1fg', 'विज्ञान'],
    ['lSt', 'क्ति'], // ि must land after the whole conjunct
  ])('%s -> %s', (input, expected) => {
    expect(convert(input)).toBe(expected)
  })
})

describe('[UNCERTAIN] reph (depends on the unconfirmed { key)', () => {
  it.each([
    ['wd{', 'धर्म'],
    ['stf{', 'कर्ता'], // reph goes before the whole cluster, including its matra
    ['{', 'र्'], // nothing before it: kept as is
  ])('%s -> %s', (input, expected) => {
    expect(convert(input)).toBe(expected)
  })
})

describe('[UNCERTAIN] rakar (depends on the unconfirmed | key)', () => {
  it('k|of]u -> प्रयोग', () => {
    expect(convert('k|of]u')).toBe('प्रयोग')
  })
})

describe('[reviewed] halant and half letters', () => {
  it.each([
    ['s\\t', 'क्त'], // consonant + halant key + consonant
    ['St', 'क्त'], // half letter + consonant
    ['Tj', 'त्व'],
    ['i', 'ष्'], // half ष alone
    ['if', 'ष'], // "if" sequence wins over i + f
    ['0', 'ण्'],
    ['0f', 'ण'],
  ])('%s -> %s', (input, expected) => {
    expect(convert(input)).toBe(expected)
  })
})

describe('[reviewed] conjunct glyphs', () => {
  it.each([
    ['q', 'त्र'],
    ['1', 'ज्ञ'],
    ['If', 'क्ष'],
    ['Q', 'त्त'],
    ['Qf', 'त्ता'],
    ['B', 'द्य'],
  ])('%s -> %s', (input, expected) => {
    expect(convert(input)).toBe(expected)
  })
})

describe('[reviewed] Devanagari digits (shifted number keys)', () => {
  it.each([
    ['!@#', '१२३'],
    ['^&*()', '६७८९०'],
    ['!)^', '१०६'],
  ])('%s -> %s', (input, expected) => {
    expect(convert(input)).toBe(expected)
  })
})

describe('[reviewed] punctuation', () => {
  it.each([
    ['g]kfn.', 'नेपाल।'],
    ['s,v', 'क,ख'],
    ['s-v_', 'क(ख)'],
    ['s<', 'क?'],
  ])('%s -> %s', (input, expected) => {
    expect(convert(input)).toBe(expected)
  })
})

describe('[UNCERTAIN] punctuation keys not in the chart', () => {
  it('= -> .', () => {
    expect(convert('=')).toBe('.')
  })
})

describe('[reviewed] whitespace and real words', () => {
  it.each([
    ['g]kfn', 'नेपाल'],
    ['g]kfnL', 'नेपाली'],
    ['s v', 'क ख'],
    ['s\nv', 'क\nख'],
  ])('%j -> %j', (input, expected) => {
    expect(convert(input)).toBe(expected)
  })
})

describe('[reviewed] mixed text', () => {
  it.each([
    ['नेपाल', 'नेपाल'], // Devanagari passes through
    ['g]kfn नेपाल', 'नेपाल नेपाल'], // Preeti and Devanagari together
  ])('%s -> %s', (input, expected) => {
    expect(convert(input)).toBe(expected)
  })
})

describe('[limitation] English text', () => {
  it('English letters are treated as Preeti keys, so "Hello" is changed', () => {
    // Preeti is plain ASCII, so English cannot be told apart from Preeti.
    // We assert only that it IS changed. The exact garbage is not worth pinning.
    expect(convert('Hello')).not.toBe('Hello')
  })
})

describe('flags', () => {
  it('[reviewed] flags an unmapped key and keeps it', () => {
    const { text, flags } = convertPreetiToUnicode('g]2')
    expect(text).toBe('ने2')
    expect(flags).toHaveLength(1)
    expect(flags[0]).toMatchObject({ index: 2, length: 1, kind: 'unsupported', source: '2' })
  })

  it('[reviewed] flags m typed alone', () => {
    const { text, flags } = convertPreetiToUnicode('sm')
    expect(text).toBe('कm')
    expect(flags[0]).toMatchObject({ kind: 'unsupported', source: 'm' })
  })

  it('[reviewed] returns nothing for empty input', () => {
    expect(convertPreetiToUnicode('')).toEqual({ text: '', flags: [] })
  })

  it('[reviewed] keeps a lone ि and flags it', () => {
    const { text, flags } = convertPreetiToUnicode('l')
    expect(text).toBe('ि')
    expect(flags[0]).toMatchObject({ kind: 'uncertain', source: 'l' })
  })

  it('[UNCERTAIN] flag positions follow the text after reph moves a cluster', () => {
    // Depends on the doubt notes on "l" and "{" in mapping.js.
    // If those notes are removed after verification, update this test.
    const { text, flags } = convertPreetiToUnicode('l;{')
    expect(text).toBe('र्सि')
    const covered = flags.map((flag) => text.slice(flag.index, flag.index + flag.length))
    expect(covered).toEqual(['र्', 'ि'])
  })
})

describe('[reviewed] large input', () => {
  it('converts 100,000 characters', () => {
    const input = 'sf'.repeat(50000) // का x 50,000
    const { text } = convertPreetiToUnicode(input)
    expect(text.length).toBe(100000)
    expect(text.startsWith('काका')).toBe(true)
  })
})