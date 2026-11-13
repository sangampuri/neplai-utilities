// Preeti keyboard layout: key -> Unicode Devanagari.
//
// STATUS: DRAFT, CROSS-CHECKED AGAINST A CHART ONLY.
// Sources:
//   1. My general knowledge of the standard Preeti layout.
//   2. A Preeti keyboard chart supplied by the project owner (origin unknown,
//      not an official source). Rows that match it are not marked doubtful.
// NOT yet checked in Word with a real Preeti font. Entries with a `doubt`
// note are the ones to check first.
//
// Entry types (used by convert.js):
//   consonant  full letter or conjunct; can take matras
//   syllable   complete unit that already contains a vowel sign (no more matras)
//   half       letter ending in halant; joins the next consonant
//   vowel      independent vowel
//   matra      vowel sign placed after a consonant
//   prematra   ि, typed BEFORE the consonant, written AFTER it in Unicode
//   reph       र्, typed AFTER the cluster, written BEFORE it in Unicode
//   rakar      ्र, attaches after a consonant
//   halant     ्
//   sign       ँ ं ः
//   digit      Devanagari digit
//   punct      punctuation and symbols
//
// Keys deliberately NOT mapped (unknown, so convert.js must flag them):
//   2, 4  (not listed in the chart as consonants; not digits either)
//   m     (alone it is only a stroke; see SEQUENCE_MAP km and em)

export const MAPPING_STATUS = 'DRAFT_CHART_CHECKED'

const e = (type, out, doubt) => (doubt ? { type, out, doubt } : { type, out })

// ---- Plain ASCII keys ----
export const KEY_MAP = {
  // Lowercase letters
  a: e('consonant', 'ब'),
  b: e('consonant', 'द'),
  c: e('vowel', 'अ'),
  d: e('consonant', 'म'),
  e: e('consonant', 'भ'),
  f: e('matra', 'ा'),
  g: e('consonant', 'न'),
  h: e('consonant', 'ज'),
  i: e('half', 'ष्'),
  j: e('consonant', 'व'),
  k: e('consonant', 'प'),
  l: e('prematra', 'ि', 'Chart font cannot tell l from I. Chosen because क्ष = If'),
  n: e('consonant', 'ल'),
  o: e('consonant', 'य'),
  p: e('vowel', 'उ'),
  q: e('consonant', 'त्र'),
  r: e('consonant', 'च'),
  s: e('consonant', 'क'),
  t: e('consonant', 'त'),
  u: e('consonant', 'ग'),
  v: e('consonant', 'ख'),
  w: e('consonant', 'ध'),
  x: e('consonant', 'ह'),
  y: e('consonant', 'थ'),
  z: e('consonant', 'श'),

  // Uppercase letters
  A: e('half', 'ब्'),
  B: e('consonant', 'द्य'),
  C: e('vowel', 'ऋ'),
  D: e('half', 'म्'),
  E: e('half', 'भ्'),
  F: e('sign', 'ँ'),
  G: e('half', 'न्'),
  H: e('half', 'ज्'),
  I: e('half', 'क्ष्', 'Chart font cannot tell I from l. Chosen because क्ष = If'),
  J: e('half', 'व्'),
  K: e('half', 'प्'),
  L: e('matra', 'ी'),
  M: e('sign', 'ः'),
  N: e('half', 'ल्'),
  O: e('vowel', 'इ'),
  P: e('vowel', 'ए'),
  Q: e('consonant', 'त्त'),
  R: e('half', 'च्'),
  S: e('half', 'क्'),
  T: e('half', 'त्'),
  U: e('half', 'ग्'),
  V: e('half', 'ख्'),
  W: e('half', 'ध्'),
  X: e('half', 'ह्'),
  Y: e('half', 'थ्'),
  Z: e('half', 'श्'),

  // Number row, unshifted: consonants (NOT digits)
  '0': e('half', 'ण्'),
  '1': e('consonant', 'ज्ञ'),
  '3': e('consonant', 'घ'),
  '5': e('consonant', 'छ'),
  '6': e('consonant', 'ट'),
  '7': e('consonant', 'ठ'),
  '8': e('consonant', 'ड'),
  '9': e('consonant', 'ढ'),

  // Number row, shifted: Devanagari digits
  '!': e('digit', '१'),
  '@': e('digit', '२'),
  '#': e('digit', '३'),
  $: e('digit', '४'),
  '%': e('digit', '५'),
  '^': e('digit', '६'),
  '&': e('digit', '७'),
  '*': e('digit', '८'),
  '(': e('digit', '९'),
  ')': e('digit', '०'),

  // Matras and signs
  '[': e('matra', 'ृ'),
  ']': e('matra', 'े'),
  '}': e('matra', 'ै'),
  "'": e('matra', 'ु'),
  '"': e('matra', 'ू'),
  '+': e('sign', 'ं'),
  '\\': e('halant', '्'),

  // R-forms: chart shows two r-form glyphs but I cannot confirm which key is which
  '{': e('reph', 'र्', 'Chart shows an r-form; unsure if { is reph or rakar'),
  '|': e('rakar', '्र', 'Chart shows an r-form; unsure if | is rakar or reph'),

  // Other consonants and punctuation
  ';': e('consonant', 'स'),
  ':': e('half', 'स्'),
  '/': e('consonant', 'र'),
  '`': e('consonant', 'ञ'),
  '~': e('half', 'ञ्'),
  '-': e('punct', '('),
  _: e('punct', ')'),
  ',': e('punct', ','),
  '.': e('punct', '।'),
  '<': e('punct', '?'),

  // Not shown in the chart. From my memory of Preeti. Check these in Word.
  '=': e('punct', '.', 'Not in chart'),
  '>': e('consonant', 'श्र', 'Not in chart'),
  '?': e('syllable', 'रु', 'Not in chart'),
}

