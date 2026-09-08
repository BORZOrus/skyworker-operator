import { Link, useLocation } from 'react-router-dom'
import type { UserRole } from '../store'

// Нижняя навигация — универсальная. Разделы конкретной роли живут на Главной
// (домашнем экране кабинета), чтобы не дублировать навигацию.
export default function TabBar({ mode: _mode }: { mode?: UserRole }) {
  const { pathname } = useLocation()
  const on = (p: string) => (pathname === p ? 'on' : '')
  return (
    <nav className="tabbar">
      <Link to="/" className={on('/')}><span className="ti">🏠</span>Главная</Link>
      <Link to="/catalog" className={on('/catalog')}><span className="ti">🗂</span>Каталог</Link>
      <Link to="/board" className={on('/board')}><span className="ti">📌</span>Доска</Link>
      <Link to="/requests" className={on('/requests')}><span className="ti">📨</span>Отклики</Link>
      <Link to="/cabinet" className={on('/cabinet')}><span className="ti">👤</span>Профиль</Link>
    </nav>
  )
}
