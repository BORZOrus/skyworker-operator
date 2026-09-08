import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { DIRECTIONS } from '../data'
import RegionPicker from '../components/RegionPicker'
import AuthGate from '../components/AuthGate'
import RespondModal from '../components/RespondModal'
import ComplaintModal from '../components/ComplaintModal'
import AdModal from '../components/AdModal'
import DirIcon from '../components/DirIcon'
import { getDemoProfile } from '../demoData'
import { getAds, isRegistered, hasResponded, addResponseItem, type BoardAd, type AdKind, type UserRole } from '../store'

const BASE = import.meta.env.BASE_URL

function respondToAd(ad: BoardAd) {
  addResponseItem({ adId: ad.id, adTitle: ad.title, adAuthor: ad.author, createdAt: new Date().toISOString() })
}

// Метка типа объявления + роль автора
const KIND_LABEL: Record<AdKind, string> = {
  'op-seek': 'Ищет работу',
  'co-offer': 'Услуги под ключ',
  'need-op': 'Ищет оператора',
  'need-service': 'Ищет услугу',
}
const ROLE_TAG: Record<UserRole, string> = { operator: 'Оператор', company: 'Компания', customer: 'Заказчик' }
const KIND_CLS: Record<AdKind, string> = { 'op-seek': 'k-seek', 'co-offer': 'k-exec', 'need-op': 'k-need', 'need-service': 'k-need' }

// Разделы поиска. В каждом две вкладки:
//   a — кто мне нужен (на него откликаюсь), b — такие же, как я (конкуренты, для сравнения).
type ViewKey = 'op-work' | 'co-orders' | 'co-hire' | 'cu-exec' | 'cu-op'
type ViewDef = { title: string; sub: string; a: { label: string; kinds: AdKind[] }; b: { label: string; kinds: AdKind[] }; postRole: UserRole }
const VIEWS: Record<ViewKey, ViewDef> = {
  'op-work': { title: 'Найти работу', sub: 'Кто ищет операторов — откликайтесь. И как выглядят объявления других операторов.',
    a: { label: 'Кто ищет операторов', kinds: ['need-op'] }, b: { label: 'Другие операторы', kinds: ['op-seek'] }, postRole: 'operator' },
  'co-orders': { title: 'Найти заказы', sub: 'Заказчики, которым нужна услуга под ключ. И другие компании-конкуренты.',
    a: { label: 'Заказчики ищут услуги', kinds: ['need-service'] }, b: { label: 'Другие компании', kinds: ['co-offer'] }, postRole: 'company' },
  'co-hire': { title: 'Нанять операторов', sub: 'Операторы в поиске работы — зовите. И кто ещё ищет операторов.',
    a: { label: 'Операторы ищут работу', kinds: ['op-seek'] }, b: { label: 'Кто ещё ищет операторов', kinds: ['need-op'] }, postRole: 'company' },
  'cu-exec': { title: 'Ищу исполнителя', sub: 'Компании с услугами под ключ. И другие заказчики.',
    a: { label: 'Компании и услуги', kinds: ['co-offer'] }, b: { label: 'Другие заказчики', kinds: ['need-service'] }, postRole: 'customer' },
  'cu-op': { title: 'Ищу оператора', sub: 'Операторы в поиске работы — зовите. И кто ещё ищет операторов.',
    a: { label: 'Операторы', kinds: ['op-seek'] }, b: { label: 'Кто ещё ищет операторов', kinds: ['need-op'] }, postRole: 'customer' },
}

