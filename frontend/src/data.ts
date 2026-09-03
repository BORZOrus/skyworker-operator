// Моки для этапа «заглушки». Позже заменим на данные из API SkyWorker.

export type Tab = 'op' | 'sv'

export interface Direction { icon: string; label: string }

export const DIRECTIONS: Direction[] = [
  { icon: '🧭', label: 'Все' },
  { icon: '🌾', label: 'Агро' },
  { icon: '🎥', label: 'Фото/видео' },
  { icon: '📐', label: 'Геодезия' },
  { icon: '🗺', label: 'Картография' },
  { icon: '🏗', label: 'Строительство' },
  { icon: '🔍', label: 'Мониторинг' },
  { icon: '🚨', label: 'Поиск-спас' },
  { icon: '🛡', label: 'Охрана' },
  { icon: '🌲', label: 'Лес' },
  { icon: '📦', label: 'Доставка' },
  { icon: '➕', label: 'Другое' },
]

export interface Profile {
  id: string
  ini: string
  photo: string        // обложка (файл в /portfolio)
  gallery?: string[]   // портфолио работ
  city?: string        // конкретный город (для городских направлений); пусто = работает по всей области
  name: string
  price: string
  unit: string
  priceRequest?: boolean
  type: string
  dirs: string[]
  region: string
  rate: string
  rev: number
  cat: string
  pilot: string
  equip: string
  exp: string
  about: string
  specs?: [string, string][]
  services?: string
}

