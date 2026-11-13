import { useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'
const VALID_THEMES = ['auto', 'light', 'dark']

// Read the saved choice. Any failure or unknown value means "auto".
function readStoredTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return VALID_THEMES.includes(saved) ? saved : 'auto'
  } catch {
    return 'auto' // localStorage can be blocked in private or locked-down browsers
  }
}

// Returns [theme, setTheme]. theme is 'auto', 'light' or 'dark'.
export default function useTheme() {
  const [theme, setTheme] = useState(readStoredTheme)

  useEffect(() => {
    const root = document.documentElement

    // Auto = no attribute, so the prefers-color-scheme rule in tokens.css applies.
    if (theme === 'auto') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', theme)
    }

    try {
      // Auto stores nothing: "no preference saved" and "follow the OS" are the same.
      if (theme === 'auto') {
        localStorage.removeItem(STORAGE_KEY)
      } else {
        localStorage.setItem(STORAGE_KEY, theme)
      }
    } catch {
      // Ignore: the theme still works for this visit, it just will not persist.
    }
  }, [theme])

  return [theme, setTheme]
}