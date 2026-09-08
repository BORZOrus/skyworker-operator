import { useState } from 'react'

// Оставляем только цифры номера (10 знаков после кода +7).
// Если ввели/вставили 11 цифр с ведущей 7 или 8 (код страны) — отбрасываем её.
function normalize(raw: string): string {
  let d = raw.replace(/\D/g, '')
  if (d.length === 11 && (d[0] === '7' || d[0] === '8')) d = d.slice(1)
  return d.slice(0, 10)
}

// Форматируем как 707 123 45 67
function format(d: string): string {
  const p1 = d.slice(0, 3), p2 = d.slice(3, 6), p3 = d.slice(6, 8), p4 = d.slice(8, 10)
  let s = p1
  if (p2) s += ' ' + p2
  if (p3) s += ' ' + p3
  if (p4) s += ' ' + p4
  return s
}

// Поле телефона с фиксированным префиксом +7.
// onChange отдаёт полный номер в формате +7XXXXXXXXXX (или '' если пусто).
export default function PhoneInput({ onChange }: { onChange?: (fullPhone: string) => void }) {
  const [digits, setDigits] = useState('')
  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = normalize(e.target.value)
    setDigits(d)
    onChange?.(d ? '+7' + d : '')
  }
  return (
    <div className="phone">
      <span className="phone-cc">+7</span>
      <input
        type="tel"
        inputMode="numeric"
        value={format(digits)}
        onChange={handle}
        placeholder="707 123 45 67"
      />
    </div>
  )
}
