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
      { type: 'check', label: 'Гербицидная обработка', group: 'Услуги' },
      { type: 'check', label: 'Фунгицидная обработка', group: 'Услуги' },
      { type: 'check', label: 'Инсектицидная обработка', group: 'Услуги' },
      { type: 'check', label: 'Десикация', group: 'Услуги' },
      { type: 'check', label: 'Внесение удобрений', group: 'Услуги' },
      { type: 'check', label: 'Подкормки', group: 'Услуги' },
      { type: 'check', label: 'Разбрасывание семян', group: 'Услуги' },
      { type: 'check', label: 'Подсчёт и мониторинг скота', group: 'Услуги' },
      { type: 'check', label: 'Бак-разбрасыватель (для сыпучих)', group: 'Оборудование' },
      { type: 'check', label: 'Автомобиль', group: 'Оборудование' },
      { type: 'check', label: 'Прицеп', group: 'Оборудование' },
      { type: 'check', label: 'Ёмкость для воды', group: 'Оборудование' },
      { type: 'text', label: 'Обработано, га', group: 'Опыт' },
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
  'Мониторинг': {
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
  'Доставка': {
    status: 'draft',
    fields: [
      { type: 'text', label: 'Грузоподъёмность, кг', group: 'Параметры' },
      { type: 'text', label: 'Дальность, км', group: 'Параметры' },
      { type: 'check', label: 'Труднодоступные районы', group: 'Услуги' },
    ],
  },
}

// Направления без детальной схемы — показываем общую заглушку.
export function getSchema(direction: string): DirectionSchema | null {
  return FIELD_SCHEMAS[direction] || null
}
