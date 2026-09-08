import { useState } from 'react'
import { getDemoProfile } from '../demoData'
import { isRegistered, type BoardAd } from '../store'
import ProfileDoc from './ProfileDoc'
import DirIcon from './DirIcon'

const BASE = import.meta.env.BASE_URL
const ROLE_TAG: Record<string, string> = { operator: 'Оператор', company: 'Компания', customer: 'Заказчик' }

// Полное объявление + автор + проваливание в его профиль/портфолио.
export default function AdModal({ ad, canRespond, onRespond, onClose }: {
  ad: BoardAd; canRespond: boolean; onRespond: () => void; onClose: () => void
}) {
  const author = ad.authorId ? getDemoProfile(ad.authorId) : undefined
  const [showProfile, setShowProfile] = useState(false)
  const reg = isRegistered()

  return (
    <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="mbody">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div className="mname" style={{ fontSize: 20 }}>{showProfile ? 'Профиль автора' : ad.title}</div>
            <button className="mclose" style={{ position: 'static' }} onClick={onClose}>✕</button>
          </div>

          {showProfile && author ? (
            <>
              <button className="linklike" style={{ textAlign: 'left', margin: '0 0 10px' }} onClick={() => setShowProfile(false)}>‹ назад к объявлению</button>
              <ProfileDoc p={author} />
            </>
          ) : (
            <>
              <div className="admeta" style={{ marginTop: 6 }}>
                {ad.directions.map((d) => <span key={d}><DirIcon label={d} size={16} /> {d}</span>)}
                <span>📍 {ad.city ? `${ad.city}, ${ad.region}` : ad.region}</span>
                {ad.budget && <span>💰 {ad.budget}</span>}
              </div>
              {ad.badges && ad.badges.length > 0 && (
                <div className="adbadges" style={{ marginTop: 10 }}>{ad.badges.map((b) => <span className="adbadge" key={b}>{b}</span>)}</div>
              )}
              {ad.details && ad.details.length > 0 && (
                <div className="sec" style={{ marginTop: 12 }}><h4>Детали задачи</h4>
                  <div className="specs">{ad.details.map((d) => <div className="srow" key={d.label}><span>{d.label}</span><b>{d.value}</b></div>)}</div>
                </div>
              )}
              <p className="adbody" style={{ marginTop: 12 }}>{ad.body}</p>

              {/* Автор */}
              <div className="sec" style={{ marginTop: 6 }}><h4>Кто разместил</h4>
                <div className="ad-author-card" onClick={() => author && setShowProfile(true)} style={{ cursor: author ? 'pointer' : 'default' }}>
                  {author
                    ? <img src={`${BASE}portfolio/${author.photo}`} alt="" className={`aac-photo${author.square ? ' sq' : ''}`} />
                    : <div className="aac-photo aac-ph">{ad.author.replace(/[^А-Яа-яA-Za-z]/g, '').slice(0, 2).toUpperCase()}</div>}
                  <div className="aac-body">
                    <b>{ad.author}</b>
                    <span>{ROLE_TAG[ad.authorRole]}{author ? ' · открыть профиль ›' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Контакт */}
              <div className="sec"><h4>Контакт</h4>
                {reg
                  ? <a className="adphone" href={`tel:${ad.phone.replace(/\s/g, '')}`}>{ad.phone}</a>
                  : <div className="note" style={{ marginTop: 0 }}>🔒 Телефон откроется после регистрации (20 секунд).</div>}
              </div>

              {canRespond && <button className="btn block" onClick={onRespond}>Откликнуться</button>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
