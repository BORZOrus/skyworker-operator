// Движок схем: у каждого направления — свой набор специфичных полей («модуль направления»).
// Общее ядро профиля живёт в анкете отдельно; здесь только специфика.
// Проработаны детально: Агро. Черновые (ключевые поля): Фото/видео, Геодезия, Картография,
// Мониторинг, Доставка. Остальные — TODO (детальный анализ по очереди).

export type FieldType = 'check' | 'text' | 'select'

export interface SchemaField {
  type: FieldType
  label: string
  options?: string[] // для select
  group?: string
}

export interface DirectionSchema {
  status: 'ready' | 'draft' | 'todo'
  fields: SchemaField[]
}

export const FIELD_SCHEMAS: Record<string, DirectionSchema> = {
  'Агро': {
    status: 'ready',
    fields: [
      // Виды работ
      { type: 'check', label: 'Гербицидная обработка', group: 'Виды работ' },
      { type: 'check', label: 'Фунгицидная обработка', group: 'Виды работ' },
      { type: 'check', label: 'Инсектицидная обработка', group: 'Виды работ' },
      { type: 'check', label: 'Десикация', group: 'Виды работ' },
      { type: 'check', label: 'Внесение удобрений (жидкие)', group: 'Виды работ' },
      { type: 'check', label: 'Подкормки', group: 'Виды работ' },
      { type: 'check', label: 'Разбрасывание семян / сыпучих', group: 'Виды работ' },
      { type: 'check', label: 'Дифференцированное внесение (по картам)', group: 'Виды работ' },
      { type: 'check', label: 'Подсчёт и мониторинг скота', group: 'Виды работ' },
      // Культуры
      { type: 'check', label: 'Пшеница', group: 'Культуры' },
      { type: 'check', label: 'Ячмень', group: 'Культуры' },
      { type: 'check', label: 'Подсолнечник', group: 'Культуры' },
      { type: 'check', label: 'Рапс', group: 'Культуры' },
      { type: 'check', label: 'Кукуруза', group: 'Культуры' },
      { type: 'check', label: 'Соя', group: 'Культуры' },
      { type: 'check', label: 'Лён', group: 'Культуры' },
      { type: 'check', label: 'Хлопок', group: 'Культуры' },
      { type: 'check', label: 'Сады / виноградники', group: 'Культуры' },
      { type: 'check', label: 'Пастбища / луга', group: 'Культуры' },
      // Техника
      { type: 'select', label: 'Модель агродрона', options: ['DJI Agras T20/T25', 'DJI Agras T40', 'DJI Agras T50', 'DJI Agras T70P', 'DJI Agras T100', 'XAG', 'Другая'], group: 'Техника' },
      { type: 'text', label: 'Количество дронов / бригад', group: 'Техника' },
      { type: 'text', label: 'Производительность, га/смена', group: 'Техника' },
      // Оборудование
      { type: 'check', label: 'Бак-разбрасыватель (для сыпучих)', group: 'Оборудование' },
      { type: 'check', label: 'RTK-базовая станция', group: 'Оборудование' },
      { type: 'check', label: 'Растворный узел / миксер', group: 'Оборудование' },
      { type: 'check', label: 'Генератор для зарядки в поле', group: 'Оборудование' },
      { type: 'check', label: 'Автомобиль', group: 'Оборудование' },
      { type: 'check', label: 'Прицеп', group: 'Оборудование' },
      { type: 'check', label: 'Ёмкость для воды', group: 'Оборудование' },
      { type: 'check', label: 'Ночные смены (освещение)', group: 'Оборудование' },
      // Условия и объём
      { type: 'check', label: 'Работа после дождя / по влажному полю', group: 'Условия и объём' },
      { type: 'text', label: 'Минимальный заказ, га', group: 'Условия и объём' },
      { type: 'text', label: 'Обработано всего, га', group: 'Условия и объём' },
    ],
  },
  'Фото/видео': {
    status: 'draft',
    fields: [
      { type: 'select', label: 'Максимальное разрешение', options: ['1080p', '4K', '6K', '8K'], group: 'Съёмка' },
      { type: 'check', label: 'Стабилизация (механический подвес)', group: 'Съёмка' },
      { type: 'check', label: 'Ночная / low-light съёмка', group: 'Съёмка' },
      { type: 'check', label: 'Монтаж и цветокоррекция', group: 'Услуги' },
      { type: 'check', label: 'Реклама / клипы', group: 'Услуги' },
      { type: 'check', label: 'Мероприятия / события', group: 'Услуги' },
      { type: 'check', label: 'Недвижимость / объекты', group: 'Услуги' },
    ],
  },
  'Геодезия': {
    status: 'draft',
    fields: [
      { type: 'check', label: 'RTK / PPK (высокая точность)', group: 'Точность' },
      { type: 'text', label: 'Точность, см', group: 'Точность' },
      { type: 'check', label: 'LiDAR', group: 'Оборудование' },
      { type: 'select', label: 'ПО обработки', options: ['Pix4D', 'Agisoft Metashape', 'DroneDeploy', 'Другое'], group: 'Обработка' },
      { type: 'check', label: 'Ортофотоплан', group: 'Результат' },
      { type: 'check', label: 'DEM / DSM (модель рельефа)', group: 'Результат' },
      { type: 'check', label: '3D-модель / облако точек', group: 'Результат' },
    ],
  },
  'Картография': {
    status: 'draft',
    fields: [
      { type: 'check', label: 'Ортофотопланы', group: 'Результат' },
      { type: 'check', label: 'Топографические карты', group: 'Результат' },
      { type: 'select', label: 'ПО обработки', options: ['Pix4D', 'Agisoft Metashape', 'DroneDeploy', 'Другое'], group: 'Обработка' },
    ],
  },
  'Инспекция и мониторинг': {
    status: 'draft',
    fields: [
      { type: 'check', label: 'Тепловизор', group: 'Оборудование' },
      { type: 'check', label: 'Оптический зум-объектив', group: 'Оборудование' },
      { type: 'check', label: 'LiDAR', group: 'Оборудование' },
      { type: 'check', label: 'ЛЭП / энергосети', group: 'Объекты' },
      { type: 'check', label: 'Трубопроводы / нефтегаз', group: 'Объекты' },
      { type: 'check', label: 'Здания / промышленные объекты', group: 'Объекты' },
      { type: 'check', label: 'Отчёт с выявленными дефектами', group: 'Услуги' },
    ],
  },
  'Грузовая доставка': {
    status: 'draft',
    fields: [
      { type: 'text', label: 'Грузоподъёмность, кг', group: 'Параметры' },
      { type: 'text', label: 'Дальность, км', group: 'Параметры' },
      { type: 'check', label: 'Труднодоступные районы', group: 'Услуги' },
    ],
  },
  'Строительный контроль': {
    status: 'draft',
    fields: [
      { type: 'check', label: 'Мониторинг хода строительства', group: 'Работы' },
      { type: 'check', label: 'Подсчёт объёмов (земляные работы, склады)', group: 'Работы' },
      { type: 'check', label: '3D-модель объекта', group: 'Работы' },
      { type: 'check', label: 'Фотофиксация для отчётов', group: 'Работы' },
    ],
  },
  'Поиск и спасение': {
    status: 'draft',
    fields: [
      { type: 'check', label: 'Тепловизор (поиск людей)', group: 'Оборудование' },
      { type: 'check', label: 'Ночные полёты', group: 'Оборудование' },
      { type: 'check', label: 'Громкоговоритель / сброс', group: 'Оборудование' },
      { type: 'check', label: 'Готовность к срочному выезду', group: 'Условия' },
    ],
  },
  'Охрана и патруль': {
    status: 'draft',
    fields: [
      { type: 'check', label: 'Патрулирование периметра', group: 'Работы' },
      { type: 'check', label: 'Ночная / тепловизионная съёмка', group: 'Оборудование' },
      { type: 'check', label: 'Реагирование на тревогу', group: 'Работы' },
      { type: 'text', label: 'Тип объектов', group: 'Работы' },
    ],
  },
  'Лесное хозяйство': {
    status: 'draft',
    fields: [
      { type: 'check', label: 'Учёт и таксация леса', group: 'Работы' },
      { type: 'check', label: 'Раннее обнаружение пожаров', group: 'Работы' },
      { type: 'check', label: 'Выявление вредителей / болезней', group: 'Работы' },
      { type: 'check', label: 'Картирование лесных участков', group: 'Работы' },
    ],
  },
}

