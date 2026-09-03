import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { DIRECTIONS, OPERATORS, SERVICES, type Profile, type Tab } from '../data'
import RegionPicker from '../components/RegionPicker'
import { ProfileCard, ProfileModal, ContactModal } from '../components/profiles'

export default function Catalog() {
  const loc = useLocation()
  const initTab: Tab = (loc.state as { tab?: Tab } | null)?.tab === 'sv' ? 'sv' : 'op'
  const [tab, setTab] = useState<Tab>(initTab)
  const [dir, setDir] = useState(0)
  const [open, setOpen] = useState<Profile | null>(null)
  const [contact, setContact] = useState<Profile | null>(null)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('rate')
  const [regions, setRegions] = useState<string[]>([])

  const priceNum = (p: Profile) => (p.priceRequest ? Infinity : parseInt(p.price.replace(/\D/g, '')) || Infinity)

  const list = (tab === 'op' ? OPERATORS : SERVICES)
    .filter((p) => dir === 0 || p.dirs.includes(DIRECTIONS[dir].label))
    .filter((p) => {
      if (regions.length === 0) return true
      return regions.some((sel) => {
        if (sel.includes('|')) {
          const [area, city] = sel.split('|')
          return p.region === area && (p.city === city || !p.city)
        }
        return p.region === sel || p.region.includes(sel)
      })
    })
    .filter((p) => {
      const q = query.trim().toLowerCase()
      if (!q) return true
      return (p.name + ' ' + p.region + ' ' + p.dirs.join(' ')).toLowerCase().includes(q)
    })
    .sort((a, b) => {
      if (sort === 'price') return priceNum(a) - priceNum(b)
      if (sort === 'exp') return b.rev - a.rev
      return parseFloat(b.rate) - parseFloat(a.rate)
    })

  return (
    <>
      <div className="segwrap">
        <div className="seg">
          <button className={tab === 'op' ? 'on' : ''} onClick={() => setTab('op')}>Операторы</button>
          <button className={tab === 'sv' ? 'on' : ''} onClick={() => setTab('sv')}>Услуги</button>
        </div>
      </div>

      <div className="cats">
        {DIRECTIONS.map((c, i) => (
          <button key={c.label} className={`cat ${i === dir ? 'on' : ''}`} onClick={() => setDir(i)}>
            <div className="ic">{c.icon}</div>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      <div className="searchbar">
        <label className="search">🔎
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск: имя, регион, направление" />
        </label>
        <RegionPicker selected={regions} onChange={setRegions} />
      </div>

      <div className="toolbar">
        <div className="count">Найдено <b>{list.length}</b> · {DIRECTIONS[dir].label}</div>
        <select className="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="rate">По рейтингу</option>
          <option value="price">Сначала дешевле</option>
          <option value="exp">Больше отзывов</option>
        </select>
      </div>

      {list.length === 0 && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '30px 14px', color: 'var(--muted)' }}>
          По этому направлению пока нет анкет. Попробуйте другое направление или сбросьте поиск.
        </div>
      )}

      <div className="grid">
        {list.map((o) => <ProfileCard key={o.id} p={o} onOpen={setOpen} />)}
      </div>

      {open && <ProfileModal p={open} onClose={() => setOpen(null)} onContact={(p) => { setOpen(null); setContact(p) }} />}
      {contact && <ContactModal p={contact} onClose={() => setContact(null)} />}
    </>
  )
}
