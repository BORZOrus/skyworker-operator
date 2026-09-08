import { Link } from 'react-router-dom'

const BASE = import.meta.env.BASE_URL

export default function Header() {
  return (
    <header className="top">
      <div className="hwrap">
        <Link to="/" className="logo">
          <img src={`${BASE}brand/logo-horizontal-black.svg`} alt="Skyworker" />
        </Link>
        <div className="hspace" />
        <Link to="/favorites" className="hicon" aria-label="Избранное">♡</Link>
        <Link to="/start" className="howlink">Как это работает</Link>
        <Link to="/login" className="btn enter">Войти</Link>
      </div>
    </header>
  )
}
