# Design contrast log

Measured with `node scripts/contrast-check.mjs` (WCAG 2.x formula).
Thresholds: 4.5:1 normal text, 3:1 borders, focus rings, UI component edges.

Result of last run: all 38 checks pass (19 pairs x light and dark).

## Base palette

Used exactly as supplied. No base palette color was changed.

## Added colors

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `--navbar-text` | `#F1F5F9` | `#F1F5F9` | Text on the navbar. The palette lists a navbar background but no text color. |
| `--accent` | `#B91C1C` | `#FCA5A5` | Sindoor red. Saturday and the patro rail active month only. |

Measured: navbar text on navbar is 9.45:1 (light) and 18.41:1 (dark).
Accent text on card is 6.47:1 (light) and 7.71:1 (dark).

## Overrides

Original palette pairs that were too dim on the navbar. Values below are
hand-calculated, NOT script-verified.

| Pair | Approx. ratio | Fix | Measured after fix |
|---|---|---|---|
| Focus ring `#0284C7` on navbar `#334155` (light) | ~2.5:1 | Header-only ring `#7DD3FC` (in `navbar.css`) | 6.21:1 light, 12.10:1 dark |
| Input border `#64748B` on navbar `#334155` (light) | ~2.1:1 | Toggle border uses `--navbar-text` | 9.45:1 light, 18.41:1 dark |

Selected toggle button: fill `#0369A1` on navbar `#334155` measures 1.75:1 in
light theme (fail). Fix: 2px inset line in `--navbar-text` on the selected
button, 9.45:1 light and 18.41:1 dark. Selected state also uses bold text.

## Known thin margins

- Dark input border `#64748B` on card `#1E293B`: 3.07:1. Passes. Do not darken it.
- Light focus ring `#0284C7` on page background `#F1F5F9`: 3.74:1.

## Keeping the script in sync

`scripts/contrast-check.mjs` holds copies of the hex values. If a color changes
in `src/styles/tokens.css` or `src/styles/navbar.css`, change it in the script
too and re-run it.