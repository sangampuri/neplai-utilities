import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import PatroRail from './components/PatroRail.jsx'
import Converter from './pages/Converter.jsx'
import Dates from './pages/Dates.jsx'
import Calendar from './pages/Calendar.jsx'
import DataCheck from './pages/DataCheck.jsx'

export default function App() {
  return (
    <>
      {/* First focusable element on every page: lets keyboard users jump past the navbar. */}
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Navbar />
      <PatroRail />
      {/* tabIndex -1 lets the skip link move focus here in all browsers. */}
      <main id="main" tabIndex={-1}>
        <Routes>
          {/* "/" has no tool of its own, so send visitors to the converter. */}
          <Route path="/" element={<Navigate to="/converter" replace />} />
          <Route path="/converter" element={<Converter />} />
          <Route path="/dates" element={<Dates />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/data-check" element={<DataCheck />} />
          {/* Unknown URLs also go to the converter for now. */}
          <Route path="*" element={<Navigate to="/converter" replace />} />
        </Routes>
      </main>
    </>
  )
}