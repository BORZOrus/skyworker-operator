import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Profile } from '../data'
import { profileCompleteness } from '../data'
import { isFavorite, toggleFavorite, addRequest, isRegistered } from '../store'
import AuthGate from './AuthGate'
import PhoneInput from './PhoneInput'
import ComplaintModal from './ComplaintModal'

const BASE = import.meta.env.BASE_URL
export const pimg = (f: string) => `${BASE}portfolio/${f}`

// Рейтинг и отзывы — только у исполнителей (оказывают услуги).
// У операторов (ищут работу) рейтинга нет: плохой отзыв → удалят анкету.
export const isRated = (p: Profile) => !p.type.startsWith('Оператор')

// Определяем тип соцсети по ссылке — иконка + название
export function socialMeta(url: string): { icon: string; label: string; href: string } {
  const u = url.trim().replace(/^https?:\/\//, '')
  const href = 'https://' + u
  const d = u.toLowerCase()
  if (d.includes('instagram')) return { icon: '📷', label: 'Instagram', href }
  if (d.includes('tiktok')) return { icon: '🎵', label: 'TikTok', href }
  if (d.includes('youtube') || d.includes('youtu.be')) return { icon: '▶️', label: 'YouTube', href }
  if (d.includes('facebook') || d.includes('fb.com')) return { icon: '👥', label: 'Facebook', href }
  if (d.includes('t.me') || d.includes('telegram')) return { icon: '✈️', label: 'Telegram', href }
  if (d.includes('vk.com')) return { icon: '🅥', label: 'VK', href }
  if (d.includes('wa.me') || d.includes('whatsapp')) return { icon: '💬', label: 'WhatsApp', href }
  return { icon: '🔗', label: 'Соцсеть', href }
}

// Демо-отзывы (позже — реальные из API)
const REVIEWS = [
  { a: 'Ерлан, ТОО «Агрофирма»', t: 'Обработали 800 га за два дня, без огрехов. Приехали вовремя, всё по договорённости.', r: 5 },
  { a: 'Марат, крестьянское хозяйство', t: 'Аккуратный специалист, культуру не повредили. Рекомендую.', r: 5 },
  { a: 'Айгуль, застройщик', t: 'Сняли объект, материалы прислали в тот же день. Качество отличное.', r: 4 },
]

export function FavButton({ id, big }: { id: string; big?: boolean }) {
  const [fav, setFav] = useState(isFavorite(id))
  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFav(toggleFavorite(id).includes(id))
  }
  if (big) return <button className="btn ghost" onClick={onClick}>{fav ? '♥ В избранном' : '♡ В избранное'}</button>
  return <button className="fav" onClick={onClick} aria-label="В избранное">{fav ? '♥' : '♡'}</button>
}

export function ProfileCard({ p, onOpen }: { p: Profile; onOpen: (p: Profile) => void }) {
  const fill = profileCompleteness(p)
  return (
    <div className="card" onClick={() => onOpen(p)}>
      <div className="ph">
        <img className="cover" src={pimg(p.photo)} alt={p.name} loading="lazy" />
        <FavButton id={p.id} />
        <div className="vbadge">✓ допуск</div>
        {fill >= 80 && <div className="fullbadge">★ Полный профиль</div>}
      </div>
      <div className="cb">
        <div className={`price ${p.priceRequest ? 'req' : ''}`}>{p.price} {p.unit && <small>{p.unit}</small>}</div>
        <div className="nm">{p.name}</div>
        {isRated(p)
          ? <div className="rt"><span className="st">★</span>{p.rate}<span className="rev">({p.rev})</span></div>
          : <div className="rt muted-exp">🕓 {p.exp || 'опыт в профиле'}</div>}
        <div className="reg">📍 {p.city ? `${p.city}, ${p.region}` : p.region}</div>
        {p.works && p.works.length > 0 && (
          <div className="chips">{p.works.slice(0, 3).map((w) => <span className="chip" key={w}>{w}</span>)}</div>
        )}
      </div>
    </div>
  )
}

