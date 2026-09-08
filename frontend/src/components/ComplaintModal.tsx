import { useState } from 'react'
import { addComplaint } from '../store'

const REASONS = [
  'Не вышел на связь / сорвал договорённость',
  'Некачественно выполненная работа',
  'Обман по оплате / условиям',
  'Недостоверная анкета или объявление',
  'Грубость / непрофессиональное поведение',
  'Другое',
]

// Жалоба уходит только администрации сервиса и нигде не публикуется.
export default function ComplaintModal({ targetId, targetName, onClose }: {
  targetId: string; targetName: string; onClose: () => void
}) {
  const [reason, setReason] = useState(REASONS[0])
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)

  function submit() {
    addComplaint({ targetId, targetName, reason, text: text.trim(), createdAt: new Date().toISOString() })
    setSent(true)
  }

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal auth" onClick={(e) => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose}>✕</button>

        {sent ? (
          <>
            <h3>Жалоба отправлена</h3>
            <p className="auth-reason">Спасибо. Жалоба на «{targetName}» передана администрации сервиса и публично не отображается. Мы учитываем такие обращения.</p>
            <button className="btn block" onClick={onClose}>Готово</button>
          </>
        ) : (
          <>
            <h3>Пожаловаться</h3>
            <p className="auth-reason">На «{targetName}». Жалоба конфиденциальна — уходит только администрации, другие пользователи её не видят.</p>
            <div className="field"><label>Причина</label>
              <select value={reason} onChange={(e) => setReason(e.target.value)}>
                {REASONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="field"><label>Что произошло</label>
              <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)}
                placeholder="Опишите ситуацию: когда, что случилось, детали"
                style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 12, fontSize: 15, fontFamily: 'inherit', resize: 'vertical' }} />
            </div>
            <button className="btn block" onClick={submit}>Отправить жалобу</button>
          </>
        )}
      </div>
    </div>
  )
}
