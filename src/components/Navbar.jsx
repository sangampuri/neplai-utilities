import { NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'
import '../styles/navbar.css'

// One place to define the tools. Adding a page later means adding a line here.
const links = [
  { to: '/converter', label: 'Preeti / Unicode' },
  { to: '/dates', label: 'Date converter' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/data-check', label: 'Data check' },
]

export default function Navbar() {
  return (
    <header className="site-header">
      <p className="site-name">[YOUR SITE NAME]</p>
      <nav aria-label="Main">
        <ul>
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to}>{link.label}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <ThemeToggle />
    </header>
  )
}