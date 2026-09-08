import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DIRECTIONS } from '../data'
import { REGIONS, CITIES } from '../regions'
import { getSchema, FARM_SCHEMA, type SchemaField } from '../fieldSchemas'
import PhoneInput from '../components/PhoneInput'

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
  const [socials, setSocials] = useState<string[]>([''])
  const [agree, setAgree] = useState(false)
  const toggleDir = (d: string) => setDirs((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d])
  const setSocial = (i: number, v: string) => setSocials((prev) => prev.map((s, idx) => idx === i ? v : s))
  const addSocial = () => setSocials((prev) => [...prev, ''])
  const removeSocial = (i: number) => setSocials((prev) => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev)

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
  const isCompany = role === 'sv'   // только у компании — свой парк, документы, НДС
  const toggleTravel = (r: string) => setTravelRegions((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r])

  return (
    <div className="page">
      <h1>Регистрация</h1>
      <p className="lead">{cur.icon} {cur.title}</p>

      <Group title="Основное">
        {role === 'op' && <PhotoField round label="Личное фото" hint="Фото лица повышает доверие — заказчики чаще выбирают операторов с фото" />}
        {role === 'sv' && <PhotoField label="Логотип компании" hint="Логотип делает профиль узнаваемым и солидным" />}
        {role === 'cust' && <PhotoField label="Фото / логотип (по желанию)" hint="Повышает доверие исполнителей" />}
        <Field label={role === 'sv' ? 'Название / имя' : 'Имя и фамилия'}><input placeholder={role === 'sv' ? 'ТОО «JEDI»' : 'Асхат Жумабеков'} /></Field>
        <Field label="Телефон / WhatsApp"><PhoneInput /></Field>
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
          {role === 'op' && (
            <div className="note" style={{ marginTop: 0 }}>Вы оператор — работаете на технике заказчика. Своя анкета и есть ваше резюме: заполните один раз, а объявление «ищу работу» подаётся в пару кликов. Если у вас <b>свой парк дронов</b> — регистрируйтесь как <b>компания</b>.</div>
          )}
          {isCompany && (
            <Group title="О компании">
              <Radio name="type" opts={['ИП с дронами', 'ТОО / компания с парком']} />
              <Check label="Также нанимаю операторов на объём" />
            </Group>
          )}

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

          {isCompany && (
            <Group title="Оборудование / парк">
              <Field label="Дроны в парке"><input placeholder="3× DJI Agras T50, Mavic 3M" /></Field>
              <Field label="Количество бригад"><input placeholder="2" /></Field>
            </Group>
          )}

          <Group title="Опыт">
            <Field label="Общий опыт с БАС (лет)"><input placeholder="4" /></Field>
            <Field label="Количество сезонов"><input placeholder="3" /></Field>
          </Group>

          <Group title="Сайт и соцсети">
            <div className="lead" style={{ marginBottom: 10, fontSize: 13 }}>Чем полнее профиль, тем выше ваша карточка в поиске и тем чаще на вас выходят заказчики. Соцсети повышают доверие — можно добавить несколько.</div>
            <Field label="Сайт (если есть)"><input placeholder="ashat-agro.kz" /></Field>
            <label>Ссылки на соцсети</label>
            {socials.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <input value={s} onChange={(e) => setSocial(i, e.target.value)} placeholder="instagram.com/… · tiktok.com/@… · youtube.com/@…"
                  style={{ flex: 1, padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 12, fontSize: 15, fontFamily: 'inherit' }} />
                {socials.length > 1 && <button type="button" onClick={() => removeSocial(i)} className="btn ghost" style={{ padding: '0 14px' }}>✕</button>}
              </div>
            ))}
            <button type="button" onClick={addSocial} className="addmore">+ добавить ещё соцсеть</button>
          </Group>

          {isCompany && (
            <Group title="Документы и оплата">
              <div className="lead" style={{ marginBottom: 10, fontSize: 13 }}>Заказчикам важно заранее понимать форму расчётов и НДС — это влияет на цену и документы.</div>
              <Field label="Юридическая форма"><select><option>ИП</option><option>ТОО</option><option>Крестьянское хозяйство (ФХ)</option></select></Field>
              <Field label="НДС"><select><option>Работаю без НДС</option><option>Плательщик НДС</option></select></Field>
              <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Формы расчётов</label>
              <Checks opts={['Наличные', 'Безнал (счёт)', 'Kaspi / перевод']} cols={1} />
              <div style={{ marginTop: 12 }}>
                <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Документы (лицензии, свидетельства, сертификаты)</label>
                <div className="filestub">📎 Прикрепить файлы <span>PDF, JPG — до 10 МБ (заглушка)</span></div>
              </div>
            </Group>
          )}

          <Group title={role === 'op' ? 'О себе' : 'О компании'}>
            <TextArea label={role === 'op' ? 'Коротко о себе' : 'Коротко о компании'}
              placeholder={role === 'op' ? 'Кто вы, чем сильны, почему выбрать вас. 2–3 предложения.' : 'Чем занимаетесь, опыт, преимущества. 2–3 предложения.'} />
          </Group>

          <Group title="Оплата">
            <Field label={role === 'op' ? 'Желаемая оплата' : 'Ставка'}><input placeholder={role === 'op' ? 'от 15 000 ₸/день или договорная' : 'от 2 700 ₸/га'} /></Field>
            <Radio name="pricevis" opts={['Показывать открыто', 'По запросу', 'Договорная']} />
          </Group>
        </>
      )}

      {role === 'cust' && (
        <>
          <Group title="Реквизиты">
            <Field label="Компания / имя"><input placeholder="ТОО / ИП / ФХ или имя" /></Field>
            <Field label="Юридическая форма"><select><option>Физлицо</option><option>ИП</option><option>ТОО</option><option>Крестьянское хозяйство (ФХ)</option></select></Field>
            <Field label="БИН / ИИН"><input placeholder="12 цифр" /></Field>
            <div className="lead" style={{ fontSize: 12, margin: '2px 0 0' }}>Нужен для подтверждения, что вы реальная компания. Не публикуется.</div>
          </Group>

          <Group title="О хозяйстве — по желанию">
            <div className="note" style={{ marginTop: 0, marginBottom: 12 }}>Эти данные видит только сервис и исполнители, которым вы отвечаете. Заполните — и вам будут приходить <b>точные отклики с реальной ценой</b>, без пустых звонков «а сколько у вас гектаров и какая культура».</div>
            {(() => {
              const groups: Record<string, SchemaField[]> = {}
              FARM_SCHEMA.forEach((f) => { const g = f.group || 'Хозяйство'; (groups[g] ||= []).push(f) })
              return Object.entries(groups).map(([g, fs]) => (
                <div key={g} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, margin: '4px 0 6px' }}>{g}</div>
                  {fs.map((f, i) => <SchemaFieldView key={i} f={f} />)}
                </div>
              ))
            })()}
          </Group>

          <Group title="О себе">
            <TextArea label="Коротко о компании / хозяйстве" placeholder="Чем занимаетесь, что регулярно нужно. Помогает исполнителям понять вас." />
          </Group>
        </>
      )}

      <label className="check consent">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <span>Я соглашаюсь на сбор и обработку моих персональных данных и размещение анкеты, согласно <Link to="/privacy" style={{ color: 'var(--accent)', fontWeight: 600 }}>Политике конфиденциальности</Link> и Закону РК «О персональных данных и их защите».</span>
      </label>
      <div style={{ height: 16 }} />
      {agree
        ? <Link to="/cabinet" className="btn block" style={{ display: 'block', textAlign: 'center' }}>Создать профиль</Link>
        : <button className="btn block" disabled style={{ opacity: .5 }}>Создать профиль</button>}
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
function TextArea({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="field"><label>{label}</label>
      <textarea rows={4} placeholder={placeholder} style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 12, fontSize: 15, fontFamily: 'inherit', resize: 'vertical' }} />
    </div>
  )
}
function PhotoField({ label, hint, round }: { label: string; hint: string; round?: boolean }) {
  const [name, setName] = useState('')
  return (
    <div className="photofield">
      <label className={`photo-drop${round ? ' round' : ''}`}>
        {name ? <span className="photo-ok">✓</span> : <span className="photo-plus">＋</span>}
        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setName(e.target.files?.[0]?.name || '')} />
      </label>
      <div className="photofield-txt"><b>{label}</b><span>{name || hint}</span></div>
    </div>
  )
}
