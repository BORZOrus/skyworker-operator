import { Link } from 'react-router-dom'
import { getRequests } from '../store'

export default function Requests() {
  const items = getRequests()
  return (
    <div className="page">
      <h1>Мои заявки</h1>
      {items.length === 0 ? (
        <>
          <div className="stub"><div className="big">📋</div>Здесь появятся ваши запросы исполнителям. Откройте карточку в каталоге и нажмите «Связаться».</div>
          <div style={{ height: 16 }} />
          <Link to="/" className="btn block ghost" style={{ display: 'block', textAlign: 'center' }}>← В каталог</Link>
        </>
      ) : (
        <div className="reqlist">
          {items.map((r, i) => (
            <div className="reqcard" key={i}>
              <div className="reqcard-top">
                <b>{r.profileName}</b>
                <span className="reqstatus">Отправлено</span>
              </div>
              <div className="reqmeta">📍 {r.region} · {r.createdAt}</div>
              {r.message && <div className="reqmsg">«{r.message}»</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
