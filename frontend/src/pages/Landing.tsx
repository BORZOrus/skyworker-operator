import { Link } from 'react-router-dom'
import { DIRECTIONS } from '../data'
import DirIcon from '../components/DirIcon'

const BASE = import.meta.env.BASE_URL
const img = (f: string) => `${BASE}portfolio/${f}`

export default function Landing() {
  return (
    <div className="landing">
      <section className="hero" style={{ backgroundImage: `linear-gradient(rgba(2,10,10,.66),rgba(2,10,10,.78)), url(${img('agras_field.jpg')})` }}>
        <div className="hero-in">
          <div className="hero-badge">Официальный дистрибьютор DJI Agriculture в Казахстане</div>
          <h1>Профессиональные операторы дронов по всему Казахстану</h1>
          <p>Единый реестр операторов и сервисных компаний с подтверждёнными допусками. Подберите исполнителя под конкретную задачу — обработка полей, аэросъёмка, геодезия, инспекция, доставка.</p>
          <div className="hero-cta">
            <Link to="/catalog" state={{ tab: 'op' }} className="btn big">Найти оператора</Link>
            <Link to="/catalog" state={{ tab: 'sv' }} className="btn big">Заказать услугу</Link>
          </div>
          <Link to="/register" className="hero-second">Вы оператор или компания? Разместить анкету →</Link>
        </div>
      </section>

      <section className="lsec">
        <h2>Что вы ищете</h2>
        <div className="how">
          <div className="how-col">
            <div className="how-title">Нанять оператора</div>
            <p className="how-desc">Вам нужен специалист, который выполнит полёты — на вашей технике, в штат, на сезон или на отдельные работы. В профиле видны допуски, опыт и оборудование.</p>
            <Link to="/catalog" state={{ tab: 'op' }} className="btn">Смотреть операторов</Link>
          </div>
          <div className="how-col">
            <div className="how-title">Заказать услугу под ключ</div>
            <p className="how-desc">Вам нужен результат, а не пилот. Сервисная компания приедет со своим парком дронов и выполнит работу полностью — от расчёта до отчёта.</p>
            <Link to="/catalog" state={{ tab: 'sv' }} className="btn">Смотреть услуги</Link>
            <Link to="/board" className="hero-second" style={{ color: 'var(--accent)', marginTop: 14 }}>Или разместите объявление на доске — исполнители откликнутся сами →</Link>
          </div>
        </div>
      </section>

      <section className="lsec gray">
        <h2>Доска заявок — работает в обе стороны</h2>
        <div className="how">
          <div className="how-col">
            <div className="how-title">Ищете исполнителя</div>
            <p className="how-desc">Не нашли в каталоге — разместите объявление «нужен оператор» или «нужны субподрядчики». Подходящие исполнители увидят его и откликнутся сами.</p>
          </div>
          <div className="how-col">
            <div className="how-title">Ищете работу</div>
            <p className="how-desc">Оператор или компания — смотрите заявки заказчиков по своему направлению и региону, откликайтесь напрямую. Или разместите объявление «ищу работу».</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/board" className="btn big">Открыть доску заявок</Link>
        </div>
      </section>

      <section className="lsec gray">
        <h2>Как это работает</h2>
        <div className="how">
          <div className="how-col">
            <div className="how-title">Заказчикам</div>
            <ol>
              <li>Выберите направление и регион работ</li>
              <li>Сравните исполнителей по допускам, опыту, оборудованию и рейтингу</li>
              <li>Свяжитесь напрямую и согласуйте условия</li>
            </ol>
          </div>
          <div className="how-col">
            <div className="how-title">Операторам и компаниям</div>
            <ol>
              <li>Разместите анкету: допуски, техника, портфолио</li>
              <li>Укажите направления и регионы, где готовы работать</li>
              <li>Принимайте входящие заявки от заказчиков</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="lsec">
        <h2>Направления работ</h2>
        <div className="ldirs">
          {DIRECTIONS.slice(1).map((d) => (
            <Link to="/catalog" className="ldir" key={d.label}><span><DirIcon label={d.label} size={26} /></span>{d.label}</Link>
          ))}
        </div>
      </section>

      <section className="lsec gray">
        <h2>Почему Skyworker</h2>
        <div className="lvalue">
          <div className="lvcard">
            <h3>Подтверждённые допуски</h3>
            <p>В каждом профиле — категория оператора, свидетельство внешнего пилота и сведения о регистрации беспилотника.</p>
          </div>
          <div className="lvcard">
            <h3>Прозрачный опыт</h3>
            <p>Рейтинг, отзывы заказчиков и портфолио выполненных работ по каждому исполнителю.</p>
          </div>
          <div className="lvcard">
            <h3>Полные данные о технике</h3>
            <p>Модель дрона и профильное оборудование под каждое направление — от бака-разбрасывателя до RTK-приёмника и тепловизора.</p>
          </div>
        </div>
      </section>

      <section className="lfoot">
        <h2>Начните работу с Skyworker</h2>
        <div className="hero-cta">
          <Link to="/catalog" className="btn big">Открыть каталог</Link>
          <Link to="/register" className="btn big ghost">Разместить анкету</Link>
        </div>
      </section>
    </div>
  )
}
