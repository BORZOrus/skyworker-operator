import { useState } from 'react'
import { DIRECTIONS } from '../data'
import { FARM_SCHEMA } from '../fieldSchemas'
import { REGIONS } from '../regions'
import { getCustomerProfile, saveCustomerProfile, customerCompleteness, type CustomerProfile } from '../store'

const CROPS = FARM_SCHEMA.filter((f) => f.group === 'Что выращиваете').map((f) => f.label)
const LAND_TYPES = ['Богарные (без полива)', 'Орошаемые', 'Смешанные']
const OWN_TECH = ['Нет — нужна услуга под ключ', 'Есть дрон — нужен оператор', 'Есть, но не хватает мощности']
const DIRS = DIRECTIONS.slice(1)
const dicon = (d: string) => DIRECTIONS.find((x) => x.label === d)?.icon
const imgSrc = (photo: string) => photo.startsWith('data:') || photo.startsWith('http') ? photo : import.meta.env.BASE_URL + photo
// Подсказка «что описать» по отрасли (для не-агро заказчиков — не только фермеры)
const NEED_HINT: Record<string, string> = {
  'Геодезия': 'Площадь участка, что нужно (ортофото / 3D / объёмы), сроки',
  'Картография': 'Территория, тип карт, для чего',
  'Строительный контроль': 'Объект, что снимать, периодичность',
  'Инспекция и мониторинг': 'Объекты (ЛЭП / трубы / здания), что искать',
  'Фото/видео': 'Что снять, где, когда, для чего',
  'Грузовая доставка': 'Что и куда доставить, вес, маршрут',
}
const needHint = (d: string) => NEED_HINT[d] || 'Опишите, что именно вам нужно в этом направлении'

