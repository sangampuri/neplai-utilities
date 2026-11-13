import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Fonts: only the weights we use. Each import registers @font-face rules;
// the browser downloads a file only when text on the page needs it.
import '@fontsource/noto-sans-devanagari/400.css'
import '@fontsource/noto-sans-devanagari/700.css'
import '@fontsource/noto-serif-devanagari/400.css'
import '@fontsource/noto-serif-devanagari/700.css'

// Order matters: tokens define variables, base and controls use them.
import './styles/tokens.css'
import './styles/base.css'
import './styles/controls.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)