import { useMemo, useRef, useState } from 'react'
import TextPane from '../components/TextPane.jsx'
import useDebouncedValue from '../hooks/useDebouncedValue.js'
import { convertPreetiToUnicode } from '../lib/convert.js'
import { describeFlags } from '../lib/flagContext.js'
import '../styles/converter.css'

const DEBOUNCE_THRESHOLD = 50000 // characters; above this, conversion waits for a pause
const DEBOUNCE_MS = 300
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const REVIEW_LIMIT = 100

export default function Converter() {
  const [input, setInput] = useState('')
  const [includeUncertain, setIncludeUncertain] = useState(false)
  const [status, setStatus] = useState('')
  const fileInputRef = useRef(null)

  // Small inputs convert on every keystroke. Large ones wait for a pause.
  const settledInput = useDebouncedValue(input, input.length > DEBOUNCE_THRESHOLD ? DEBOUNCE_MS : 0)

  // Recomputed only when the settled input changes, not on unrelated re-renders.
  const { text: output, flags } = useMemo(() => convertPreetiToUnicode(settledInput), [settledInput])

  const review = useMemo(
    () => describeFlags(output, flags, { includeUncertain, limit: REVIEW_LIMIT }),
    [output, flags, includeUncertain],
  )

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output)
      setStatus('Copied to clipboard.')
    } catch {
      setStatus('Copy failed. Select the output text and copy it by hand.')
    }
  }

  function handleClear() {
    setInput('')
    setStatus('Cleared.')
  }

  function handleDownload() {
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'unicode.txt'
    link.click()
    URL.revokeObjectURL(url)
    setStatus('Downloaded unicode.txt.')
  }

  async function handleUpload(event) {
    const file = event.target.files[0]
    event.target.value = '' // lets the same file be chosen again later
    if (!file) return

    const looksLikeText = file.name.toLowerCase().endsWith('.txt') && (file.type === '' || file.type === 'text/plain')
    if (!looksLikeText) {
      setStatus('Only .txt files are accepted.')
      return
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setStatus('File is larger than 5 MB.')
      return
    }

    try {
      setInput(await file.text()) // read locally; the file never leaves the browser
      setStatus(`Loaded ${file.name}.`)
    } catch {
      setStatus('Could not read that file.')
    }
  }

  return (
    <section className="converter">
      <h1>Preeti to Unicode converter</h1>

      <p className="notice">
        Draft: the Preeti key mapping is not yet verified against a real Preeti font. Check
        important text yourself.
      </p>

      <div className="toolbar">
        <button type="button" className="button button-secondary" onClick={() => fileInputRef.current.click()}>
          Upload .txt
        </button>
        <button type="button" className="button button-secondary" onClick={handleClear} disabled={input === ''}>
          Clear
        </button>
        <button type="button" className="button" onClick={handleCopy} disabled={output === ''}>
          Copy result
        </button>
        <button type="button" className="button" onClick={handleDownload} disabled={output === ''}>
          Download .txt
        </button>
        <input ref={fileInputRef} type="file" accept=".txt,text/plain" onChange={handleUpload} hidden />
      </div>

      <div className="converter-panes">
        <TextPane
          id="preeti-input"
          label="Preeti text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="preeti-input"
          describedBy="font-note"
        />
        <TextPane id="unicode-output" label="Unicode result" value={output} readOnly lang="ne" />
      </div>

      <p id="font-note" className="hint">
        The Preeti box shows Devanagari only if a Preeti font is installed on your computer.
        Otherwise you see plain letters, which is normal.
      </p>

      {input.length > DEBOUNCE_THRESHOLD && (
        <p className="hint">Large text: conversion runs after you stop typing.</p>
      )}

      <p role="status" className="status">
        {status}
      </p>

      <section aria-labelledby="review-heading" className="review">
        <h2 id="review-heading">Characters to check ({review.total})</h2>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={includeUncertain}
            onChange={(event) => setIncludeUncertain(event.target.checked)}
          />
          Include uncertain mappings
        </label>

        {review.total === 0 ? (
          <p>Nothing to check.</p>
        ) : (
          <>
            <ul>
              {review.items.map((item) => (
                <li key={item.key}>
                  <span lang="ne">
                    {item.before}
                    <mark>{item.marked}</mark>
                    {item.after}
                  </span>
                  <span className="review-note">
                    {' '}
                    {item.kind === 'unsupported' ? 'Unsupported' : 'Uncertain'}, key{' '}
                    <code>{item.source}</code>: {item.note}
                  </span>
                </li>
              ))}
            </ul>
            {review.total > REVIEW_LIMIT && <p>Showing the first {REVIEW_LIMIT} of {review.total}.</p>}
          </>
        )}
      </section>

      <p className="privacy">
        Privacy: conversion runs entirely in your browser. Your text is never sent anywhere
        and is not stored.
      </p>
    </section>
  )
}