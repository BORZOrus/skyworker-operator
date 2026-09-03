import { Link } from 'react-router-dom'

const BASE = import.meta.env.BASE_URL

export default function Header() {
  return (
    <header className="top">
      <div className="hwrap">
        <Link to="/" className="logo">
          <img src={`${BASE}brand/logo-horizontal-black.svg`} alt="SkyWorker" />
        </Link>
        <div className="geo">📍 Астана ⌄</div>
        <label className="search">🔎 <input placeholder="Поиск оператора, услуги, региона" /></label>
        <Link to="/start" className="howlink">Как это работает</Link>
        <Link to="/login" className="btn enter">Войти</Link>
      </div>
    </header>
  )
}
