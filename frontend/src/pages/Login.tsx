import { Link } from 'react-router-dom'
import PhoneInput from '../components/PhoneInput'

export default function Login() {
  return (
    <div className="page">
      <h1>Вход</h1>
      <p className="lead">Смотреть каталог можно без входа. Вход нужен, чтобы связаться с оператором или разместить заявку.</p>
      <div className="field"><label>Телефон</label><PhoneInput /></div>
      <div className="field"><label>Код из SMS</label><input placeholder="— — — —" /></div>
      <div style={{ height: 8 }} />
      <Link to="/cabinet" className="btn block" style={{ display: 'block', textAlign: 'center' }}>Войти</Link>
      <div className="center-note">Нет аккаунта? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Зарегистрироваться</Link></div>
    </div>
  )
}