// ---- Multi-key sequences ----
// convert.js tries these BEFORE single keys, longest first.
export const SEQUENCE_MAP = {
  'cf]': e('vowel', 'ओ'),
  'cf}': e('vowel', 'औ'),
  cf: e('vowel', 'आ'),
  'O{': e('vowel', 'ई'),
  'P]': e('vowel', 'ऐ'),
  pm: e('vowel', 'ऊ'),
  'f]': e('matra', 'ो'),
  'f}': e('matra', 'ौ'),
  km: e('consonant', 'फ'),
  em: e('consonant', 'झ'),
  if: e('consonant', 'ष'),
  If: e('consonant', 'क्ष'),
  '0f': e('consonant', 'ण'),
}

// ---- High-code characters (outside plain ASCII) ----
// Only entries I could read clearly in the chart. Keys are the characters
// themselves (Alt codes are Windows-1252 positions).
export const HIGH_MAP = {
  'ª': e('consonant', 'ङ'),
  '£': e('half', 'घ्'),
  '¢': e('consonant', 'द्ध'),
  'å': e('consonant', 'द्व'),
  '›': e('consonant', 'द्र'),
  '„': e('consonant', 'ध्र'),
  'Ì': e('consonant', 'न्न'),
  '§': e('consonant', 'ट्ट'),
  'Ý': e('consonant', 'ट्ठ'),
  '¶': e('consonant', 'ठ्ठ'),
  '•': e('consonant', 'ड्ड'),
  'ß': e('consonant', 'द्म'),
  '¿': e('syllable', 'रू'),
  'ç': e('vowel', 'ॐ'),
  '¡': e('half', 'ज्ञ्', 'Glyph small in chart'),

  // Punctuation
  'Û': e('punct', '!'),
  'Ù': e('punct', ';'),
  'Ú': e('punct', '’'),
  '…': e('punct', '‘'),
  'æ': e('punct', '“'),
  'Æ': e('punct', '”'),
  '÷': e('punct', '/'),
  '±': e('punct', '+'),
  'Ö': e('punct', '='),
  'Ü': e('punct', '%'),
}