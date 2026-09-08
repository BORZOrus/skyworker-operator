import { Link } from 'react-router-dom'
import { getRequests, getResponseItems } from '../store'

function fmt(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

export default function Requests() {
  const requests = getRequests()
  const responses = getResponseItems()
  const empty = requests.length === 0 && responses.length === 0

  return (
    <div className="page">
      <h1>Мои отклики и заявки</h1>
      {empty ? (
        <>
          <div className="stub"><div className="big">📋</div>Здесь появятся ваши запросы исполнителям и отклики на объявления с доски.</div>
          <div style={{ height: 16 }} />
          <div className="hero-cta">
            <Link to="/" className="btn ghost">← На главную</Link>
          </div>
        </>
      ) : (
        <>
          {responses.length > 0 && (
            <>
              <div className="fgroup-title" style={{ marginBottom: 8 }}>Мои отклики на объявления</div>
              <div className="reqlist" style={{ marginBottom: 20 }}>
                {responses.map((r, i) => (
                  <div className="reqcard" key={i}>
                    <div className="reqcard-top">
                      <b>{r.adTitle}</b>
                      <span className="reqstatus">Отклик отправлен</span>
                    </div>
                    <div className="reqmeta">Автор: {r.adAuthor} · {fmt(r.createdAt)}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          {requests.length > 0 && (
            <>
              <div className="fgroup-title" style={{ marginBottom: 8 }}>Мои запросы исполнителям</div>
              <div className="reqlist">
                {requests.map((r, i) => (
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
            </>
          )}
        </>
      )}
    </div>
  )
}
