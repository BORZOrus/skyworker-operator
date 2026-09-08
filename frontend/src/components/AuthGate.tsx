import { useState } from 'react'
import { Link } from 'react-router-dom'
import { setUser, type UserRole } from '../store'
import PhoneInput from './PhoneInput'

const ROLES: { key: UserRole; label: string; hint: string }[] = [
  { key: 'operator', label: 'Оператор', hint: 'ищу работу' },
  { key: 'company', label: 'Исполнитель', hint: 'оказываю услуги своим парком' },
  { key: 'customer', label: 'Заказчик', hint: 'ищу, кто выполнит работу' },
]

// Микро-регистрация: телефон + имя + роль (~20 сек).
// Порог входа перед действием (контакт, отклик, размещение).
export default function AuthGate({ reason, onDone, onClose }: {
  reason?: string
  onDone: () => void
  onClose: () => void
}) {
  const [step, setStep] = useState<'form' | 'code'>('form')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<UserRole>('operator')
  const [code, setCode] = useState('')

  const ok = name.trim().length > 1 && phone.replace(/\D/g, '').length >= 11
  const codeOk = code.replace(/\D/g, '').length === 4

  function toCode() {
    if (!ok) return
    // Демо: «отправляем SMS». Реальная проверка кода — на бэкенде.
    setStep('code')
  }
  function confirm() {
    if (!codeOk) return
    setUser({ name: name.trim(), phone: phone.trim(), role, createdAt: new Date().toISOString() })
    onDone()
  }

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal auth" onClick={(e) => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose}>✕</button>

        {step === 'form' ? (
          <>
            <h3>Регистрация за 20 секунд</h3>
            <p className="auth-reason">{reason || 'Чтобы связаться и откликаться, оставьте контакт. Полную анкету заполните позже — по желанию.'}</p>

            <div className="field"><label>Как вас зовут / компания</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя или название" />
            </div>
            <div className="field"><label>Телефон</label>
              <PhoneInput onChange={setPhone} />
            </div>
            <div className="field"><label>Вы кто</label>
              <div className="rolepick">
                {ROLES.map((r) => (
                  <button key={r.key} type="button"
                    className={`rolebtn${role === r.key ? ' on' : ''}`}
                    onClick={() => setRole(r.key)}>
                    <b>{r.label}</b><span>{r.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <button className="btn block" disabled={!ok} onClick={toCode}>Получить код</button>
            <p className="auth-note">Нажимая «Получить код», вы соглашаетесь на обработку персональных данных согласно <Link to="/privacy" onClick={onClose} style={{ color: 'var(--accent)' }}>Политике конфиденциальности</Link>. Номер не публикуется — он нужен, чтобы стороны могли связаться.</p>
          </>
        ) : (
          <>
            <h3>Подтвердите номер</h3>
            <p className="auth-reason">Мы отправили код на <b>{phone}</b>. Введите его, чтобы подтвердить номер.</p>
            <div className="field"><label>Код из SMS</label>
              <input className="codeinput" inputMode="numeric" maxLength={4} value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="— — — —" autoFocus />
            </div>
            <div className="demo-hint">Демо-режим: SMS пока не отправляется — введите любые 4 цифры. Реальная проверка появится с подключением бэкенда.</div>
            <button className="btn block" disabled={!codeOk} onClick={confirm}>Подтвердить</button>
            <button className="linklike" onClick={() => setStep('form')}>← изменить номер</button>
          </>
        )}
      </div>
    </div>
  )
}
