// Preeti -> Unicode conversion logic. No React in this file.
//
// STATUS: DRAFT. Correctness depends on src/lib/mapping.js, which is unverified.
// See the mapping file header for what has and has not been checked.
//
// Output: { text, flags }
//   text   the converted Unicode string
//   flags  list of { index, length, kind, note, source }
//            index, length  position in `text` that the flag covers
//            kind           'unsupported' (character not in the mapping, kept as is)
//                           'uncertain'   (mapping entry carries a doubt note)
//            note           short explanation
//            source         the original Preeti key(s)

import { KEY_MAP, SEQUENCE_MAP, HIGH_MAP } from './mapping.js'

const REPH = 'र्' // र + halant (2 UTF-16 units)
const PREMATRA_I = 'ि'
const LONGEST_SEQUENCE = Math.max(...Object.keys(SEQUENCE_MAP).map((key) => key.length))

function isDevanagari(char) {
  const code = char.codePointAt(0)
  return code >= 0x0900 && code <= 0x097f
}

function isWhitespace(char) {
  return /\s/.test(char)
}

// Read one token starting at `pos`.
// Returns { entry, source, length }. entry is null when nothing in the maps matches.
function readToken(input, pos) {
  // 1. Longest multi-key sequence first. "if" must win over "i" + "f".
  const maxLength = Math.min(LONGEST_SEQUENCE, input.length - pos)
  for (let length = maxLength; length >= 2; length -= 1) {
    const candidate = input.slice(pos, pos + length)
    if (Object.hasOwn(SEQUENCE_MAP, candidate)) {
      return { entry: SEQUENCE_MAP[candidate], source: candidate, length }
    }
  }

  // 2. Single character. codePointAt keeps characters outside the BMP whole.
  const char = String.fromCodePoint(input.codePointAt(pos))
  if (Object.hasOwn(HIGH_MAP, char)) {
    return { entry: HIGH_MAP[char], source: char, length: char.length }
  }
  if (Object.hasOwn(KEY_MAP, char)) {
    return { entry: KEY_MAP[char], source: char, length: char.length }
  }
  return { entry: null, source: char, length: char.length }
}

function doubtFlag(entry, source) {
  return entry.doubt ? { kind: 'uncertain', note: entry.doubt, source } : null
}

export function convertPreetiToUnicode(input) {
  const closedClusters = [] // finished clusters, joined at the end
  const flags = []
  let closedLength = 0 // total length of finished clusters

  // The cluster being built. Reph and ि positions are decided inside it.
  let cluster = ''
  let clusterFlags = [] // flags with `offset` relative to the cluster start
  let clusterIsConsonantal = false // true if it holds a consonant (reph can attach)

  let joining = false // true right after a half letter or halant: next consonant joins
  let pendingPrematra = null // { entry, source } while ि waits for its consonant

  function closeCluster() {
    if (cluster === '') return
    for (const flag of clusterFlags) {
      const { offset, ...rest } = flag
      flags.push({ index: closedLength + offset, ...rest })
    }
    closedClusters.push(cluster)
    closedLength += cluster.length
    cluster = ''
    clusterFlags = []
    clusterIsConsonantal = false
  }

  function append(text, flag) {
    if (flag) {
      clusterFlags.push({ offset: cluster.length, length: text.length, ...flag })
    }
    cluster += text
  }

  // ि that never found a consonant (end of text, space, etc.): write it as is.
  function flushPendingPrematra() {
    if (!pendingPrematra) return
    append(PREMATRA_I, {
      kind: 'uncertain',
      note: 'ि had no consonant after it',
      source: pendingPrematra.source,
    })
    pendingPrematra = null
  }

  let pos = 0
  while (pos < input.length) {
    const { entry, source, length } = readToken(input, pos)
    pos += length

    // Not in any map: keep it. Whitespace and Devanagari pass silently (rule 7);
    // anything else is flagged unsupported (rule 8).
    if (!entry) {
      flushPendingPrematra()
      closeCluster()
      const passes = isWhitespace(source) || isDevanagari(source)
      append(
        source,
        passes ? null : { kind: 'unsupported', note: 'not in the Preeti mapping', source },
      )
      joining = false
      continue
    }

    switch (entry.type) {
      case 'prematra':
        // ि starts a new syllable. Close the previous one, then wait.
        flushPendingPrematra()
        closeCluster()
        pendingPrematra = { entry, source }
        joining = false
        break

      case 'consonant':
      case 'syllable':
        // A consonant joins the current cluster only after a half letter or halant.
        if (!joining) closeCluster()
        clusterIsConsonantal = true
        append(entry.out, doubtFlag(entry, source))
        if (pendingPrematra) {
          // The cluster is complete: write ि after its last consonant.
          append(PREMATRA_I, doubtFlag(pendingPrematra.entry, pendingPrematra.source))
          pendingPrematra = null
        }
        joining = false
        break

      case 'half':
        if (!joining) closeCluster()
        clusterIsConsonantal = true
        append(entry.out, doubtFlag(entry, source))
        joining = true
        break

      case 'vowel':
      case 'digit':
      case 'punct':
        flushPendingPrematra()
        closeCluster()
        append(entry.out, doubtFlag(entry, source))
        joining = false
        break

      case 'matra':
      case 'sign':
      case 'rakar':
      case 'halant':
        // These attach to whatever the current cluster is.
        flushPendingPrematra()
        append(
          entry.out,
          cluster === ''
            ? { kind: 'uncertain', note: 'no consonant before it', source }
            : doubtFlag(entry, source),
        )
        joining = entry.type === 'halant'
        break

      case 'reph': {
        flushPendingPrematra()
        if (cluster !== '' && clusterIsConsonantal) {
          // Reph is typed after the cluster but written before it.
          cluster = REPH + cluster
          for (const flag of clusterFlags) flag.offset += REPH.length
          const doubt = doubtFlag(entry, source)
          if (doubt) {
            clusterFlags.unshift({ offset: 0, length: REPH.length, ...doubt })
          }
        } else {
          closeCluster()
          append(REPH, {
            kind: 'uncertain',
            note: 'reph had no consonant before it',
            source,
          })
        }
        joining = false
        break
      }

      default:
        // A type that mapping.js uses but this switch does not know.
        // Keep the source text and flag it, never drop input silently.
        flushPendingPrematra()
        closeCluster()
        append(source, { kind: 'unsupported', note: `unknown entry type: ${entry.type}`, source })
        joining = false
    }
  }

  flushPendingPrematra()
  closeCluster()

  return { text: closedClusters.join(''), flags }
}