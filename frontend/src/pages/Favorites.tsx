import { useState } from 'react'
import { Link } from 'react-router-dom'
import { OPERATORS, SERVICES, type Profile } from '../data'
import { getFavorites } from '../store'
import { ProfileCard, ProfileModal, ContactModal } from '../components/profiles'

const ALL = [...OPERATORS, ...SERVICES]

export default function Favorites() {
  const favIds = getFavorites()
  const items = ALL.filter((p) => favIds.includes(p.id))
  const [open, setOpen] = useState<Profile | null>(null)
  const [contact, setContact] = useState<Profile | null>(null)

  return (
    <div className="page" style={{ maxWidth: 1200 }}>
      <h1>Избранное</h1>
      {items.length === 0 ? (
        <>
          <div className="stub"><div className="big">♡</div>Здесь появятся сохранённые операторы и услуги. Нажмите сердечко на карточке в каталоге.</div>
          <div style={{ height: 16 }} />
          <Link to="/" className="btn block ghost" style={{ display: 'block', textAlign: 'center' }}>← В каталог</Link>
        </>
      ) : (
        <div className="grid" style={{ padding: '12px 0 30px' }}>
          {items.map((p) => <ProfileCard key={p.id} p={p} onOpen={setOpen} />)}
        </div>
      )}

      {open && <ProfileModal p={open} onClose={() => setOpen(null)} onContact={(p) => { setOpen(null); setContact(p) }} />}
      {contact && <ContactModal p={contact} onClose={() => setContact(null)} />}
    </div>
  )
}
