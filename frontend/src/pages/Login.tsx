import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div className="page">
      <h1>Вход</h1>
      <p className="lead">Смотреть каталог можно без входа. Вход нужен, чтобы связаться с оператором или разместить заявку.</p>
      <div className="field"><label>Телефон</label><input placeholder="+7 ___ ___ __ __" /></div>
      <div className="field"><label>Код из SMS</label><input placeholder="— — — —" /></div>
      <div style={{ height: 8 }} />
      <Link to="/cabinet" className="btn block" style={{ display: 'block', textAlign: 'center' }}>Войти</Link>
      <div className="center-note">Нет аккаунта? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Зарегистрироваться</Link></div>
    </div>
  )
}
