import { useState } from 'react'
import { Link } from 'react-router-dom'
import { OPERATORS, type Profile } from '../data'
import { ProfileModal, ContactModal, pimg } from '../components/profiles'

// «Мой профиль» для демо — берём готового оператора
const ME = OPERATORS[0]

export default function Cabinet() {
  const [avail, setAvail] = useState('open')
  const [open, setOpen] = useState<Profile | null>(null)
  const [contact, setContact] = useState<Profile | null>(null)

  return (
    <div className="page">
      <h1>Личный кабинет</h1>
      <p className="lead">Демо кабинета оператора. Так выглядит ваш профиль и управление им.</p>

      <div className="fgroup-title" style={{ marginBottom: 8 }}>Статус доступности</div>
      <div className="availbar">
        <button className={avail === 'open' ? 'on' : ''} onClick={() => setAvail('open')}>Открыт</button>
        <button className={avail === 'busy' ? 'on' : ''} onClick={() => setAvail('busy')}>Занят</button>
        <button className={avail === 'dnd' ? 'on' : ''} onClick={() => setAvail('dnd')}>Не беспокоить</button>
      </div>

      <div className="fgroup-title" style={{ marginBottom: 8 }}>Моя карточка</div>
      <div className="mycard" onClick={() => setOpen(ME)}>
        <img src={pimg(ME.photo)} alt="" />
        <div className="mycard-body">
          <b>{ME.name}</b>
          <div className="reg">📍 {ME.region} · ★ {ME.rate} ({ME.rev})</div>
          <div className="mycard-hint">Открыть как видят заказчики →</div>
        </div>
      </div>

      <div className="cabmenu">
        <a>🖼 Портфолио <span className="arr">›</span></a>
        <a>🎖 Допуски и документы <span className="arr">›</span></a>
        <a>🚁 Оборудование <span className="arr">›</span></a>
        <a>📩 Отклики и приглашения <span className="arr">2 ›</span></a>
        <a>⭐ Отзывы обо мне <span className="arr">›</span></a>
        <a>⚙️ Настройки и роли <span className="arr">›</span></a>
      </div>

      <Link to="/" className="btn block ghost" style={{ display: 'block', textAlign: 'center' }}>← В каталог</Link>

      {open && <ProfileModal p={open} onClose={() => setOpen(null)} onContact={(p) => { setOpen(null); setContact(p) }} />}
      {contact && <ContactModal p={contact} onClose={() => setContact(null)} />}
    </div>
  )
}
