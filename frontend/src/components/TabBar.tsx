import { Link, useLocation } from 'react-router-dom'

export default function TabBar() {
  const { pathname } = useLocation()
  const on = (p: string) => (pathname === p ? 'on' : '')
  return (
    <nav className="tabbar">
      <Link to="/" className={on('/')}><span className="ti">🗂</span>Каталог</Link>
      <Link to="/favorites" className={on('/favorites')}><span className="ti">♡</span>Избранное</Link>
      <Link to="/requests" className={on('/requests')}><span className="ti">📋</span>Заявки</Link>
      <Link to="/cabinet" className={on('/cabinet')}><span className="ti">👤</span>Профиль</Link>
    </nav>
  )
}
