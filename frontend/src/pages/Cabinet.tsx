import { Link } from 'react-router-dom'
import OperatorAnketa from '../components/OperatorAnketa'
import CompanyProfileView from '../components/CompanyProfile'
import CustomerProfileView from '../components/CustomerProfile'
import type { UserRole } from '../store'

export default function Cabinet({ mode }: { mode: UserRole }) {
  const role = mode
  const title = role === 'operator' ? 'Моя анкета' : role === 'company' ? 'Профиль компании' : 'Профиль заказчика'

  return (
    <div className="page">
      <h1>{title}</h1>
      <p className="lead">Переключить роль можно вкладками вверху страницы.</p>

      {role === 'operator' && <OperatorAnketa />}
      {role === 'company' && <CompanyProfileView />}
      {role === 'customer' && <CustomerProfileView />}

      <div style={{ height: 16 }} />
      <Link to="/" className="btn block ghost" style={{ display: 'block', textAlign: 'center' }}>← На главную</Link>
    </div>
  )
}
