import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DIRECTIONS } from '../data'
import { REGIONS, CITIES } from '../regions'
import { getSchema, type SchemaField } from '../fieldSchemas'

const ROLES = [
  { icon: '👷', key: 'op', title: 'Я оператор — ищу работу', desc: 'Создам карточку-резюме: портфолио, допуски, опыт. Чтобы меня нанимали в штат или на сезон.' },
  { icon: '🚁', key: 'sv', title: 'Оказываю услуги', desc: 'У меня свои дроны (от 1 до 50+). Витрина услуг с ценами и оборудованием — чтобы заказывали работу.' },
  { icon: '🔎', key: 'cust', title: 'Ищу операторов / услуги', desc: 'Я заказчик. Хочу найти оператора или подрядчика и оставить заявку.' },
]

const DIRS = DIRECTIONS.slice(1) // без «Все»

export default function Register() {
  const [role, setRole] = useState<string | null>(null)
  const [region, setRegion] = useState(REGIONS[0])
  const [travelRegions, setTravelRegions] = useState<string[]>([])
  const [dirs, setDirs] = useState<string[]>([])
  const toggleDir = (d: string) => setDirs((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d])

  if (!role) {
    return (
      <div className="page">
        <h1>Регистрация</h1>
        <p className="lead">Что вы хотите делать на площадке? Роли можно совмещать позже.</p>
        {ROLES.map((r) => (
          <button className="rolecard" key={r.key} onClick={() => setRole(r.key)} style={{ width: '100%', textAlign: 'left' }}>
            <div className="ri">{r.icon}</div>
            <div><h3>{r.title}</h3><p>{r.desc}</p></div>
          </button>
        ))}
        <div className="center-note">Уже есть аккаунт? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Войти</Link></div>
      </div>
    )
  }

  const cur = ROLES.find((r) => r.key === role)!
  const isExecutor = role === 'op' || role === 'sv'
  const toggleTravel = (r: string) => setTravelRegions((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r])

  return (
    <div className="page">
      <h1>Регистрация</h1>
      <p className="lead">{cur.icon} {cur.title}</p>

      <Group title="Основное">
        <Field label={role === 'sv' ? 'Название / имя' : 'Имя и фамилия'}><input placeholder={role === 'sv' ? 'ТОО «JEDI»' : 'Асхат Жумабеков'} /></Field>
        <Field label="Телефон / WhatsApp"><input placeholder="+7 ___ ___ __ __" /></Field>
        <Field label="Область / город республ. значения">
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            {REGIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Город / посёлок">
          <select>
            {(CITIES[region] || []).map((c) => <option key={c}>{c}</option>)}
            <option value="__other">Другой (село/посёлок) — впишу вручную</option>
          </select>
        </Field>
      </Group>

      {isExecutor && (
        <>
          <Group title="Кто вы">
            <Radio name="type" opts={['Оператор со своим дроном', 'Оператор без своего дрона (работаю на чужой технике)', 'Владелец парка / компания']} />
          </Group>

          <Group title="Куда готовы выезжать на работу">
            <div className="lead" style={{ marginBottom: 10, fontSize: 13 }}>Отметьте области — заказчики из этих регионов увидят вас в поиске. Своя область отмечена автоматически.</div>
            <div className="checks" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
              {REGIONS.map((r) => (
                <label className="check" key={r}>
                  <input type="checkbox" checked={r === region || travelRegions.includes(r)} disabled={r === region} onChange={() => toggleTravel(r)} /> {r}
                </label>
              ))}
            </div>
          </Group>

          <Group title="Направления (можно несколько)">
            <div className="checks" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
              {DIRS.map((d) => (
                <label className="check" key={d.label}>
                  <input type="checkbox" checked={dirs.includes(d.label)} onChange={() => toggleDir(d.label)} /> {d.icon} {d.label}
                </label>
              ))}
            </div>
          </Group>

          {dirs.map((d) => <DirectionModule key={d} direction={d} />)}

          <Group title="Допуски и документы">
            <Field label="Категория оператора"><select><option>Категория 1 (250 г – 1,5 кг)</option><option>Категория 2 (1,5 – 25 кг)</option><option>Категория 3 (25 – 750 кг, агро)</option></select></Field>
            <Check label="Есть свидетельство внешнего пилота" />
            <Check label="Дрон зарегистрирован в CAA" />
            <Field label="Регистрационный номер БАС"><input placeholder="KZ-A____" /></Field>
          </Group>

          <Group title="Оборудование (общее)">
            <Field label="Работаю сейчас на модели"><input placeholder="DJI Agras T70" /></Field>
            <Field label="Работал ранее на"><input placeholder="T50 / T100" /></Field>
          </Group>

          <Group title="Опыт">
            <Field label="Общий опыт с БАС (лет)"><input placeholder="4" /></Field>
            <Field label="Количество сезонов"><input placeholder="3" /></Field>
          </Group>

          <Group title="Цена и доступность">
            <Field label="Ставка"><input placeholder="от 18 000 ₸/день или от 2 700 ₸/га" /></Field>
            <Radio name="pricevis" opts={['Показывать цену открыто', 'Цена по запросу', 'Договорная']} />
            <Field label="Статус"><select><option>Открыт к предложениям</option><option>Занят</option><option>Не беспокоить</option></select></Field>
          </Group>
        </>
      )}

      {role === 'cust' && (
        <Group title="О компании">
          <Field label="Компания"><input placeholder="ТОО / ИП / ФХ" /></Field>
          <Field label="Что ищете"><select><option>Оператора в штат / на сезон</option><option>Услугу под ключ</option></select></Field>
        </Group>
      )}

      <div className="note">✓ Согласие на обработку персональных данных и получение предложений (соберём галочкой — это заглушка).</div>
      <div style={{ height: 16 }} />
      <Link to="/cabinet" className="btn block" style={{ display: 'block', textAlign: 'center' }}>Создать профиль</Link>
      <div className="center-note"><button onClick={() => setRole(null)} style={{ background: 'none', border: 0, color: 'var(--muted)' }}>← выбрать другую роль</button></div>
    </div>
  )
}

function DirectionModule({ direction }: { direction: string }) {
  const schema = getSchema(direction)
  if (!schema) {
    return (
      <Group title={`Направление: ${direction}`}>
        <div className="lead" style={{ fontSize: 13, margin: 0 }}>Специфичные поля этого направления — в проработке. Добавим отдельным слоем (у каждого направления свой набор).</div>
      </Group>
    )
  }
  const groups: Record<string, SchemaField[]> = {}
  schema.fields.forEach((f) => {
    const g = f.group || 'Параметры'
    if (!groups[g]) groups[g] = []
    groups[g].push(f)
  })
  return (
    <Group title={`Направление: ${direction}${schema.status === 'draft' ? ' · черновик' : ''}`}>
      {Object.entries(groups).map(([g, fs]) => (
        <div key={g} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, margin: '4px 0 6px' }}>{g}</div>
          {fs.map((f, i) => <SchemaFieldView key={i} f={f} />)}
        </div>
      ))}
    </Group>
  )
}

function SchemaFieldView({ f }: { f: SchemaField }) {
  if (f.type === 'check') return <Check label={f.label} />
  if (f.type === 'select') return <Field label={f.label}><select>{(f.options || []).map((o) => <option key={o}>{o}</option>)}</select></Field>
  return <Field label={f.label}><input /></Field>
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="fgroup">
      <div className="fgroup-title">{title}</div>
      {children}
    </div>
  )
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="field"><label>{label}</label>{children}</div>
}
function Check({ label }: { label: string }) {
  return <label className="check"><input type="checkbox" /> {label}</label>
}
function Checks({ opts, cols = 1 }: { opts: string[]; cols?: number }) {
  return <div className="checks" style={{ gridTemplateColumns: `repeat(${cols},1fr)` }}>{opts.map((o) => <label className="check" key={o}><input type="checkbox" /> {o}</label>)}</div>
}
function Radio({ name, opts }: { name: string; opts: string[] }) {
  return <div className="checks">{opts.map((o) => <label className="check" key={o}><input type="radio" name={name} /> {o}</label>)}</div>
}
