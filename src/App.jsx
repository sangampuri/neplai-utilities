import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Converter from './pages/Converter.jsx'
import Dates from './pages/Dates.jsx'
import Calendar from './pages/Calendar.jsx'
import DataCheck from './pages/DataCheck.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <main id="main">
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