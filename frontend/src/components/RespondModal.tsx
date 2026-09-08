import { useState } from 'react'
import { getUser, type BoardAd, type UserRole } from '../store'

const ROLE_LABEL: Record<UserRole, string> = {
  operator: 'Оператор', company: 'Исполнитель', customer: 'Заказчик',
}

// Отклик = резюме. Данные тянутся из профиля автоматически,
// оператору не надо ничего заново заполнять. Можно добавить
// сопроводительное сообщение и приложить файл (резюме/портфолио).
export default function RespondModal({ ad, onClose, onSent }: {
  ad: BoardAd; onClose: () => void; onSent: () => void
}) {
  const user = getUser()
  const [msg, setMsg] = useState('')
  const [file, setFile] = useState('')
  const [sent, setSent] = useState(false)

  function submit() {
    onSent()          // фиксируем отклик сразу при отправке
    setSent(true)     // затем показываем экран подтверждения
  }

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal auth" onClick={(e) => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose}>✕</button>

        {sent ? (
          <>
            <h3>Отклик отправлен</h3>
            <p className="auth-reason">Ваше резюме ушло автору объявления «{ad.title}». Он увидит ваш профиль и контакт и свяжется с вами. Отклик сохранён в разделе «Мои заявки».</p>
            <button className="btn block" onClick={onClose}>Готово</button>
          </>
        ) : (
          <>
            <h3>Откликнуться</h3>
            <p className="auth-reason">Автору уйдёт ваше резюме — оно собирается из профиля автоматически, заполнять заново ничего не нужно.</p>

            <div className="resume-card">
              <div className="resume-row"><span>Имя / компания</span><b>{user?.name || '—'}</b></div>
              <div className="resume-row"><span>Телефон</span><b>{user?.phone || '—'}</b></div>
              <div className="resume-row"><span>Роль</span><b>{user ? ROLE_LABEL[user.role] : '—'}</b></div>
            </div>
            <div className="demo-hint">Чем полнее ваш профиль (техника, допуски, портфолио), тем выше шанс, что автор выберет именно вас. Дополнить профиль можно в кабинете.</div>

            <div className="field"><label>Сопроводительное сообщение (необязательно)</label>
              <textarea rows={3} value={msg} onChange={(e) => setMsg(e.target.value)}
                placeholder="Коротко: почему подходите, опыт по задаче, готовность по срокам"
                style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 12, fontSize: 15, fontFamily: 'inherit', resize: 'vertical' }} />
            </div>

            <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Резюме / портфолио (необязательно)</label>
            <label className="filestub">📎 {file || 'Прикрепить файл'} <span>PDF, JPG — до 10 МБ (заглушка)</span>
              <input type="file" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files?.[0]?.name || '')} />
            </label>

            <div style={{ height: 14 }} />
            <button className="btn block" onClick={submit}>Отправить отклик</button>
          </>
        )}
      </div>
    </div>
  )
}