// Направления без детальной схемы — показываем общую заглушку.
export function getSchema(direction: string): DirectionSchema | null {
  return FIELD_SCHEMAS[direction] || null
}

// Профиль хозяйства заказчика (агро). Собираем добровольно — в обмен на
// точные отклики: исполнитель сразу видит объём и культуру и даёт реальную цену,
// без пустых звонков «а сколько гектаров?».
export const FARM_SCHEMA: SchemaField[] = [
  { type: 'check', label: 'Пшеница', group: 'Что выращиваете' },
  { type: 'check', label: 'Ячмень', group: 'Что выращиваете' },
  { type: 'check', label: 'Подсолнечник', group: 'Что выращиваете' },
  { type: 'check', label: 'Рапс', group: 'Что выращиваете' },
  { type: 'check', label: 'Кукуруза', group: 'Что выращиваете' },
  { type: 'check', label: 'Соя', group: 'Что выращиваете' },
  { type: 'check', label: 'Сады / виноградники', group: 'Что выращиваете' },
  { type: 'text', label: 'Общая площадь, га', group: 'Хозяйство' },
  { type: 'select', label: 'Тип земель', options: ['Богарные (без полива)', 'Орошаемые', 'Смешанные'], group: 'Хозяйство' },
  { type: 'select', label: 'Рельеф', options: ['Равнина', 'Пологие склоны', 'Сложный рельеф'], group: 'Хозяйство' },
  { type: 'select', label: 'Своя техника для обработки', options: ['Нет — нужна услуга под ключ', 'Есть дрон — нужен оператор', 'Есть, но не хватает мощности'], group: 'Хозяйство' },
  { type: 'text', label: 'Сколько обработок за сезон обычно', group: 'Хозяйство' },
]
