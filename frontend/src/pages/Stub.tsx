import { Link } from 'react-router-dom'

export default function Stub({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="page">
      <h1>{title}</h1>
      <div className="stub">
        <div className="big">{icon}</div>
        {text}
      </div>
      <div style={{ height: 16 }} />
      <Link to="/" className="btn block ghost" style={{ display: 'block', textAlign: 'center' }}>← В каталог</Link>
    </div>
  )
}