function timeAgo(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

export default function Board() {
  const loc = useLocation()
  const viewKey = ((loc.state as { view?: ViewKey } | null)?.view) || 'op-work'
  const view = VIEWS[viewKey]

  const [tab, setTab] = useState<'a' | 'b'>('a')
  const [dir, setDir] = useState(0)
  const [regions, setRegions] = useState<string[]>([])
  const [gate, setGate] = useState<BoardAd | null>(null)
  const [respond, setRespond] = useState<BoardAd | null>(null)
  const [complain, setComplain] = useState<BoardAd | null>(null)
  const [detail, setDetail] = useState<BoardAd | null>(null)
  const [, force] = useState(0)

  const stream = tab === 'a' ? view.a : view.b
  const isTargetTab = tab === 'a' // на вкладке «кто мне нужен» откликаемся; на «конкурентах» — только смотрим

  const ads = getAds()
    .filter((a) => stream.kinds.includes(a.kind))
    .filter((a) => dir === 0 || a.directions.includes(DIRECTIONS[dir].label))
    .filter((a) => {
      if (regions.length === 0) return true
      return regions.some((sel) => {
        if (sel.includes('|')) {
          const [area, city] = sel.split('|')
          return a.region === area && (a.city === city || !a.city)
        }
        return a.region === sel || a.region.includes(sel)
      })
    })

  function onRespond(ad: BoardAd) {
    if (!isRegistered()) { setGate(ad); return }
    setRespond(ad)
  }

  return (
    <>
      <div className="board-head">
        <div className="board-head-in">
          <div>
            <h1>{view.title}</h1>
            <p>{view.sub}</p>
          </div>
          <Link to="/post" state={{ role: view.postRole }} className="btn big">Разместить объявление</Link>
        </div>
      </div>

      <div className="segwrap">
        <div className="seg wide">
          <button className={tab === 'a' ? 'on' : ''} onClick={() => setTab('a')}>{view.a.label}</button>
          <button className={tab === 'b' ? 'on' : ''} onClick={() => setTab('b')}>{view.b.label}</button>
        </div>
      </div>

      <div className="cats">
        {DIRECTIONS.map((c, i) => (
          <button key={c.label} className={`cat ${i === dir ? 'on' : ''}`} onClick={() => setDir(i)}>
            <div className="ic"><DirIcon label={c.label} size={30} /></div>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      <div className="searchbar">
        <RegionPicker selected={regions} onChange={setRegions} />
      </div>

      <div className="toolbar">
        <div className="count">Объявлений <b>{ads.length}</b>{!isTargetTab && ' · для сравнения'}</div>
      </div>

      {ads.length === 0 && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '30px 14px', color: 'var(--muted)' }}>
          По этому фильтру пока нет объявлений. Смените направление или регион.
        </div>
      )}

      <div className="board-grid">
        {ads.map((a) => {
          const responded = hasResponded(a.id)
          const av = a.authorId ? getDemoProfile(a.authorId) : undefined
          return (
            <div className="adcard" key={a.id}>
              <div className="adcard-click" onClick={() => setDetail(a)}>
                <div className="adcard-top">
                  <span className={`adtag ${KIND_CLS[a.kind]}`}>{KIND_LABEL[a.kind]}</span>
                  <span className="addate">{timeAgo(a.createdAt)}</span>
                </div>
                <div className="adtitle">{a.title}</div>
                <div className="admeta">
                  {a.directions.map((d) => <span key={d}><DirIcon label={d} size={16} /> {d}</span>)}
                  <span>📍 {a.city ? `${a.city}, ${a.region}` : a.region}</span>
                  {a.budget && <span>💰 {a.budget}</span>}
                </div>
                {a.badges && a.badges.length > 0 && (
                  <div className="adbadges">{a.badges.map((b) => <span className="adbadge" key={b}>{b}</span>)}</div>
                )}
                <p className="adbody">{a.body}</p>
                <div className="adfoot">
                  <div className="adauthor2">
                    {av ? <img src={`${BASE}portfolio/${av.photo}`} alt="" className={`aac-photo sm${av.square ? ' sq' : ''}`} /> : <div className="aac-photo sm aac-ph">{a.author.replace(/[^А-Яа-яA-Za-z]/g, '').slice(0, 2).toUpperCase()}</div>}
                    <div className="adauthor"><b>{a.author}</b><span>{ROLE_TAG[a.authorRole]}{av ? ' · профиль ›' : ''}</span></div>
                  </div>
                </div>
              </div>
              {isTargetTab ? (
                <button
                  className={`btn block${responded ? ' done' : ''}`}
                  disabled={responded}
                  onClick={() => onRespond(a)}>
                  {responded ? '✓ Вы откликнулись' : 'Откликнуться'}
                </button>
              ) : (
                <div className="compare-note">Показано для сравнения — это такие же, как вы</div>
              )}
              <button className="complain-link" onClick={() => setComplain(a)}>⚠ Пожаловаться</button>
            </div>
          )
        })}
      </div>

      {gate && (
        <AuthGate
          reason="Чтобы откликнуться и увидеть контакты — оставьте телефон. Займёт 20 секунд, полную анкету заполните позже."
          onClose={() => setGate(null)}
          onDone={() => { const ad = gate; setGate(null); setRespond(ad) }}
        />
      )}
      {respond && (
        <RespondModal
          ad={respond}
          onClose={() => setRespond(null)}
          onSent={() => { if (respond) { respondToAd(respond); force((n) => n + 1) } }}
        />
      )}
      {complain && (
        <ComplaintModal targetId={complain.id} targetName={complain.author} onClose={() => setComplain(null)} />
      )}
      {detail && (
        <AdModal
          ad={detail}
          canRespond={isTargetTab}
          onClose={() => setDetail(null)}
          onRespond={() => { const ad = detail; setDetail(null); onRespond(ad) }}
        />
      )}
    </>
  )
}
