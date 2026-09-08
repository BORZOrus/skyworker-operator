import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { DIRECTIONS } from '../data'
import { REGIONS } from '../regions'
import { getSchema } from '../fieldSchemas'
import { addAd, getUser, hasOperatorAd, myAdDirections, countMyAds, AD_LIMITS, type AdKind, type UserRole } from '../store'
import PhoneInput from '../components/PhoneInput'

const WHO: { key: UserRole; label: string; desc: string }[] = [
  { key: 'operator', label: 'Я оператор', desc: 'Я пилот, ищу работу — на технике заказчика' },
  { key: 'company', label: 'Я компания', desc: 'Оказываю услуги своим парком дронов и/или нанимаю операторов' },
  { key: 'customer', label: 'Я заказчик', desc: 'Мне нужно выполнить работу дроном' },
]

// Что можно разместить в зависимости от роли
const ACTIONS: Record<UserRole, { key: AdKind; label: string; hint: string; multi: boolean }[]> = {
  operator: [
    { key: 'op-seek', label: 'Ищу работу', hint: 'Одно объявление на все ваши направления сразу', multi: true },
  ],
  company: [
    { key: 'co-offer', label: 'Предлагаю услуги под ключ', hint: 'Одно объявление на направление', multi: false },
    { key: 'need-op', label: 'Нужны операторы для найма', hint: 'Одно объявление на направление', multi: false },
  ],
  customer: [
    { key: 'need-service', label: 'Нужна услуга под ключ', hint: 'Компания приедет со своим оборудованием', multi: false },
    { key: 'need-op', label: 'Нужен оператор', hint: 'Пилот на вашу технику', multi: false },
  ],
}

const DIRS = DIRECTIONS.slice(1)