export const OPERATORS: Profile[] = [
  {
    id: 'op1', ini: 'АЖ', photo: 'operator_field.jpg', gallery: ['agras_field.jpg', 'drone_closeup.jpg', 'spraying_aerial.jpg'], name: 'Асхат Жумабеков', price: 'от 18 000 ₸', unit: '/ день',
    type: 'Оператор · со своим БАС', dirs: ['Агро', 'Опрыскивание', 'Десикация'],
    region: 'Акмолинская обл.', rate: '4.9', rev: 37, cat: 'Категория 3',
    pilot: 'Свидетельство внешнего пилота', equip: 'DJI Agras T70', exp: 'Опыт 3 сезона · ~12 000 га',
    about: 'Оператор-агро. Гербициды, фунгициды, десикация, внесение. Готов на сезон и разовые выезды.',
    specs: [
      ['Категория', '3'], ['Опыт работы', '4 года'], ['Опыт с агродронами', '3 сезона'],
      ['Обработано', '12 000+ га'], ['Работает на', 'DJI Agras T70'], ['Работал на', 'T50 / T100'],
      ['Собственный дрон', 'Да'], ['Дрон зарегистрирован', 'Да · KZ-A1234'],
      ['Бак-разбрасыватель', 'Да'], ['Автомобиль + прицеп', 'Да'], ['Ёмкость для воды', 'Да'],
    ],
    services: 'Гербициды / фунгициды / инсектициды / десикация / удобрения / семена',
  },
  {
    id: 'op2', ini: 'ДО', photo: 'agras_field.jpg', gallery: ['spraying_aerial.jpg', 'agras_field.jpg'], name: 'Данияр Оспанов', price: 'от 12 000 ₸', unit: '/ день',
    type: 'Оператор · без своего БАС', dirs: ['Агро', 'Опрыскивание'],
    region: 'Костанайская обл.', rate: '4.7', rev: 18, cat: 'Категория 1',
    pilot: '—', equip: 'Работает на технике заказчика', exp: 'Опыт 2 сезона',
    about: 'Оператор-опрыскиватель. Ищу сезонную занятость и разовые выезды.',
  },
  {
    id: 'op3', ini: 'МК', photo: 'mapping_drone.jpg', gallery: ['mapping_drone.jpg', 'spraying_aerial.jpg'], name: 'Марат Калиев', price: 'по запросу', unit: '', priceRequest: true,
    type: 'Оператор · со своим БАС', dirs: ['Агро', 'Картография', 'Мониторинг'],
    region: 'Акмолинская обл.', rate: '4.8', rev: 26, cat: 'Категория 2',
    pilot: 'Свидетельство внешнего пилота', equip: 'DJI Mavic 3M (NDVI)', exp: 'Опыт 3 сезона · агроскаутинг',
    about: 'Оператор-универсал: обработка + карты полей и мониторинг NDVI.',
  },
  {
    id: 'op4', ini: 'НБ', photo: 'spraying_aerial.jpg', gallery: ['spraying_aerial.jpg'], name: 'Нурлан Байбек', price: 'от 15 000 ₸', unit: '/ день',
    type: 'Оператор · без своего БАС', dirs: ['Агро', 'Десикация'],
    region: 'Северо-Казахстанская обл.', rate: '5.0', rev: 9, cat: 'Категория 1',
    pilot: '—', equip: 'Работает на технике заказчика', exp: 'Опыт 1 сезон',
    about: 'Начинающий оператор, допуск есть, работаю аккуратно.',
  },
  {
    id: 'op5', ini: 'ТС', photo: 'video_city.jpg', gallery: ['video_city.jpg'], name: 'Тимур Сапаров', price: 'от 25 000 ₸', unit: '/ день',
    type: 'Оператор · со своим БАС', dirs: ['Фото/видео', 'Аэросъёмка', 'Реклама'],
    region: 'Алматы', city: 'Алматы', rate: '4.9', rev: 44, cat: 'Категория 1', pilot: '—',
    equip: 'DJI Mavic 3 Pro / Inspire', exp: 'Опыт 5 лет · реклама, события, недвижимость',
    specs: [['Разрешение', '6K'], ['Стабилизация', 'Механический подвес'], ['Ночная съёмка', 'Да'], ['Монтаж и цветокор', 'Да'], ['Оборудование', 'Mavic 3 Pro / Inspire']],
    about: 'Аэросъёмка: рекламные ролики, мероприятия, объекты, недвижимость. Монтаж включён.',
  },
  {
    id: 'op6', ini: 'АИ', photo: 'geodesy_site.jpg', gallery: ['geodesy_site.jpg'], name: 'Айдос Ибраев', price: 'от 30 000 ₸', unit: '/ день',
    type: 'Оператор · со своим БАС', dirs: ['Геодезия', 'Картография'],
    region: 'Шымкент', rate: '4.8', rev: 29, cat: 'Категория 2', pilot: 'Свидетельство внешнего пилота',
    equip: 'DJI Phantom 4 RTK', exp: 'Опыт 4 года · топосъёмка, ортофотопланы',
    specs: [['RTK / PPK', 'Да'], ['Точность', 'до 2 см'], ['LiDAR', 'Нет'], ['ПО обработки', 'Agisoft Metashape'], ['Результат', 'Ортофото · DEM · 3D']],
    about: 'Геодезия и картография: съёмка участков, ортофотопланы, 3D-модели, подсчёт объёмов.',
  },
  {
    id: 'op7', ini: 'РК', photo: 'inspection_line.jpg', gallery: ['inspection_line.jpg'], name: 'Роман Ким', price: 'по запросу', unit: '', priceRequest: true,
    type: 'Оператор · со своим БАС', dirs: ['Мониторинг', 'Инспекция'],
    region: 'Атырауская обл.', city: 'Атырау', rate: '4.7', rev: 15, cat: 'Категория 2', pilot: 'Свидетельство внешнего пилота',
    equip: 'DJI Matrice 350 · тепловизор', exp: 'Опыт 3 года · нефтегаз, ЛЭП',
    specs: [['Тепловизор', 'Да'], ['Зум-объектив', 'Да'], ['Объекты', 'ЛЭП · трубопроводы'], ['Отчёт с дефектами', 'Да'], ['Оборудование', 'Matrice 350']],
    about: 'Инспекция инфраструктуры: ЛЭП, трубопроводы, резервуары. Тепловизионная съёмка.',
  },
]

