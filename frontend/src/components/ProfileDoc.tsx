import type { DemoProfile } from '../demoData'

const imgSrc = (photo: string) => import.meta.env.BASE_URL + 'portfolio/' + photo

// Read-only показ профиля/портфолио автора объявления.
export default function ProfileDoc({ p }: { p: DemoProfile }) {
  return (
    <div className="resume-doc">
      <div className="rd-hero">
        <img src={imgSrc(p.photo)} alt="" className={`rd-photo${p.square ? ' sq' : ''}`} />
        <div className="rd-head-txt">
          <h3>{p.name}</h3>
          <div className="rd-role">{p.sub}</div>
          <div className="rd-loc">📍 {p.loc}</div>
        </div>
      </div>
      <div className="rd-body">
        {p.isPrivate && <div className="note" style={{ marginTop: 0, marginBottom: 12 }}>Профиль заказчика виден частично — полные данные хранятся в базе сервиса.</div>}
        <div className="rd-docs">{p.docs.map((d) => <span className="doc-badge" key={d}>{d}</span>)}</div>
        {p.expTotal && <div className="rd-exp-total">Общий стаж: <b>{p.expTotal}</b></div>}
        {p.fleet && <div className="rd-exp-total">Парк: <b>{p.fleet}</b></div>}
        {p.about && <div className="rd-sec"><h4>{p.role === 'customer' ? 'О компании' : p.role === 'company' ? 'О компании' : 'О себе'}</h4><p>{p.about}</p></div>}
        {p.dirs.map((d) => (
          <div className="rd-sec rd-dir" key={d.name}>
            <div className="rd-dir-top"><h4>{d.icon} {d.name}</h4>{d.exp && <span className="rd-dir-exp">{d.exp}</span>}</div>
            {d.chips && d.chips.length > 0 && <div className="rd-chips">{d.chips.map((s) => <span className="chip" key={s}>{s}</span>)}</div>}
            {d.crops && d.crops.length > 0 && <div className="rd-chips" style={{ marginTop: 6 }}>{d.crops.map((c) => <span className="chip crop" key={c}>🌾 {c}</span>)}</div>}
          </div>
        ))}
        {p.links && <div className="rd-sec"><h4>Ссылки</h4><p>{p.links}</p></div>}
        {p.pay && <div className="rd-foot"><span className="rd-pay">{p.pay}</span></div>}
      </div>
    </div>
  )
}
