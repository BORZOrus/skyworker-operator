import { useState } from 'react'
import { DIRECTIONS } from '../data'
import { getSchema, type SchemaField } from '../fieldSchemas'
import { REGIONS } from '../regions'
import { getOperatorProfile, saveOperatorProfile, operatorCompleteness, expLabels, type OperatorProfile } from '../store'

const BASE = import.meta.env.BASE_URL
const AGRO = getSchema('Агро')!
const AGRO_WORKS = AGRO.fields.filter((f) => f.group === 'Виды работ').map((f) => f.label)
const AGRO_CROPS = AGRO.fields.filter((f) => f.group === 'Культуры').map((f) => f.label)
const DIRS = DIRECTIONS.slice(1)
const CATS = ['Категория 1 (до 1,5 кг)', 'Категория 2 (1,5–25 кг)', 'Категория 3 (25–750 кг, агро)']
const dicon = (d: string) => DIRECTIONS.find((x) => x.label === d)?.icon
const imgSrc = (photo: string) => photo.startsWith('data:') || photo.startsWith('http') ? photo : BASE + photo

export default function OperatorAnketa() {
  const [p, setP] = useState<OperatorProfile>(getOperatorProfile())
  const [flash, setFlash] = useState(false)
  const [edit, setEdit] = useState(false)

  function upd(patch: Partial<OperatorProfile>) {
    const np = { ...p, ...patch }
    setP(np); saveOperatorProfile(np)
    setFlash(true); setTimeout(() => setFlash(false), 1200)
  }
  const has = (arr: string[], v: string) => arr.includes(v)
  const toggle = (arr: string[], v: string) => arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
  const dirKey = (d: string, l: string) => `${d}::${l}`
  const toggleDirField = (d: string, l: string) => upd({ dirFields: { ...p.dirFields, [dirKey(d, l)]: !p.dirFields[dirKey(d, l)] } })
  const setDirExp = (d: string, k: 'a' | 'b', v: string) => upd({ dirExp: { ...p.dirExp, [d]: { ...(p.dirExp[d] || { a: '', b: '' }), [k]: v } } })
  const dirSkills = (d: string) => Object.entries(p.dirFields).filter(([k, v]) => v && k.startsWith(d + '::')).map(([k]) => k.split('::')[1])

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return
    const reader = new FileReader()
    reader.onload = () => upd({ photo: String(reader.result) })
    reader.readAsDataURL(f)
  }

  const fill = operatorCompleteness(p)
  const isAgro = p.directions.includes('Агро')

  // Опыт + навыки по направлению (для резюме)
  const dirData = (d: string) => {
    const e = p.dirExp[d] || { a: '', b: '' }
    const L = expLabels(d)
    const exp = [e.a && `${e.a} ${L.a.toLowerCase()}`, e.b && `${Number(e.b).toLocaleString('ru-RU')} ${L.b.toLowerCase()}`].filter(Boolean).join(' · ')
    return { exp, skills: d === 'Агро' ? p.agroWorks : dirSkills(d), crops: d === 'Агро' ? p.agroCrops : [] }
  }

  return (
    <div className="anketa">
      {/* Резюме-документ — всегда сверху, готовый вид */}
      <div className="resume-doc">
        <div className="rd-hero">
          {p.photo ? <img src={imgSrc(p.photo)} alt="" className="rd-photo" /> : <div className="rd-photo rd-ph">{p.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</div>}
          <div className="rd-head-txt">
            <h3>{p.name}{p.age ? `, ${p.age}` : ''}</h3>
            <div className="rd-role">Оператор дрона · {p.cat.split(' (')[0]}</div>
            <div className="rd-loc">📍 {p.city || p.region}</div>
          </div>
        </div>
        <div className="rd-body">
          <div className="rd-docs">
            {p.pilotCert && <span className="doc-badge">✓ Свидетельство пилота{p.certNo ? ` № ${p.certNo}` : ''}</span>}
            {p.training && <span className="doc-badge">✓ Курсы БАС</span>}
            {p.medCert && <span className="doc-badge">✓ Медсправка</span>}
            {p.basReg && <span className="doc-badge">✓ CAA</span>}
          </div>
          {p.expYears && <div className="rd-exp-total">Общий стаж с дронами: <b>{p.expYears} лет</b></div>}
          {p.about && <div className="rd-sec"><h4>О себе</h4><p>{p.about}</p></div>}

          {p.directions.map((d) => {
            const dd = dirData(d)
            return (
              <div className="rd-sec rd-dir" key={d}>
                <div className="rd-dir-top"><h4>{dicon(d)} {d}</h4>{dd.exp && <span className="rd-dir-exp">{dd.exp}</span>}</div>
                {dd.skills.length > 0 && <div className="rd-chips">{dd.skills.map((s) => <span className="chip" key={s}>{s}</span>)}</div>}
                {dd.crops.length > 0 && <div className="rd-chips" style={{ marginTop: 6 }}>{dd.crops.map((c) => <span className="chip crop" key={c}>🌾 {c}</span>)}</div>}
                {dd.skills.length === 0 && dd.crops.length === 0 && <div className="rd-empty">навыки не отмечены</div>}
              </div>
            )
          })}

          <div className="rd-sec"><h4>География</h4>
            <p>{p.willTravel ? (p.travelAll ? 'Готов к командировкам по всему Казахстану' : `Командировки: ${p.travelRegions.join(', ') || 'по договорённости'}`) : 'Работаю в своём регионе'}</p>
          </div>
          {p.socials[0] && <div className="rd-sec"><h4>Ссылки</h4><p>📷 {p.socials[0]}</p></div>}
          <div className="rd-foot"><span className="rd-pay">{p.pay}</span></div>
        </div>
      </div>

      {/* Кнопка редактирования */}
      <button className={`edit-toggle${edit ? ' open' : ''}`} onClick={() => setEdit((v) => !v)}>
        <span className="et-txt">
          <b>{edit ? 'Свернуть анкету' : 'Редактировать анкету'}</b>
          <small>{edit ? 'скрыть форму' : `открыть поля и заполнить · сейчас ${fill}%`}</small>
        </span>
        <span className="et-chev">›</span>
      </button>

      {/* Форма-заполнялка — под кнопкой */}
      {edit && (
        <div className="anketa-form">
          <div className="fillbox">
            <div className="fillbox-top">
              <span>Анкета заполнена на <b>{fill}%</b></span>
              <span className="fillbox-hint">{flash ? '✓ сохранено' : 'меняется — сразу сохраняется'}</span>
            </div>
            <div className="fillbar"><div className="fillbar-in" style={{ width: `${fill}%` }} /></div>
          </div>

          <div className="fgroup">
            <div className="fgroup-title">Кто вы</div>
            <div className="photofield">
              <label className="photo-drop round">
                {p.photo ? <img src={imgSrc(p.photo)} alt="" className="photo-prev" /> : <span className="photo-plus">＋</span>}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={onPhoto} />
              </label>
              <div className="photofield-txt"><b>Личное фото</b><span>Фото лица повышает доверие — нажмите, чтобы заменить</span>
                <button type="button" className="linklike" style={{ margin: '4px 0 0', textAlign: 'left' }} onClick={() => upd({ photo: 'portfolio/operator_face.jpg' })}>↺ вернуть стандартное</button>
              </div>
            </div>
            <div className="field"><label>Имя и фамилия</label><input value={p.name} onChange={(e) => upd({ name: e.target.value })} /></div>
            <div className="field"><label>Возраст</label><input value={p.age} onChange={(e) => upd({ age: e.target.value })} placeholder="35" /></div>
          </div>

          <div className="fgroup">
            <div className="fgroup-title">Город и командировки</div>
            <div className="field"><label>Город проживания</label><input value={p.city} onChange={(e) => upd({ city: e.target.value })} placeholder="Кокшетау" /></div>
            <div className="field"><label>Основной регион</label>
              <select value={p.region} onChange={(e) => upd({ region: e.target.value })}>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select>
            </div>
            <label className="check"><input type="checkbox" checked={p.willTravel} onChange={(e) => upd({ willTravel: e.target.checked })} /> Готов к командировкам</label>
            {p.willTravel && (
              <>
                <label className="check"><input type="checkbox" checked={p.travelAll} onChange={(e) => upd({ travelAll: e.target.checked })} /> Готов ко <b>всем</b> регионам</label>
                {!p.travelAll && (
                  <div className="checks" style={{ gridTemplateColumns: 'repeat(2,1fr)', marginTop: 8 }}>
                    {REGIONS.map((r) => (
                      <label className="check" key={r}><input type="checkbox" checked={has(p.travelRegions, r)} onChange={() => upd({ travelRegions: toggle(p.travelRegions, r) })} /> {r}</label>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="fgroup">
            <div className="fgroup-title">Допуски и документы</div>
            <div className="field"><label>Категория оператора</label>
              <select value={p.cat} onChange={(e) => upd({ cat: e.target.value })}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
            </div>
            <label className="check"><input type="checkbox" checked={p.pilotCert} onChange={(e) => upd({ pilotCert: e.target.checked })} /> Свидетельство внешнего пилота</label>
            {p.pilotCert && <div className="field" style={{ marginTop: 8 }}><label>Номер свидетельства</label><input value={p.certNo} onChange={(e) => upd({ certNo: e.target.value })} placeholder="СВП-____-____" /></div>}
            <label className="check"><input type="checkbox" checked={p.training} onChange={(e) => upd({ training: e.target.checked })} /> Сертификат об обучении (курсы операторов БАС)</label>
            <label className="check"><input type="checkbox" checked={p.medCert} onChange={(e) => upd({ medCert: e.target.checked })} /> Медицинская справка</label>
            <label className="check"><input type="checkbox" checked={p.basReg} onChange={(e) => upd({ basReg: e.target.checked })} /> Оборудование зарегистрировано в CAA</label>
            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Сканы документов</label>
              <div className="filestub">📎 Прикрепить файлы <span>PDF, JPG — до 10 МБ (заглушка)</span></div>
            </div>
          </div>

          <div className="fgroup">
            <div className="fgroup-title">Общий стаж</div>
            <div className="field"><label>Всего лет с дронами</label><input value={p.expYears} onChange={(e) => upd({ expYears: e.target.value })} placeholder="4" /></div>
          </div>

          <div className="fgroup">
            <div className="fgroup-title">В каких направлениях работаю</div>
            <div className="lead" style={{ fontSize: 13, marginBottom: 8 }}>Отметьте — под каждым появятся свои вопросы и опыт.</div>
            <div className="checks" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
              {DIRS.map((d) => (
                <label className="check" key={d.label}><input type="checkbox" checked={has(p.directions, d.label)} onChange={() => upd({ directions: toggle(p.directions, d.label) })} /> {d.icon} {d.label}</label>
              ))}
            </div>
          </div>

          {/* Модуль каждого направления со своим опытом */}
          {p.directions.map((d) => {
            const schema = getSchema(d)
            return (
              <div className="fgroup" key={d}>
                <div className="fgroup-title">{dicon(d)} {d}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div className="field" style={{ flex: 1 }}><label>{expLabels(d).a}</label>
                    <input value={p.dirExp[d]?.a || ''} onChange={(e) => setDirExp(d, 'a', e.target.value)} placeholder="3" />
                  </div>
                  <div className="field" style={{ flex: 1 }}><label>{expLabels(d).b}</label>
                    <input value={p.dirExp[d]?.b || ''} onChange={(e) => setDirExp(d, 'b', e.target.value)} placeholder="12000" />
                  </div>
                </div>
                {d === 'Агро' ? (
                  <>
                    <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, margin: '8px 0 6px' }}>Виды работ</div>
                    <div className="checks" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
                      {AGRO_WORKS.map((w) => <label className="check" key={w}><input type="checkbox" checked={has(p.agroWorks, w)} onChange={() => upd({ agroWorks: toggle(p.agroWorks, w) })} /> {w}</label>)}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, margin: '10px 0 6px' }}>Культуры</div>
                    <div className="checks" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
                      {AGRO_CROPS.map((c) => <label className="check" key={c}><input type="checkbox" checked={has(p.agroCrops, c)} onChange={() => upd({ agroCrops: toggle(p.agroCrops, c) })} /> {c}</label>)}
                    </div>
                  </>
                ) : schema ? (
                  schema.fields.map((f: SchemaField, i) => (
                    f.type === 'check'
                      ? <label className="check" key={i}><input type="checkbox" checked={!!p.dirFields[dirKey(d, f.label)]} onChange={() => toggleDirField(d, f.label)} /> {f.label}</label>
                      : f.type === 'select'
                        ? <div className="field" key={i} style={{ marginTop: 8 }}><label>{f.label}</label><select>{(f.options || []).map((o) => <option key={o}>{o}</option>)}</select></div>
                        : <div className="field" key={i} style={{ marginTop: 8 }}><label>{f.label}</label><input /></div>
                  ))
                ) : <div className="lead" style={{ fontSize: 13, margin: 0 }}>Специфичные вопросы этого направления — в проработке.</div>}
              </div>
            )
          })}

          <div className="fgroup">
            <div className="fgroup-title">О себе</div>
            <textarea rows={4} value={p.about} onChange={(e) => upd({ about: e.target.value })}
              style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 12, fontSize: 15, fontFamily: 'inherit', resize: 'vertical' }} />
          </div>

          <div className="fgroup">
            <div className="fgroup-title">Ссылки и оплата</div>
            <div className="field"><label>Instagram / соцсеть</label><input value={p.socials[0] || ''} onChange={(e) => upd({ socials: [e.target.value] })} placeholder="instagram.com/…" /></div>
            <div className="field"><label>Желаемая оплата</label><input value={p.pay} onChange={(e) => upd({ pay: e.target.value })} /></div>
          </div>

          <button className="btn block" onClick={() => setEdit(false)}>Готово</button>
        </div>
      )}

      {!edit && <div className="note" style={{ marginTop: 14 }}>Это ваше резюме — его видят заказчики. Чтобы вас нашли, подайте объявление «ищу работу» (данные возьмутся отсюда).</div>}
    </div>
  )
}