export default function PostRequest() {
  const loc = useLocation()
  const state = loc.state as { role?: UserRole; kind?: AdKind } | null
  const initRole: UserRole | null = state?.role || getUser()?.role || null

  const [role, setRole] = useState<UserRole | null>(initRole)
  const [kind, setKind] = useState<AdKind | null>(null)
  const [sent, setSent] = useState(false)

  const [dirsSel, setDirsSel] = useState<string[]>([])   // мультивыбор (оператор)
  const [direction, setDirection] = useState('Агро')     // одно направление (компания/заказчик)
  const [region, setRegion] = useState(REGIONS[0])
  const [city, setCity] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [budget, setBudget] = useState('')
  const [author, setAuthor] = useState('')
  const [phone, setPhone] = useState('')
  // Детали задачи
  const [volume, setVolume] = useState('')
  const [deadline, setDeadline] = useState('')
  const [reqs, setReqs] = useState('')
  const [adWorks, setAdWorks] = useState<Record<string, boolean>>({})
  const toggleWork = (w: string) => setAdWorks((p) => ({ ...p, [w]: !p[w] }))

  const actions = role ? ACTIONS[role] : []
  const activeKind = kind || (actions.length === 1 ? actions[0].key : null)
  const action = actions.find((a) => a.key === activeKind)
  const toggleDir = (d: string) => setDirsSel((p) => p.includes(d) ? p.filter((x) => x !== d) : [...p, d])

  // Лимиты (анти-спам): оператор — 1 объявление; компания — 1 на направление;
  // «нужен оператор» — до 3; «нужна услуга» — до 5.
  const operatorBlocked = activeKind === 'op-seek' && hasOperatorAd()
  const takenDirs = activeKind === 'co-offer' ? myAdDirections('co-offer') : []
  const dirBlocked = activeKind === 'co-offer' && takenDirs.includes(direction)
  const countBlocked = !!activeKind && (activeKind === 'need-op' || activeKind === 'need-service') &&
    countMyAds(activeKind) >= AD_LIMITS[activeKind]

  const chosenDirs = action?.multi ? dirsSel : [direction]
  const ok = title.trim().length > 3 && body.trim().length > 5 && author.trim().length > 1 &&
    phone.replace(/\D/g, '').length >= 11 && chosenDirs.length > 0 && !operatorBlocked && !dirBlocked && !countBlocked

  // Виды работ по направлению (для детализации объявления)
  const worksList = !action?.multi ? (getSchema(direction)?.fields.filter((f) => f.type === 'check' && (f.group === 'Виды работ' || f.group === 'Работы' || f.group === 'Услуги')).map((f) => f.label) || []) : []
  const chosenWorks = Object.keys(adWorks).filter((w) => adWorks[w])

  const volumeLabel = direction === 'Агро' ? 'Объём, га' : direction === 'Грузовая доставка' ? 'Вес / кол-во доставок' : 'Объём работ'

  function publish() {
    if (!ok || !activeKind || !role) return
    const details: { label: string; value: string }[] = []
    if (volume.trim()) details.push({ label: volumeLabel, value: volume.trim() })
    if (deadline.trim()) details.push({ label: 'Сроки', value: deadline.trim() })
    if (chosenWorks.length) details.push({ label: role === 'company' ? 'Что делаем' : 'Что нужно', value: chosenWorks.join(', ') })
    if (reqs.trim()) details.push({ label: role === 'operator' ? 'Готов к' : 'Требования', value: reqs.trim() })
    addAd({
      id: 'ad-' + Date.now().toString(36),
      kind: activeKind, author: author.trim(), authorRole: role,
      directions: chosenDirs, region, city: city.trim() || undefined,
      title: title.trim(), body: body.trim(),
      budget: budget.trim() || undefined, phone: phone.trim(),
      details: details.length ? details : undefined,
      createdAt: new Date().toISOString(),
    })
    setSent(true)
  }

  // Экран 1 — кто вы
  if (!role) {
    return (
      <div className="page">
        <h1>Разместить объявление</h1>
        <p className="lead">Сначала коротко — кто вы? Покажем только то, что нужно именно вам.</p>
        {WHO.map((w) => (
          <button className="rolecard" key={w.key} onClick={() => setRole(w.key)} style={{ width: '100%', textAlign: 'left' }}>
            <div><h3>{w.label}</h3><p>{w.desc}</p></div>
          </button>
        ))}
      </div>
    )
  }

  // Экран 2 — что разместить (если у роли несколько действий)
  if (actions.length > 1 && !kind) {
    return (
      <div className="page">
        <h1>Что разместить</h1>
        <p className="lead">Вы: <b>{WHO.find((w) => w.key === role)!.label}</b>. <button className="linklike" style={{ display: 'inline', margin: 0 }} onClick={() => setRole(null)}>изменить</button></p>
        <div className="kindpick">
          {actions.map((a) => (
            <button key={a.key} type="button" className="kindbtn" onClick={() => setKind(a.key)}>
              <b>{a.label}</b><span>{a.hint}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (sent) {
    return (
      <div className="page">
        <h1>Объявление размещено</h1>
        <div className="stub"><div className="big">✓</div>Ваше объявление опубликовано. Подходящие участники увидят его и откликнутся.</div>
        <div style={{ height: 16 }} />
        <div className="hero-cta">
          <Link to="/" className="btn big">На главную</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <h1>{action?.label || 'Разместить объявление'}</h1>
      <p className="lead">
        {WHO.find((w) => w.key === role)!.label}
        {' · '}
        <button className="linklike" style={{ display: 'inline', margin: 0 }} onClick={() => { setRole(null); setKind(null) }}>сменить</button>
      </p>

      {operatorBlocked && (
        <div className="note" style={{ marginTop: 0 }}>У оператора одно объявление на все направления. Оно у вас уже есть — отредактируйте его в кабинете, чтобы изменить направления.</div>
      )}
      {countBlocked && activeKind && (
        <div className="note" style={{ marginTop: 0 }}>Достигнут лимит — не больше {AD_LIMITS[activeKind]} таких объявлений. Закройте одно из старых, чтобы разместить новое. Так мы бережём доску от спама.</div>
      )}

      <div className="fgroup">
        <div className="fgroup-title">{action?.multi ? 'В каких направлениях ищете работу' : 'Направление'}</div>
        {action?.multi ? (
          <>
            <div className="lead" style={{ fontSize: 13, marginBottom: 8 }}>Отметьте все, где у вас есть допуск. Объявление появится в каждом из них.</div>
            <div className="checks" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
              {DIRS.map((d) => (
                <label className="check" key={d.label}>
                  <input type="checkbox" checked={dirsSel.includes(d.label)} onChange={() => toggleDir(d.label)} /> {d.icon} {d.label}
                </label>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="field">
              <select value={direction} onChange={(e) => setDirection(e.target.value)}>
                {DIRS.map((d) => <option key={d.label} value={d.label}>{d.icon} {d.label}</option>)}
              </select>
            </div>
            {dirBlocked && <div className="note" style={{ marginTop: 0 }}>По направлению «{direction}» у вас уже есть такое объявление (одно на направление). Выберите другое или отредактируйте старое.</div>}
          </>
        )}
      </div>

      <div className="fgroup">
        <div className="fgroup-title">Что и где</div>
        <div className="field"><label>Заголовок</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={role === 'operator' ? 'Например: оператор-агро ищет работу на сезон' : 'Коротко: что нужно / что предлагаете'} />
        </div>
        <div className="field"><label>Регион</label>
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="field"><label>Город / посёлок (если важно)</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Например, Кокшетау" />
        </div>
      </div>

      {/* Детали задачи — по направлению */}
      {!action?.multi && (
        <div className="fgroup">
          <div className="fgroup-title">Детали задачи · {direction}</div>
          <div className="field"><label>{volumeLabel}</label>
            <input value={volume} onChange={(e) => setVolume(e.target.value)} placeholder={direction === 'Агро' ? '1200' : direction === 'Геодезия' ? 'участок 40 га' : 'объём'} />
          </div>
          <div className="field"><label>Сроки</label>
            <input value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="Например, до конца августа" />
          </div>
          {worksList.length > 0 && (
            <>
              <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', margin: '6px 0' }}>{role === 'company' ? 'Что выполняете' : 'Что нужно сделать'}</label>
              <div className="checks" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
                {worksList.map((w) => <label className="check" key={w}><input type="checkbox" checked={!!adWorks[w]} onChange={() => toggleWork(w)} /> {w}</label>)}
              </div>
            </>
          )}
        </div>
      )}

      <div className="fgroup">
        <div className="fgroup-title">Описание и условия</div>
        <div className="field"><label>Подробное описание</label>
          <textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)}
            placeholder={role === 'operator' ? 'Опыт, допуски, категория, когда свободны' : 'Что за объект/культура, детали задачи, особые требования'}
            style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 12, fontSize: 15, fontFamily: 'inherit', resize: 'vertical' }} />
        </div>
        <div className="field"><label>{role === 'operator' ? 'Готов к (техника, условия)' : 'Требования к исполнителю'}</label>
          <input value={reqs} onChange={(e) => setReqs(e.target.value)} placeholder={role === 'operator' ? 'Работаю на T50/T40, готов к командировкам' : 'Свой парк, допуски, опыт от 2 сезонов' } />
        </div>
        <div className="field"><label>{role === 'operator' ? 'Желаемая оплата' : 'Бюджет (необязательно)'}</label>
          <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Например, от 2 500 ₸/га или договорной" />
        </div>
      </div>

      <div className="fgroup">
        <div className="fgroup-title">Контакты</div>
        <div className="field"><label>{role === 'operator' ? 'Имя' : 'Компания / имя'}</label>
          <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder={role === 'operator' ? 'Ваше имя' : 'ТОО / ИП / ФХ или имя'} />
        </div>
        <div className="field"><label>Телефон</label>
          <PhoneInput onChange={setPhone} />
        </div>
        <label className="check consent"><input type="checkbox" defaultChecked /> <span>Согласен на публикацию объявления и обработку персональных данных согласно <Link to="/privacy" style={{ color: 'var(--accent)', fontWeight: 600 }}>Политике конфиденциальности</Link>.</span></label>
      </div>

      <button className="btn block" disabled={!ok} onClick={publish}>Опубликовать</button>
    </div>
  )
}
