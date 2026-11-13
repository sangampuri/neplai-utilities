// Checks WCAG 2.x contrast ratios for the color pairs used on the site.
// Run: node scripts/contrast-check.mjs
//
// The hex values below are COPIES of the ones in src/styles/tokens.css and
// src/styles/navbar.css. If you change a color there, change it here too.

const themes = {
  light: {
    navbar: '#334155',
    background: '#F1F5F9',
    card: '#FFFFFF',
    heading: '#0F172A',
    bodyText: '#475569',
    inputBorder: '#64748B',
    primary: '#0369A1',
    buttonText: '#FFFFFF',
    buttonHover: '#075985',
    focusRing: '#0284C7',
    navbarText: '#F1F5F9',
    accent: '#B91C1C',
    headerFocusRing: '#7DD3FC', // override in navbar.css
  },
  dark: {
    navbar: '#020617',
    background: '#0F172A',
    card: '#1E293B',
    heading: '#F1F5F9',
    bodyText: '#CBD5E1',
    inputBorder: '#64748B',
    primary: '#38BDF8',
    buttonText: '#0F172A',
    buttonHover: '#7DD3FC',
    focusRing: '#38BDF8',
    navbarText: '#F1F5F9',
    accent: '#FCA5A5',
    headerFocusRing: '#7DD3FC',
  },
}

// Each pair: [description, foreground key, background key, minimum ratio].
// 4.5 = normal text. 3 = borders, focus rings, UI component edges.
const pairs = [
  ['Heading on page background', 'heading', 'background', 4.5],
  ['Heading on card', 'heading', 'card', 4.5],
  ['Body text on page background', 'bodyText', 'background', 4.5],
  ['Body text on card', 'bodyText', 'card', 4.5],
  ['Navbar text on navbar', 'navbarText', 'navbar', 4.5],
  ['Button text on primary button', 'buttonText', 'primary', 4.5],
  ['Button text on hover button', 'buttonText', 'buttonHover', 4.5],
  ['Accent text (Saturday) on page background', 'accent', 'background', 4.5],
  ['Accent text (Saturday) on card', 'accent', 'card', 4.5],
  ['Input border on card', 'inputBorder', 'card', 3],
  ['Input border on page background', 'inputBorder', 'background', 3],
  ['Focus ring on card', 'focusRing', 'card', 3],
  ['Focus ring on page background', 'focusRing', 'background', 3],
  ['Focus ring on navbar (header override)', 'headerFocusRing', 'navbar', 3],
  ['Navbar text as toggle border on navbar', 'navbarText', 'navbar', 3],
  // Selected toggle: the fill alone fails in light theme (1.75:1), so the
  // inset line in navbar text color is what must stand out from the navbar.
  ['Selected toggle inset line on navbar', 'navbarText', 'navbar', 3],
  ['Primary button edge on card', 'primary', 'card', 3],
  ['Primary button edge on page background', 'primary', 'background', 3],
  ['Accent underline on card', 'accent', 'card', 3],
]

// WCAG relative luminance of a "#RRGGBB" color.
function luminance(hex) {
  const channels = [1, 3, 5].map((start) => {
    const value = parseInt(hex.slice(start, start + 2), 16) / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrastRatio(hexA, hexB) {
  const lighter = Math.max(luminance(hexA), luminance(hexB))
  const darker = Math.min(luminance(hexA), luminance(hexB))
  return (lighter + 0.05) / (darker + 0.05)
}

let failures = 0

for (const [themeName, colors] of Object.entries(themes)) {
  console.log(`\n=== ${themeName.toUpperCase()} THEME ===`)
  for (const [description, fgKey, bgKey, minimum] of pairs) {
    const fg = colors[fgKey]
    const bg = colors[bgKey]
    const ratio = contrastRatio(fg, bg)
    const passed = ratio >= minimum
    if (!passed) failures += 1
    console.log(
      `${passed ? 'PASS' : 'FAIL'}  ${ratio.toFixed(2).padStart(5)}:1  (need ${minimum})  ${description}  [${fg} on ${bg}]`,
    )
  }
}

console.log(failures === 0 ? '\nAll pairs pass.' : `\n${failures} pair(s) FAIL.`)
process.exitCode = failures === 0 ? 0 : 1