import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DIRECTIONS } from '../data'
import { REGIONS } from '../regions'

export default function PostRequest() {
  const [sent, setSent] = useState(false)
  const DIRS = DIRECTIONS.slice(1)

  if (sent) {
    return (
      <div className="page">
        <h1>Заявка размещена</h1>
        <div className="stub"><div className="big">✓</div>Ваша заявка опубликована. Подходящие операторы и компании увидят её и откликнутся — отклики придут в раздел «Заявки».</div>
        <div style={{ height: 16 }} />
        <Link to="/" className="btn block" style={{ display: 'block', textAlign: 'center' }}>В каталог</Link>
      </div>
    )
  }

  return (
    <div className="page">
      <h1>Разместить заявку</h1>
      <p className="lead">Опишите задачу — исполнители откликнутся сами. Подходит, когда проще собрать предложения, чем искать вручную.</p>

      <div className="fgroup">
        <div className="fgroup-title">Что нужно</div>
        <div className="field"><label>Тип</label>
          <select><option>Нужен оператор (на мою технику / в штат / на сезон)</option><option>Нужна услуга под ключ (со своим оборудованием)</option></select>
        </div>
        <div className="field"><label>Направление</label>
          <select>{DIRS.map((d) => <option key={d.label}>{d.icon} {d.label}</option>)}</select>
        </div>
        <div className="field"><label>Регион работ</label>
          <select>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select>
        </div>
        <div className="field"><label>Город / посёлок (если важно)</label><input placeholder="Например, Кокшетау" /></div>
      </div>

      <div className="fgroup">
        <div className="fgroup-title">Детали</div>
        <div className="field"><label>Описание задачи</label>
          <textarea rows={4} placeholder="Объём работ, культура/объект, сроки, особые требования" style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 12, fontSize: 15, fontFamily: 'inherit', resize: 'vertical' }} />
        </div>
        <div className="field"><label>Бюджет (необязательно)</label><input placeholder="Например, от 2 500 ₸/га или договорной" /></div>
      </div>

      <div className="fgroup">
        <div className="fgroup-title">Контакты</div>
        <div className="field"><label>Компания / имя</label><input placeholder="ТОО / ИП / ФХ или имя" /></div>
        <div className="field"><label>Телефон</label><input placeholder="+7 ___ ___ __ __" /></div>
        <label className="check"><input type="checkbox" defaultChecked /> Согласен на обработку данных и публикацию заявки для исполнителей</label>
      </div>

      <button className="btn block" onClick={() => setSent(true)}>Опубликовать заявку</button>
    </div>
  )
}
