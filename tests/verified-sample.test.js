import { describe, it, expect } from 'vitest'
import { convertPreetiToUnicode } from '../src/lib/convert.js'

// [VERIFIED-SAMPLE]
// One real passage supplied by the project owner: Preeti text and its
// correct Unicode. Template literals are used because the Preeti text
// contains ' and " characters.
// The Unicode side was NOT produced by me. Owner: confirm it is the correct
// version of this text.

const PREETI = `d]/f] cg'kl:yltsf] cjlw e/ o; sfof{nosf] b}lgs k|zf;lgs sfo{x? ;'rf? ?kdf ;~rfng ug{sf nflu tkfO{+nfO{ lgldQ 8Lgsf] lhDd]jf/L ;lxt k|zf;lgs sfo{ ug]{ cg'dlt k|bfg ul/Psf] 5 . sfof{nosf] ul/df / b}lgs sfo{;Dkfbgdf tkfO{+sf] k"0f{ ;xof]u /xg] ljZjf; lnPsf] 5' .`

const UNICODE = `मेरो अनुपस्थितिको अवधि भर यस कार्यालयको दैनिक प्रशासनिक कार्यहरु सुचारु रुपमा सञ्चालन गर्नका लागि तपाईंलाई निमित्त डीनको जिम्मेवारी सहित प्रशासनिक कार्य गर्ने अनुमति प्रदान गरिएको छ । कार्यालयको गरिमा र दैनिक कार्यसम्पादनमा तपाईंको पूर्ण सहयोग रहने विश्वास लिएको छु ।`

const preetiWords = PREETI.split(' ')
const unicodeWords = UNICODE.split(' ')

describe('[VERIFIED-SAMPLE] real passage', () => {
  it('has the same number of words on both sides', () => {
    // If this fails, the pairs below are misaligned and their failures mean nothing.
    expect(preetiWords.length).toBe(unicodeWords.length)
  })

  it('converts the whole passage', () => {
    expect(convertPreetiToUnicode(PREETI).text).toBe(UNICODE)
  })

  it('flags no unsupported characters', () => {
    const { flags } = convertPreetiToUnicode(PREETI)
    expect(flags.filter((flag) => flag.kind === 'unsupported')).toEqual([])
  })

  // One test per word, so a failure names the exact word.
  it.each(preetiWords.map((word, index) => [word, unicodeWords[index]]))(
    '%s -> %s',
    (preeti, expected) => {
      expect(convertPreetiToUnicode(preeti).text).toBe(expected)
    },
  )
})