import { DIRECTIONS } from '../data'

const BASE = import.meta.env.BASE_URL

// Единая иконка направления: картинка-кнопка, если задана, иначе эмодзи.
export default function DirIcon({ label, size = 22 }: { label: string; size?: number }) {
  const d = DIRECTIONS.find((x) => x.label === label)
  if (d?.img) return <img src={`${BASE}${d.img}`} alt="" className="dir-img" style={{ width: size, height: size }} />
  return <>{d?.icon ?? ''}</>
}
