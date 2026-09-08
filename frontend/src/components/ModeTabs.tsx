import { useNavigate } from 'react-router-dom'
import type { UserRole } from '../store'

// Три «квитка» сверху: выбираешь, кто ты — под ними открывается твой кабинет.
const MODES: { key: UserRole; label: string; icon: string }[] = [
  { key: 'operator', label: 'Я оператор', icon: '🚁' },
  { key: 'company', label: 'Я компания', icon: '🏢' },
  { key: 'customer', label: 'Я заказчик', icon: '🔍' },
]

export default function ModeTabs({ mode, onChange }: { mode: UserRole; onChange: (m: UserRole) => void }) {
  const nav = useNavigate()
  return (
    <div className="modetabs">
      <div className="modetabs-in">
        {MODES.map((m) => (
          <button
            key={m.key}
            className={`modetab${mode === m.key ? ' on' : ''}`}
            onClick={() => { onChange(m.key); nav('/') }}>
            <span className="mt-ic">{m.icon}</span>{m.label}
          </button>
        ))}
      </div>
    </div>
  )
}
