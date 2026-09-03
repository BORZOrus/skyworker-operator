import { useState, useRef, useEffect } from 'react'
import { REGIONS, CITIES } from '../regions'

// Значение выбора: 'Область' = вся область; 'Область|Город' = конкретный город.
interface Props {
  selected: string[]
  onChange: (v: string[]) => void
}

export default function RegionPicker({ selected, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const has = (v: string) => selected.includes(v)
  const set = (v: string[]) => onChange(v)

  // отметить/снять всю область (при этом убираем отдельные города этой области)
  const toggleWhole = (region: string) => {
    if (has(region)) set(selected.filter((s) => s !== region))
    else set([...selected.filter((s) => !s.startsWith(region + '|')), region])
  }
  const toggleCity = (region: string, city: string) => {
    const key = `${region}|${city}`
    if (has(key)) set(selected.filter((s) => s !== key))
    else set([...selected.filter((s) => s !== region), key]) // город снимает «вся область»
  }

  const count = selected.length
  const label = count === 0 ? 'Все регионы' : count === 1 ? selected[0].replace('|', ' · ') : `Регионы (${count})`

  return (
    <div className="regionpicker" ref={ref}>
      <button className="regionbtn" onClick={() => setOpen((v) => !v)}>📍 {label} <span className="chev">{open ? '▲' : '▼'}</span></button>
      {open && (
        <div className="regiondrop">
          <div className="regiondrop-head">
            <span>Область целиком или конкретный город</span>
            {count > 0 && <button className="clearlink" onClick={() => set([])}>Сбросить</button>}
          </div>
          <div className="regionlist">
            {REGIONS.map((region) => {
              const cities = CITIES[region] || []
              const isCity = cities.length <= 1 // города респ. значения — без вложенности
              const openThis = expanded === region
              const citySelectedCount = selected.filter((s) => s.startsWith(region + '|')).length
              return (
                <div className="regionrow" key={region}>
                  <div className="regionrow-main">
                    <label className="check" style={{ flex: 1 }}>
                      <input type="checkbox" checked={has(region)} onChange={() => toggleWhole(region)} />
                      {region}{!isCity && has(region) ? ' — вся' : ''}
                      {citySelectedCount > 0 && <span className="citybadge">{citySelectedCount}</span>}
                    </label>
                    {!isCity && (
                      <button className="expandbtn" onClick={() => setExpanded(openThis ? null : region)}>{openThis ? '▲' : '▼'}</button>
                    )}
                  </div>
                  {!isCity && openThis && (
                    <div className="citylist">
                      {cities.map((c) => (
                        <label className="check" key={c}>
                          <input type="checkbox" checked={has(region) || has(`${region}|${c}`)} disabled={has(region)} onChange={() => toggleCity(region, c)} /> {c}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