export const SERVICES: Profile[] = [
  {
    id: 'sv1', ini: 'JD', photo: 'agras_field.jpg', gallery: ['agras_field.jpg', 'spraying_aerial.jpg', 'drone_closeup.jpg', 'operator_field.jpg'], name: 'ТОО «JEDI» — обработка полей под ключ', price: 'от 2 700 ₸', unit: '/ га',
    type: 'Услуги · компания', dirs: ['Агро', 'Опрыскивание', 'Десикация', 'Внесение'],
    region: 'Астана · по всему РК', rate: '4.9', rev: 64, cat: 'Категория 3',
    pilot: 'Свидетельство внешнего пилота', equip: 'DJI Agras T50 / T100 · 3 бригады',
    exp: '3 года · до 400 га/смена на бригаду',
    about: 'Обработка агродронами: сорняки, болезни, вредители, удобрения, десикация. Без заезда техники в поле, работа после дождя. Цена зависит от объёма (от 100 до 8000 га).',
    specs: [
      ['Категория', '3'], ['Оборудование', 'DJI Agras T50 / T100'], ['Бригад', '3'],
      ['Производительность', 'до 400 га/смена'], ['Охват', 'по всему РК'], ['Опыт', '3 года'],
    ],
    services: 'Гербициды / фунгициды / инсектициды / десикация / удобрения / семена',
  },
  {
    id: 'sv2', ini: 'DS', photo: 'drone_closeup.jpg', gallery: ['drone_closeup.jpg', 'agras_field.jpg'], name: 'DronServis — агрообработка по области', price: 'по запросу', unit: '', priceRequest: true,
    type: 'Услуги · ИП', dirs: ['Агро', 'Опрыскивание'], region: 'Акмолинская обл.',
    rate: '4.8', rev: 24, cat: 'Категория 2', pilot: 'Свидетельство внешнего пилота',
    equip: 'DJI Agras T50', exp: '3 сезона',
    about: 'Оперативный выезд по области. Цену считаем индивидуально под поле и объём.',
  },
  {
    id: 'sv3', ini: 'SK', photo: 'mapping_drone.jpg', gallery: ['mapping_drone.jpg', 'spraying_aerial.jpg', 'agras_field.jpg'], name: 'SkyAgro — внесение и мониторинг полей', price: 'от 1 100 ₸', unit: '/ га',
    type: 'Услуги · компания', dirs: ['Агро', 'Картография', 'Мониторинг'], region: 'Костанайская обл.',
    rate: '4.9', rev: 41, cat: 'Категория 3', pilot: 'Свидетельство внешнего пилота',
    equip: '3× DJI Agras T40 · NDVI-дрон', exp: '5 сезонов · карты внесения',
    about: 'Комплекс: съёмка полей, карты, дифференцированное внесение, обработка.',
  },
  {
    id: 'sv4', ini: 'AV', photo: 'video_city.jpg', gallery: ['video_city.jpg'], name: 'AeroVision — аэросъёмка под ключ', price: 'от 40 000 ₸', unit: '/ съёмка',
    type: 'Услуги · компания', dirs: ['Фото/видео', 'Реклама', 'События'], region: 'Алматы', city: 'Алматы',
    rate: '5.0', rev: 38, cat: 'Категория 1', pilot: '—', equip: 'DJI Inspire 3 · команда операторов',
    exp: '6 лет · реклама, кино, ивенты',
    specs: [['Разрешение', '8K'], ['Команда операторов', 'Да'], ['Пост-продакшн', 'Монтаж + цветокор'], ['Оборудование', 'DJI Inspire 3']],
    about: 'Студия аэросъёмки: реклама, клипы, мероприятия, недвижимость. Съёмка + монтаж + цветокор.',
  },
  {
    id: 'sv5', ini: 'IL', photo: 'inspection_line.jpg', gallery: ['inspection_line.jpg', 'geodesy_site.jpg'], name: 'InspectLine — инспекция ЛЭП и трубопроводов', price: 'по запросу', unit: '', priceRequest: true,
    type: 'Услуги · компания', dirs: ['Мониторинг', 'Инспекция'], region: 'Атырауская обл.', city: 'Атырау',
    rate: '4.9', rev: 27, cat: 'Категория 2', pilot: 'Свидетельство внешнего пилота',
    equip: 'DJI Matrice 350 · тепловизор · LiDAR', exp: '4 года · нефтегаз, энергетика',
    specs: [['Тепловизор', 'Да'], ['LiDAR', 'Да'], ['Объекты', 'ЛЭП · трубопроводы · резервуары'], ['Отчёт с дефектами', 'Да'], ['Оборудование', 'Matrice 350']],
    about: 'Промышленная инспекция: ЛЭП, трубопроводы, факелы, резервуары. Отчёты с дефектами.',
  },
  {
    id: 'sv6', ini: 'DX', photo: 'delivery_box.jpg', gallery: ['delivery_box.jpg'], name: 'DronExpress — доставка грузов', price: 'от 5 000 ₸', unit: '/ доставка',
    type: 'Услуги · ИП', dirs: ['Доставка'], region: 'Астана', city: 'Астана',
    rate: '4.6', rev: 12, cat: 'Категория 2', pilot: 'Свидетельство внешнего пилота',
    equip: 'Грузовые БАС до 10 кг', exp: '2 года · труднодоступные районы',
    specs: [['Грузоподъёмность', 'до 10 кг'], ['Дальность', 'до 30 км'], ['Труднодоступные районы', 'Да']],
    about: 'Доставка грузов дронами в труднодоступные районы и между объектами.',
  },
]
