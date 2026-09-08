import { useNavigate, useLocation } from 'react-router-dom'

// Кнопка «Назад» на всех страницах, кроме главной кабинета.
export default function BackBar() {
  const nav = useNavigate()
  const { pathname } = useLocation()
  if (pathname === '/') return null
  return (
    <div className="backbar">
      <button onClick={() => nav(-1)}>‹ Назад</button>
    </div>
  )
}
