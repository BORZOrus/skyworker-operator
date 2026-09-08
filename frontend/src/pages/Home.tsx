import { Link } from 'react-router-dom'
import type { UserRole } from '../store'

// Домашний экран кабинета. Под выбранной вкладкой — только разделы этой роли.
type Card = { icon: string; title: string; desc: string; to: string; state?: object }

const DASH: Record<UserRole, { hi: string; sub: string; cards: Card[] }> = {
  operator: {
    hi: 'Кабинет оператора',
    sub: 'Вы пилот и ищете работу. Заполните анкету — она же ваше резюме — и подайте объявление в нужных направлениях.',
    cards: [
      { icon: '📝', title: 'Моя анкета', desc: 'Допуски, направления (агро, съёмка…), опыт. Это и есть ваше резюме — заполняете один раз.', to: '/cabinet' },
      { icon: '💼', title: 'Найти работу', desc: 'Кто ищет операторов — откликайтесь. Плюс объявления других операторов для сравнения.', to: '/board', state: { view: 'op-work' } },
      { icon: '📨', title: 'Мои отклики', desc: 'Куда откликнулись и какие объявления разместили.', to: '/requests' },
    ],
  },
  company: {
    hi: 'Кабинет компании',
    sub: 'Вы оказываете услуги своим парком дронов. Получайте заказы и при необходимости нанимайте операторов.',
    cards: [
      { icon: '🏢', title: 'Профиль компании', desc: 'Кто вы: парк дронов, направления, цены, документы, рейтинг. Это ваша визитка для заказчиков.', to: '/cabinet' },
      { icon: '📥', title: 'Найти заказы', desc: 'Заказчики, которым нужна услуга под ключ. Откликайтесь. Плюс другие компании для сравнения.', to: '/board', state: { view: 'co-orders' } },
      { icon: '👷', title: 'Нанять операторов', desc: 'Операторы, которые ищут работу. Позовите на объём. Плюс кто ещё их ищет.', to: '/board', state: { view: 'co-hire' } },
      { icon: '📨', title: 'Мои отклики и заявки', desc: 'Отклики на заказы и размещённые объявления.', to: '/requests' },
    ],
  },
  customer: {
    hi: 'Кабинет заказчика',
    sub: 'Вам нужна работа дроном. Найдите компанию под ключ или отдельного оператора.',
    cards: [
      { icon: '🏢', title: 'Профиль компании', desc: 'Кто вы: компания или хозяйство, реквизиты, контакты. Исполнители доверяют проверенным заказчикам.', to: '/cabinet' },
      { icon: '🔧', title: 'Ищу исполнителя', desc: 'Компании с услугами под ключ — приедут со своим парком. Плюс другие заказчики для сравнения.', to: '/board', state: { view: 'cu-exec' } },
      { icon: '🚁', title: 'Ищу оператора', desc: 'Отдельные операторы на вашу технику. Плюс кто ещё их ищет.', to: '/board', state: { view: 'cu-op' } },
      { icon: '📨', title: 'Мои заявки и отклики', desc: 'Ваши объявления и отклики.', to: '/requests' },
    ],
  },
}

export default function Home({ mode }: { mode: UserRole }) {
  const d = DASH[mode]
  return (
    <div className="home">
      <div className="home-hi">
        <h1>{d.hi}</h1>
        <p>{d.sub}</p>
      </div>
      <div className="home-cards">
        {d.cards.map((c) => (
          <Link key={c.title} to={c.to} state={c.state} className="homecard">
            <div className="hc-ic">{c.icon}</div>
            <div className="hc-body">
              <b>{c.title}</b>
              <span>{c.desc}</span>
            </div>
            <div className="hc-arr">›</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
