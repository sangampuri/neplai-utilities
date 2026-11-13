import { describe, it, expect } from 'vitest'
import { describeFlags } from '../src/lib/flagContext.js'

const flags = [
  { index: 5, length: 1, kind: 'uncertain', note: 'n1', source: 'l' },
  { index: 2, length: 1, kind: 'unsupported', note: 'n2', source: '2' },
]

describe('describeFlags', () => {
  it('hides uncertain flags by default', () => {
    const { items, total } = describeFlags('abcdefghij', flags)
    expect(total).toBe(1)
    expect(items[0].source).toBe('2')
  })

  it('includes uncertain flags when asked, sorted by position', () => {
    const { items, total } = describeFlags('abcdefghij', flags, { includeUncertain: true })
    expect(total).toBe(2)
    expect(items.map((item) => item.source)).toEqual(['2', 'l'])
  })

  it('shows context on both sides of the flagged text', () => {
    const one = [{ index: 5, length: 1, kind: 'unsupported', note: 'n', source: 'x' }]
    const { items } = describeFlags('abcdefghij', one)
    expect(items[0]).toMatchObject({ before: 'abcde', marked: 'f', after: 'ghij' })
  })

  it('respects the limit but reports the full total', () => {
    const many = Array.from({ length: 150 }, (_, i) => ({
      index: i,
      length: 1,
      kind: 'unsupported',
      note: 'n',
      source: 'x',
    }))
    const { items, total } = describeFlags('x'.repeat(150), many, { limit: 100 })
    expect(items).toHaveLength(100)
    expect(total).toBe(150)
  })

  it('collapses newlines in the context', () => {
    const one = [{ index: 3, length: 1, kind: 'unsupported', note: 'n', source: ';' }]
    const { items } = describeFlags('a\nb;c', one)
    expect(items[0].before).toBe('a b')
  })
})