export default function CustomerProfileView() {
  const [p, setP] = useState<CustomerProfile>(getCustomerProfile())
  const [flash, setFlash] = useState(false)
  const [edit, setEdit] = useState(false)

  function upd(patch: Partial<CustomerProfile>) {
    const np = { ...p, ...patch }; setP(np); saveCustomerProfile(np)
    setFlash(true); setTimeout(() => setFlash(false), 1200)
  }
  const has = (arr: string[], v: string) => arr.includes(v)
  const toggle = (arr: string[], v: string) => arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
  const setNeed = (d: string, v: string) => upd({ dirNeeds: { ...p.dirNeeds, [d]: v } })
  function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return
    const r = new FileReader(); r.onload = () => upd({ logo: String(r.result) }); r.readAsDataURL(f)
  }
  const fill = customerCompleteness(p)

  return (
    <div className="anketa">
      <div className="note" style={{ marginTop: 0, marginBottom: 14 }}>Профиль <b>не публикуется в поиске</b> — он для доверия и безопасности. Исполнители, которым вы отвечаете, видят, что вы реальная компания или хозяйство.</div>

      {/* Документ-профиль */}
      <div className="resume-doc">
        <div className="rd-hero">
          {p.logo ? <img src={imgSrc(p.logo)} alt="" className="rd-photo sq" /> : <div className="rd-photo sq rd-ph">{p.name.replace(/[^А-Яа-яA-Za-z]/g, '').slice(0, 2).toUpperCase()}</div>}
          <div className="rd-head-txt">
            <h3>{p.name}</h3>
            <div className="rd-role">{p.legal}</div>
            <div className="rd-loc">📍 {p.city}, {p.region}</div>
          </div>
        </div>
        <div className="rd-body">
          <div className="rd-docs">{p.bin && <span className="doc-badge">✓ БИН/ИИН {p.bin}</span>}</div>
          {p.lookingFor && <div className="rd-sec"><h4>Что ищет</h4><p>{p.lookingFor}</p></div>}

          {p.directions.map((d) => {
            if (d === 'Агро') {
              return (
                <div className="rd-sec rd-dir" key={d}>
                  <div className="rd-dir-top"><h4>🌾 Агро · хозяйство</h4>{p.area && <span className="rd-dir-exp">{Number(p.area).toLocaleString('ru-RU')} га · {p.landType}</span>}</div>
                  {p.crops.length > 0 && <div className="rd-chips">{p.crops.map((c) => <span className="chip crop" key={c}>🌾 {c}</span>)}</div>}
                  <div className="rd-empty" style={{ marginTop: 6 }}>{p.ownTech}</div>
                </div>
              )
            }
            return (
              <div className="rd-sec rd-dir" key={d}>
                <h4>{dicon(d)} {d}</h4>
                <p>{p.dirNeeds[d] || <span className="rd-empty">не описано</span>}</p>
              </div>
            )
          })}

          {p.about && <div className="rd-sec"><h4>О компании</h4><p>{p.about}</p></div>}
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
            <div className="fgroup-title">Реквизиты</div>
            <div className="photofield">
              <label className="photo-drop">{p.logo ? <img src={imgSrc(p.logo)} alt="" className="photo-prev" /> : <span className="photo-plus">＋</span>}<input type="file" accept="image/*" style={{ display: 'none' }} onChange={onLogo} /></label>
              <div className="photofield-txt"><b>Логотип / фото</b><span>По желанию</span></div>
            </div>
            <div className="field"><label>Компания / имя</label><input value={p.name} onChange={(e) => upd({ name: e.target.value })} /></div>
            <div className="field"><label>Юридическая форма</label><select value={p.legal} onChange={(e) => upd({ legal: e.target.value })}><option>Физлицо</option><option>ИП</option><option>ТОО</option><option>Крестьянское хозяйство (ФХ)</option></select></div>
            <div className="field"><label>БИН / ИИН</label><input value={p.bin} onChange={(e) => upd({ bin: e.target.value })} placeholder="12 цифр" /></div>
            <div className="lead" style={{ fontSize: 12, margin: '2px 0 0' }}>Нужен для подтверждения, что вы реальная компания. Не публикуется.</div>
          </div>

          <div className="fgroup">
            <div className="fgroup-title">Локация и запрос</div>
            <div className="field"><label>Город</label><input value={p.city} onChange={(e) => upd({ city: e.target.value })} /></div>
            <div className="field"><label>Регион</label><select value={p.region} onChange={(e) => upd({ region: e.target.value })}>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select></div>
            <div className="field"><label>Что ищете</label><input value={p.lookingFor} onChange={(e) => upd({ lookingFor: e.target.value })} placeholder="Оператора на сезон / услугу под ключ" /></div>
          </div>

          <div className="fgroup">
            <div className="fgroup-title">В каких отраслях заказываете</div>
            <div className="lead" style={{ fontSize: 13, marginBottom: 8 }}>Отметьте — под каждой появятся свои поля.</div>
            <div className="checks" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
              {DIRS.map((d) => <label className="check" key={d.label}><input type="checkbox" checked={has(p.directions, d.label)} onChange={() => upd({ directions: toggle(p.directions, d.label) })} /> {d.icon} {d.label}</label>)}
            </div>
          </div>

          {/* Блок каждой выбранной отрасли */}
          {p.directions.map((d) => d === 'Агро' ? (
            <div className="fgroup" key={d}>
              <div className="fgroup-title">🌾 Агро · хозяйство</div>
              <div className="note" style={{ marginTop: 0, marginBottom: 10 }}>Заполните — получите точные отклики с реальной ценой, без пустых звонков «сколько гектаров».</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, margin: '4px 0 6px' }}>Что выращиваете</div>
              <div className="checks" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>{CROPS.map((c) => <label className="check" key={c}><input type="checkbox" checked={p.crops.includes(c)} onChange={() => upd({ crops: toggle(p.crops, c) })} /> {c}</label>)}</div>
              <div className="field" style={{ marginTop: 10 }}><label>Общая площадь, га</label><input value={p.area} onChange={(e) => upd({ area: e.target.value })} placeholder="4500" /></div>
              <div className="field"><label>Тип земель</label><select value={p.landType} onChange={(e) => upd({ landType: e.target.value })}>{LAND_TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
              <div className="field"><label>Своя техника</label><select value={p.ownTech} onChange={(e) => upd({ ownTech: e.target.value })}>{OWN_TECH.map((t) => <option key={t}>{t}</option>)}</select></div>
            </div>
          ) : (
            <div className="fgroup" key={d}>
              <div className="fgroup-title">{dicon(d)} {d}</div>
              <div className="field"><label>Что вам нужно в этом направлении</label>
                <textarea rows={3} value={p.dirNeeds[d] || ''} onChange={(e) => setNeed(d, e.target.value)} placeholder={needHint(d)}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 12, fontSize: 15, fontFamily: 'inherit', resize: 'vertical' }} />
              </div>
            </div>
          ))}

          <div className="fgroup"><div className="fgroup-title">О компании</div>
            <textarea rows={3} value={p.about} onChange={(e) => upd({ about: e.target.value })} style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 12, fontSize: 15, fontFamily: 'inherit', resize: 'vertical' }} />
          </div>
          <button className="btn block" onClick={() => setEdit(false)}>Готово</button>
        </div>
      )}
    </div>
  )
}