export function ProfileModal({ p, onClose, onContact }: { p: Profile; onClose: () => void; onContact: (p: Profile) => void }) {
  const reviews = REVIEWS.slice(0, p.rev > 20 ? 3 : 2)
  const [complain, setComplain] = useState(false)
  return (
    <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="mhero">
          <img className="cover" src={pimg(p.photo)} alt={p.name} />
          <button className="mclose" onClick={onClose}>✕</button>
          <div className="vbadge">✓ допуск подтверждён</div>
        </div>
        <div className="mbody">
          <div>
            <div className="mname">{p.name}</div>
            <div className="msub">{p.type} · 📍 {p.city ? `${p.city}, ${p.region}` : p.region}</div>
            {isRated(p) && <div className="rt" style={{ marginTop: 8 }}><span className="st">★</span>{p.rate}<span className="rev">· {p.rev} отзывов</span></div>}
            <div className="mprice" style={{ marginTop: 8 }}>{p.price} {p.unit && <small style={{ fontSize: 13, color: 'var(--muted)' }}>{p.unit}</small>}</div>
          </div>
          <div className="sec"><h4>Направления</h4><div className="badges">{p.dirs.map((d) => <span className="badge gray" key={d}>{d}</span>)}</div></div>
          {p.crops && p.crops.length > 0 && (
            <div className="sec"><h4>Культуры</h4><div className="badges">{p.crops.map((c) => <span className="badge gray" key={c}>🌾 {c}</span>)}</div></div>
          )}
          <div className="sec"><h4>Допуски</h4><div className="badges"><span className="badge">{p.cat}</span>{p.pilot !== '—' && <span className="badge">{p.pilot}</span>}</div></div>
          {(p.vat || p.legal) && (
            <div className="sec"><h4>Документы и оплата</h4><div className="badges">
              {p.legal && <span className="badge gray">{p.legal}</span>}
              {p.vat && <span className={`badge${p.vat.includes('без') || p.vat.includes('Без') ? ' gray' : ''}`}>{p.vat}</span>}
            </div></div>
          )}
          {p.specs ? (
            <div className="sec"><h4>Характеристики</h4>
              <div className="specs">{p.specs.map((s) => <div className="srow" key={s[0]}><span>{s[0]}</span><b>{s[1]}</b></div>)}</div>
            </div>
          ) : (
            <>
              <div className="sec"><h4>Оборудование</h4><div className="msub" style={{ color: 'var(--ink)' }}>{p.equip}</div></div>
              <div className="sec"><h4>Опыт</h4><div className="msub" style={{ color: 'var(--ink)' }}>{p.exp}</div></div>
            </>
          )}
          {p.services && <div className="sec"><h4>Услуги</h4><div className="msub" style={{ color: 'var(--ink)' }}>{p.services}</div></div>}
          <div className="sec"><h4>О себе</h4><div className="msub" style={{ color: 'var(--ink)' }}>{p.about}</div></div>
          {(p.site || (p.socials && p.socials.length > 0)) && (
            <div className="sec"><h4>Сайт и соцсети</h4>
              <div className="badges">
                {p.site && <a className="badge link" href={`https://${p.site.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer">🌐 {p.site}</a>}
                {(p.socials || []).map((s) => {
                  const m = socialMeta(s)
                  return <a className="badge link" key={s} href={m.href} target="_blank" rel="noreferrer">{m.icon} {m.label}</a>
                })}
              </div>
            </div>
          )}
          <div className="sec"><h4>Портфолио</h4>
            <div className="gallery">
              {(p.gallery && p.gallery.length ? p.gallery : [p.photo]).map((g, i) => <img key={i} src={pimg(g)} alt="" loading="lazy" />)}
            </div>
          </div>
          {isRated(p) && (
            <div className="sec"><h4>Отзывы</h4>
              <div className="reviews">
                {reviews.map((rv, i) => (
                  <div className="review" key={i}>
                    <div className="review-head"><b>{rv.a}</b><span className="st">{'★'.repeat(rv.r)}</span></div>
                    <div className="review-text">{rv.t}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button className="complain-link" onClick={() => setComplain(true)}>⚠ Пожаловаться на анкету</button>
        </div>
        <div className="mfoot">
          <FavButton id={p.id} big />
          <button className="btn" onClick={() => onContact(p)}>Связаться</button>
        </div>
      </div>
      {complain && <ComplaintModal targetId={p.id} targetName={p.name} onClose={() => setComplain(false)} />}
    </div>
  )
}

export function ContactModal({ p, onClose }: { p: Profile; onClose: () => void }) {
  const [sent, setSent] = useState(false)
  const [msg, setMsg] = useState('')
  const [reg, setReg] = useState(isRegistered())

  if (!reg) {
    return (
      <AuthGate
        reason={`Чтобы связаться с «${p.name}» и увидеть контакты — оставьте телефон. 20 секунд, полную анкету заполните позже.`}
        onClose={onClose}
        onDone={() => setReg(true)}
      />
    )
  }

  const submit = () => {
    addRequest({ profileId: p.id, profileName: p.name, region: p.city ? `${p.city}, ${p.region}` : p.region, message: msg, createdAt: new Date().toLocaleString('ru-RU') })
    setSent(true)
  }
  return (
    <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="mbody">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="mname" style={{ fontSize: 20 }}>{sent ? 'Запрос отправлен' : 'Связаться'}</div>
            <button className="mclose" style={{ position: 'static' }} onClick={onClose}>✕</button>
          </div>
          {sent ? (
            <>
              <div className="note">Запрос передан исполнителю «{p.name}». Он свяжется с вами через платформу. История — в разделе «Заявки».</div>
              <div className="stub"><div className="big">✓</div>Так мы фиксируем каждый контакт и не теряем заявки. Исполнитель получает уведомление и отвечает вам.</div>
              <button className="btn block" onClick={onClose}>Готово</button>
            </>
          ) : (
            <>
              <div className="msub" style={{ color: 'var(--ink)' }}>Исполнитель: <b>{p.name}</b> · {p.city ? `${p.city}, ${p.region}` : p.region}</div>
              <div className="note">Контакты откроются после отправки запроса. Связь идёт через платформу — так вы не теряете переписку, а исполнитель не получает спам на личный номер.</div>
              <div className="field"><label>Ваше имя</label><input placeholder="Как к вам обращаться" /></div>
              <div className="field"><label>Телефон / WhatsApp</label><PhoneInput /></div>
              <div className="field"><label>Что нужно сделать</label><textarea rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Опишите задачу: направление, объём, регион, сроки" style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 12, fontSize: 15, fontFamily: 'inherit', resize: 'vertical' }} /></div>
              <label className="check consent"><input type="checkbox" defaultChecked /> <span>Согласен на обработку персональных данных и передачу запроса исполнителю согласно <Link to="/privacy" style={{ color: 'var(--accent)', fontWeight: 600 }}>Политике конфиденциальности</Link>.</span></label>
              <button className="btn block" onClick={submit}>Отправить запрос</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
