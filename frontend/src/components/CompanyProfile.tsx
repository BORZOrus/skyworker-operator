import { useState } from 'react'
import { DIRECTIONS } from '../data'
import { getSchema, type SchemaField } from '../fieldSchemas'
import { REGIONS } from '../regions'
import { getCompanyProfile, saveCompanyProfile, companyCompleteness, expLabels, type CompanyProfile } from '../store'

const AGRO = getSchema('Агро')!
const AGRO_WORKS = AGRO.fields.filter((f) => f.group === 'Виды работ').map((f) => f.label)
const AGRO_CROPS = AGRO.fields.filter((f) => f.group === 'Культуры').map((f) => f.label)
const DIRS = DIRECTIONS.slice(1)
const dicon = (d: string) => DIRECTIONS.find((x) => x.label === d)?.icon
const imgSrc = (photo: string) => photo.startsWith('data:') || photo.startsWith('http') ? photo : import.meta.env.BASE_URL + photo

export default function CompanyProfileView() {
  const [p, setP] = useState<CompanyProfile>(getCompanyProfile())
  const [flash, setFlash] = useState(false)
  const [edit, setEdit] = useState(false)

  function upd(patch: Partial<CompanyProfile>) {
    const np = { ...p, ...patch }; setP(np); saveCompanyProfile(np)
    setFlash(true); setTimeout(() => setFlash(false), 1200)
  }
  const has = (arr: string[], v: string) => arr.includes(v)
  const toggle = (arr: string[], v: string) => arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
  const dirKey = (d: string, l: string) => `${d}::${l}`
  const toggleDirField = (d: string, l: string) => upd({ dirFields: { ...p.dirFields, [dirKey(d, l)]: !p.dirFields[dirKey(d, l)] } })
  const setDirExp = (d: string, k: 'a' | 'b', v: string) => upd({ dirExp: { ...p.dirExp, [d]: { ...(p.dirExp[d] || { a: '', b: '' }), [k]: v } } })
  const dirSkills = (d: string) => Object.entries(p.dirFields).filter(([k, v]) => v && k.startsWith(d + '::')).map(([k]) => k.split('::')[1])
  function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return
    const r = new FileReader(); r.onload = () => upd({ logo: String(r.result) }); r.readAsDataURL(f)
  }
  const fill = companyCompleteness(p)
  const dirData = (d: string) => {
    const e = p.dirExp[d] || { a: '', b: '' }; const L = expLabels(d)
    const exp = [e.a && `${e.a} ${L.a.toLowerCase()}`, e.b && `${Number(e.b).toLocaleString('ru-RU')} ${L.b.toLowerCase()}`].filter(Boolean).join(' · ')
    return { exp, skills: d === 'Агро' ? p.agroWorks : dirSkills(d), crops: d === 'Агро' ? p.agroCrops : [] }
  }

  return (
    <div className="anketa">
      {/* Документ-витрина */}
      <div className="resume-doc">
        <div className="rd-hero">
          {p.logo ? <img src={imgSrc(p.logo)} alt="" className="rd-photo sq" /> : <div className="rd-photo sq rd-ph">{p.name.replace(/[^А-Яа-яA-Za-z]/g, '').slice(0, 2).toUpperCase()}</div>}
          <div className="rd-head-txt">
            <h3>{p.name}</h3>
            <div className="rd-role">{p.legal} · {p.vat}</div>
            <div className="rd-loc">📍 {p.coverAll ? 'по всему Казахстану' : `${p.city}, ${p.region}`}</div>
          </div>
        </div>
        <div className="rd-body">
          <div className="rd-docs">
            <span className="doc-badge">★ 4.9 · рейтинг</span>
            {p.bin && <span className="doc-badge">✓ БИН {p.bin}</span>}
            {p.vat.includes('Плательщик') && <span className="doc-badge">✓ НДС</span>}
          </div>
          {p.fleet && <div className="rd-exp-total">Парк: <b>{p.fleet}</b>{p.brigades ? ` · ${p.brigades} бригады` : ''}</div>}
          {p.about && <div className="rd-sec"><h4>О компании</h4><p>{p.about}</p></div>}
          {p.directions.map((d) => {
            const dd = dirData(d)
            return (
              <div className="rd-sec rd-dir" key={d}>
                <div className="rd-dir-top"><h4>{dicon(d)} {d}</h4>{dd.exp && <span className="rd-dir-exp">{dd.exp}</span>}</div>
                {dd.skills.length > 0 && <div className="rd-chips">{dd.skills.map((s) => <span className="chip" key={s}>{s}</span>)}</div>}
                {dd.crops.length > 0 && <div className="rd-chips" style={{ marginTop: 6 }}>{dd.crops.map((c) => <span className="chip crop" key={c}>🌾 {c}</span>)}</div>}
                {dd.skills.length === 0 && dd.crops.length === 0 && <div className="rd-empty">услуги не отмечены</div>}
              </div>
            )
          })}
          {p.site && <div className="rd-sec"><h4>Сайт и соцсети</h4><p>🌐 {p.site}{p.socials[0] ? ` · 📷 ${p.socials[0]}` : ''}</p></div>}
          <div className="rd-foot"><span className="rd-pay">{p.rate}</span></div>
        </div>
      </div>

      <button className={`edit-toggle${edit ? ' open' : ''}`} onClick={() => setEdit((v) => !v)}>
        <span className="et-txt">
          <b>{edit ? 'Свернуть профиль' : 'Редактировать профиль'}</b>
          <small>{edit ? 'скрыть форму' : `открыть поля и заполнить · сейчас ${fill}%`}</small>
        </span>
        <span className="et-chev">›</span>
      </button>

      {edit && (
        <div className="anketa-form">
          <div className="fillbox">
            <div className="fillbox-top"><span>Профиль на <b>{fill}%</b></span><span className="fillbox-hint">{flash ? '✓ сохранено' : 'меняется — сразу сохраняется'}</span></div>
            <div className="fillbar"><div className="fillbar-in" style={{ width: `${fill}%` }} /></div>
          </div>

          <div className="fgroup">
            <div className="fgroup-title">Компания</div>
            <div className="photofield">
              <label className="photo-drop">{p.logo ? <img src={imgSrc(p.logo)} alt="" className="photo-prev" /> : <span className="photo-plus">＋</span>}<input type="file" accept="image/*" style={{ display: 'none' }} onChange={onLogo} /></label>
              <div className="photofield-txt"><b>Логотип</b><span>Делает профиль узнаваемым</span></div>
            </div>
            <div className="field"><label>Название</label><input value={p.name} onChange={(e) => upd({ name: e.target.value })} /></div>
            <div className="field"><label>Юридическая форма</label><select value={p.legal} onChange={(e) => upd({ legal: e.target.value })}><option>ИП</option><option>ТОО</option><option>Крестьянское хозяйство (ФХ)</option></select></div>
            <div className="field"><label>БИН</label><input value={p.bin} onChange={(e) => upd({ bin: e.target.value })} placeholder="12 цифр" /></div>
            <div className="field"><label>НДС</label><select value={p.vat} onChange={(e) => upd({ vat: e.target.value })}><option>Работаю без НДС</option><option>Плательщик НДС</option></select></div>
          </div>

          <div className="fgroup">
            <div className="fgroup-title">География и парк</div>
            <div className="field"><label>Город</label><input value={p.city} onChange={(e) => upd({ city: e.target.value })} /></div>
            <div className="field"><label>Регион</label><select value={p.region} onChange={(e) => upd({ region: e.target.value })}>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select></div>
            <label className="check"><input type="checkbox" checked={p.coverAll} onChange={(e) => upd({ coverAll: e.target.checked })} /> Работаем по всему Казахстану</label>
            <div className="field" style={{ marginTop: 8 }}><label>Парк дронов</label><input value={p.fleet} onChange={(e) => upd({ fleet: e.target.value })} placeholder="3× DJI Agras T50" /></div>
            <div className="field"><label>Количество бригад</label><input value={p.brigades} onChange={(e) => upd({ brigades: e.target.value })} placeholder="3" /></div>
          </div>

          <div className="fgroup">
            <div className="fgroup-title">Направления услуг</div>
            <div className="checks" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
              {DIRS.map((d) => <label className="check" key={d.label}><input type="checkbox" checked={has(p.directions, d.label)} onChange={() => upd({ directions: toggle(p.directions, d.label) })} /> {d.icon} {d.label}</label>)}
            </div>
          </div>

          {p.directions.map((d) => {
            const schema = getSchema(d)
            return (
              <div className="fgroup" key={d}>
                <div className="fgroup-title">{dicon(d)} {d}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div className="field" style={{ flex: 1 }}><label>{expLabels(d).a}</label><input value={p.dirExp[d]?.a || ''} onChange={(e) => setDirExp(d, 'a', e.target.value)} placeholder="3" /></div>
                  <div className="field" style={{ flex: 1 }}><label>{expLabels(d).b}</label><input value={p.dirExp[d]?.b || ''} onChange={(e) => setDirExp(d, 'b', e.target.value)} placeholder="85000" /></div>
                </div>
                {d === 'Агро' ? (
                  <>
                    <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, margin: '8px 0 6px' }}>Виды работ</div>
                    <div className="checks" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>{AGRO_WORKS.map((w) => <label className="check" key={w}><input type="checkbox" checked={has(p.agroWorks, w)} onChange={() => upd({ agroWorks: toggle(p.agroWorks, w) })} /> {w}</label>)}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, margin: '10px 0 6px' }}>Культуры</div>
                    <div className="checks" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>{AGRO_CROPS.map((c) => <label className="check" key={c}><input type="checkbox" checked={has(p.agroCrops, c)} onChange={() => upd({ agroCrops: toggle(p.agroCrops, c) })} /> {c}</label>)}</div>
                  </>
                ) : schema ? schema.fields.map((f: SchemaField, i) => (
                  f.type === 'check'
                    ? <label className="check" key={i}><input type="checkbox" checked={!!p.dirFields[dirKey(d, f.label)]} onChange={() => toggleDirField(d, f.label)} /> {f.label}</label>
                    : <div className="field" key={i} style={{ marginTop: 8 }}><label>{f.label}</label>{f.type === 'select' ? <select>{(f.options || []).map((o) => <option key={o}>{o}</option>)}</select> : <input />}</div>
                )) : <div className="lead" style={{ fontSize: 13, margin: 0 }}>Вопросы этого направления — в проработке.</div>}
              </div>
            )
          })}

          <div className="fgroup"><div className="fgroup-title">О компании</div>
            <textarea rows={4} value={p.about} onChange={(e) => upd({ about: e.target.value })} style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 12, fontSize: 15, fontFamily: 'inherit', resize: 'vertical' }} />
          </div>
          <div className="fgroup"><div className="fgroup-title">Сайт, соцсети, цена</div>
            <div className="field"><label>Сайт</label><input value={p.site} onChange={(e) => upd({ site: e.target.value })} placeholder="jedi-agro.kz" /></div>
            <div className="field"><label>Instagram</label><input value={p.socials[0] || ''} onChange={(e) => upd({ socials: [e.target.value] })} placeholder="instagram.com/…" /></div>
            <div className="field"><label>Ставка</label><input value={p.rate} onChange={(e) => upd({ rate: e.target.value })} placeholder="от 2 700 ₸/га" /></div>
          </div>
          <button className="btn block" onClick={() => setEdit(false)}>Готово</button>
        </div>
      )}
    </div>
  )
}
