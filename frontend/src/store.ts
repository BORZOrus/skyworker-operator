// Локальное хранилище (браузер). На этапе заглушек — localStorage;
// позже заменится на API Skyworker.

const FAV_KEY = 'sw_favorites'
const REQ_KEY = 'sw_requests'
const ADS_KEY = 'sw_ads'
const USER_KEY = 'sw_user'
const RESP_KEY = 'sw_responses'

/* ---------- Избранное ---------- */
export function getFavorites(): string[] {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]') } catch { return [] }
}
export function isFavorite(id: string): boolean {
  return getFavorites().includes(id)
}
export function toggleFavorite(id: string): string[] {
  const f = getFavorites()
  const next = f.includes(id) ? f.filter((x) => x !== id) : [...f, id]
  localStorage.setItem(FAV_KEY, JSON.stringify(next))
  return next
}

/* ---------- Мои исходящие запросы к анкетам (из ContactModal) ---------- */
export interface RequestItem {
  profileId: string
  profileName: string
  region: string
  message: string
  createdAt: string
}
export function getRequests(): RequestItem[] {
  try { return JSON.parse(localStorage.getItem(REQ_KEY) || '[]') } catch { return [] }
}
export function addRequest(r: RequestItem): void {
  const list = getRequests()
  list.unshift(r)
  localStorage.setItem(REQ_KEY, JSON.stringify(list))
}

/* ---------- Режим (какой кабинет открыт): 3 вкладки сверху ---------- */
export type UserRole = 'operator' | 'customer' | 'company'
const MODE_KEY = 'sw_mode'
export function getMode(): UserRole {
  const m = localStorage.getItem(MODE_KEY)
  return m === 'operator' || m === 'company' || m === 'customer' ? m : 'operator'
}
export function setMode(m: UserRole): void {
  localStorage.setItem(MODE_KEY, m)
}

/* ---------- Микро-регистрация (порог входа: телефон+имя+роль) ---------- */
export interface User {
  name: string
  phone: string
  role: UserRole
  createdAt: string
}
export function getUser(): User | null {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null') } catch { return null }
}
export function isRegistered(): boolean {
  return !!getUser()
}
export function setUser(u: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(u))
}
export function clearUser(): void {
  localStorage.removeItem(USER_KEY)
}

/* ---------- Объявления ---------- */
// Четыре типа. Каждое объявление привязано к направлению(ям).
//   'op-seek'      — оператор ищет работу (одно объявление, мультивыбор направлений)
//   'co-offer'     — компания предлагает услуги (по одному на направление)
//   'need-op'      — заказчик/компания ищет оператора (наём)
//   'need-service' — заказчик ищет услугу под ключ
export type AdKind = 'op-seek' | 'co-offer' | 'need-op' | 'need-service'
export interface BoardAd {
  id: string
  kind: AdKind
  author: string          // имя / компания
  authorRole: UserRole    // для метки «Оператор / Компания / Заказчик»
  directions: string[]    // одно или несколько направлений
  region: string
  city?: string
  title: string
  body: string
  budget?: string
  phone: string
  createdAt: string
  seed?: boolean          // демо-объявление
  authorId?: string       // ссылка на демо-профиль автора (портфолио)
  badges?: string[]       // ключевые метки для карточки (категория, НДС, рейтинг…)
  details?: { label: string; value: string }[]  // структурированные детали задачи
}

export function getAds(): BoardAd[] {
  try {
    const stored: BoardAd[] = JSON.parse(localStorage.getItem(ADS_KEY) || '[]')
    // Демо-ленту показываем всегда сверху свежих пользовательских
    return [...stored, ...SEED_ADS]
  } catch { return SEED_ADS }
}
function getMyAds(): BoardAd[] {
  try { return JSON.parse(localStorage.getItem(ADS_KEY) || '[]') } catch { return [] }
}
export function addAd(a: BoardAd): void {
  const list = getMyAds()
  list.unshift(a)
  localStorage.setItem(ADS_KEY, JSON.stringify(list))
}
export function removeAd(id: string): void {
  localStorage.setItem(ADS_KEY, JSON.stringify(getMyAds().filter((a) => a.id !== id)))
}
// Лимит: оператор — одно объявление всего; остальные — одно на направление.
// Возвращает список направлений, по которым у пользователя уже есть объявление этого типа.
export function myAdDirections(kind: AdKind): string[] {
  return getMyAds().filter((a) => a.kind === kind).flatMap((a) => a.directions)
}
export function hasOperatorAd(): boolean {
  return getMyAds().some((a) => a.kind === 'op-seek')
}
export function countMyAds(kind: AdKind): number {
  return getMyAds().filter((a) => a.kind === kind).length
}
// Лимиты на количество объявлений (анти-спам). co-offer — особый: одно на направление.
export const AD_LIMITS: Record<AdKind, number> = {
  'op-seek': 1,       // оператор — одно на все направления
  'co-offer': 99,     // компания — одно на направление (проверяется отдельно)
  'need-op': 3,       // ищут оператора — до 3
  'need-service': 5,  // ищут услугу под ключ — до 5
}

/* ---------- Анкета оператора (редактируемая, сохраняется) ---------- */
const OPROF_KEY = 'sw_operator_profile'
export interface OperatorProfile {
  photo: string          // URL/dataURL фото лица ('' — нет)
  name: string
  age: string
  city: string           // город проживания / базирования
  region: string         // основной регион
  willTravel: boolean    // готов к командировкам
  travelAll: boolean     // готов ко всем регионам
  travelRegions: string[]// конкретные регионы (если не все)
  // Документы и допуски
  cat: string            // категория 1/2/3
  pilotCert: boolean     // свидетельство внешнего пилота
  certNo: string         // номер свидетельства
  training: boolean      // сертификат об обучении (курсы)
  medCert: boolean       // медицинская справка
  basReg: boolean        // регистрация в CAA
  // Направления и их поля
  directions: string[]
  agroWorks: string[]
  agroCrops: string[]
  dirFields: Record<string, boolean>  // поля модулей прочих направлений (ключ "Направление::Поле")
  // Опыт
  expYears: string                          // общий стаж с БАС, лет
  dirExp: Record<string, { a: string; b: string }>  // опыт в направлении: два числа (см. EXP_LABELS)
  about: string
  site: string
  socials: string[]
  pay: string
}
// Предзаполненный пример — «как будто уже понажимал». Оператор БЕЗ своего дрона.
const DEFAULT_OPERATOR: OperatorProfile = {
  photo: 'portfolio/operator_face.jpg', name: 'Асхат Жумабеков', age: '35',
  city: 'Кокшетау', region: 'Акмолинская обл.',
  willTravel: true, travelAll: false, travelRegions: ['Костанайская обл.', 'Северо-Казахстанская обл.'],
  cat: 'Категория 3', pilotCert: true, certNo: 'СВП-2024-0417', training: true, medCert: true, basReg: false,
  directions: ['Агро'],
  agroWorks: ['Гербицидная обработка', 'Десикация', 'Внесение удобрений (жидкие)'],
  agroCrops: ['Пшеница', 'Ячмень', 'Рапс'],
  dirFields: {},
  expYears: '4',
  dirExp: { 'Агро': { a: '3', b: '12000' } },
  about: 'Оператор-агро. Работаю на технике заказчика: гербициды, фунгициды, десикация, внесение. Аккуратно, в срок. Готов на сезон и разовые выезды.',
  site: '', socials: ['instagram.com/ashat.agrodrone'], pay: 'от 15 000 ₸/день или договорная',
}
export function getOperatorProfile(): OperatorProfile {
  try {
    const s = localStorage.getItem(OPROF_KEY)
    if (!s) return DEFAULT_OPERATOR
    const merged = { ...DEFAULT_OPERATOR, ...JSON.parse(s) }
    if (!merged.photo) merged.photo = DEFAULT_OPERATOR.photo   // не терять дефолтное фото
    return merged
  } catch { return DEFAULT_OPERATOR }
}
// Подписи двух полей опыта по направлению
export const EXP_LABELS: Record<string, { a: string; b: string }> = {
  'Агро': { a: 'Сезонов', b: 'Гектаров обработано' },
  'Геодезия': { a: 'Лет опыта', b: 'Объектов снято' },
  'Картография': { a: 'Лет опыта', b: 'Карт создано' },
  'Фото/видео': { a: 'Лет опыта', b: 'Проектов' },
  'Инспекция и мониторинг': { a: 'Лет опыта', b: 'Объектов' },
  'Грузовая доставка': { a: 'Лет опыта', b: 'Доставок' },
}
export const expLabels = (d: string) => EXP_LABELS[d] || { a: 'Лет опыта', b: 'Выполнено работ' }
export function saveOperatorProfile(p: OperatorProfile): void {
  localStorage.setItem(OPROF_KEY, JSON.stringify(p))
}
// Полнота анкеты оператора (0–100)
export function operatorCompleteness(p: OperatorProfile): number {
  const checks = [
    !!p.photo, p.name.trim().length > 2, !!p.city, !!p.cat, p.pilotCert, p.training,
    p.directions.length > 0, !!p.expYears, Object.values(p.dirExp).some((e) => e.a || e.b), p.about.trim().length > 30,
    p.socials.some((s) => s.trim().length > 3), !!p.pay,
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

/* ---------- Профиль компании (публичная витрина услуг) ---------- */
const CPROF_KEY = 'sw_company_profile'
export interface CompanyProfile {
  logo: string
  name: string
  legal: string          // ИП / ТОО / ФХ
  bin: string            // БИН
  vat: string            // НДС
  city: string
  region: string
  coverAll: boolean      // работает по всему РК
  fleet: string          // парк дронов
  brigades: string       // число бригад
  directions: string[]
  dirExp: Record<string, { a: string; b: string }>
  agroWorks: string[]
  agroCrops: string[]
  dirFields: Record<string, boolean>
  about: string
  site: string
  socials: string[]
  rate: string
}
const DEFAULT_COMPANY: CompanyProfile = {
  logo: 'portfolio/logo_company.jpg', name: 'ТОО «JEDI»', legal: 'ТОО', bin: '123456789012', vat: 'Плательщик НДС',
  city: 'Астана', region: 'Астана', coverAll: true,
  fleet: '3× DJI Agras T50, 1× T100', brigades: '3',
  directions: ['Агро'], dirExp: { 'Агро': { a: '3', b: '85000' } },
  agroWorks: ['Гербицидная обработка', 'Фунгицидная обработка', 'Десикация', 'Внесение удобрений (жидкие)'],
  agroCrops: ['Пшеница', 'Ячмень', 'Подсолнечник', 'Рапс'],
  dirFields: {},
  about: 'Обработка полей агродронами под ключ по всему Казахстану. 3 бригады, до 400 га/смена. Гербициды, фунгициды, десикация, внесение. Работаем после дождя, без заезда техники в поле.',
  site: 'jedi-agro.kz', socials: ['instagram.com/jedi.agro'], rate: 'от 2 700 ₸/га',
}
export function getCompanyProfile(): CompanyProfile {
  try {
    const s = localStorage.getItem(CPROF_KEY)
    if (!s) return DEFAULT_COMPANY
    const merged = { ...DEFAULT_COMPANY, ...JSON.parse(s) }
    if (!merged.logo) merged.logo = DEFAULT_COMPANY.logo
    return merged
  } catch { return DEFAULT_COMPANY }
}
export function saveCompanyProfile(p: CompanyProfile): void { localStorage.setItem(CPROF_KEY, JSON.stringify(p)) }
export function companyCompleteness(p: CompanyProfile): number {
  const checks = [!!p.logo, p.name.length > 2, !!p.legal, !!p.bin, !!p.fleet, p.directions.length > 0,
    Object.values(p.dirExp).some((e) => e.a || e.b), p.about.length > 30, !!p.site, p.socials.some((s) => s.length > 3), !!p.rate]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

/* ---------- Профиль заказчика (ПРИВАТНЫЙ — не в поиске) ---------- */
const CUPROF_KEY = 'sw_customer_profile'
export interface CustomerProfile {
  logo: string
  name: string
  legal: string
  bin: string
  city: string
  region: string
  lookingFor: string     // что ищет
  directions: string[]   // в каких отраслях заказывает
  dirNeeds: Record<string, string>  // что нужно в каждом направлении (для не-агро)
  // агро-специфика хозяйства
  crops: string[]
  area: string
  landType: string
  ownTech: string
  about: string
}
const DEFAULT_CUSTOMER: CustomerProfile = {
  logo: 'portfolio/logo_farm.jpg', name: 'ФХ «Айдана»', legal: 'Крестьянское хозяйство (ФХ)', bin: '987654321098',
  city: 'Атбасар', region: 'Акмолинская обл.',
  lookingFor: 'Оператора на сезон + услугу под ключ',
  directions: ['Агро'], dirNeeds: {},
  crops: ['Пшеница', 'Ячмень', 'Рапс'], area: '4500', landType: 'Богарные (без полива)',
  ownTech: 'Есть дрон — нужен оператор',
  about: 'Крестьянское хозяйство, 4 500 га. Ежегодно нужна гербицидная обработка и десикация.',
}
export function getCustomerProfile(): CustomerProfile {
  try {
    const s = localStorage.getItem(CUPROF_KEY)
    if (!s) return DEFAULT_CUSTOMER
    return { ...DEFAULT_CUSTOMER, ...JSON.parse(s) }
  } catch { return DEFAULT_CUSTOMER }
}
export function saveCustomerProfile(p: CustomerProfile): void { localStorage.setItem(CUPROF_KEY, JSON.stringify(p)) }
export function customerCompleteness(p: CustomerProfile): number {
  const checks = [p.name.length > 2, !!p.legal, !!p.bin, !!p.city, !!p.lookingFor, p.directions.length > 0, !!p.about]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

/* ---------- Жалобы (приватные — уходят только администрации) ---------- */
// Жалоба нигде не публикуется. Копится статистика на участника:
// много жалоб → сервис принимает меры или помечает «осторожно».
const CMP_KEY = 'sw_complaints'
export interface Complaint {
  targetId: string
  targetName: string
  reason: string
  text: string
  createdAt: string
}
export function getComplaints(): Complaint[] {
  try { return JSON.parse(localStorage.getItem(CMP_KEY) || '[]') } catch { return [] }
}
export function addComplaint(c: Complaint): void {
  const list = getComplaints()
  list.unshift(c)
  localStorage.setItem(CMP_KEY, JSON.stringify(list))
}

/* ---------- Отклики на объявления (кому я откликнулся) ---------- */
export interface ResponseItem {
  adId: string
  adTitle: string
  adAuthor: string
  createdAt: string
}
export function getResponseItems(): ResponseItem[] {
  try { return JSON.parse(localStorage.getItem(RESP_KEY) || '[]') } catch { return [] }
}
export function hasResponded(adId: string): boolean {
  return getResponseItems().some((r) => r.adId === adId)
}
export function addResponseItem(r: ResponseItem): void {
  const list = getResponseItems()
  if (!list.some((x) => x.adId === r.adId)) {
    list.unshift(r)
    localStorage.setItem(RESP_KEY, JSON.stringify(list))
  }
}

/* ---------- Демо-объявления для ленты (привязаны к профилям) ---------- */
const SEED_ADS: BoardAd[] = [
  // ── Операторы ищут работу (op-seek) ──
  {
    id: 'ad-seed-1', kind: 'op-seek', author: 'Данияр Оспанов', authorRole: 'operator', authorId: 'op-daniyar',
    directions: ['Агро'], region: 'Костанайская обл.',
    title: 'Оператор-агро ищет работу на сезон',
    body: 'Оператор-опрыскиватель. Работаю на технике заказчика, выезд по всей области. Ищу сезонную занятость и разовые выезды. Аккуратный, ответственный, без вредных привычек.',
    phone: '+7 701 000 00 03', createdAt: '2026-08-20T15:00:00.000Z', seed: true,
    badges: ['Категория 1', 'Свидетельство пилота', '2 сезона · 6 500 га'],
    details: [
      { label: 'Категория', value: '1' },
      { label: 'Свидетельство пилота', value: 'Внешний пилот БАС' },
      { label: 'Допуски', value: 'Курсы БАС' },
      { label: 'Опыт', value: '2 сезона · ~6 500 га' },
      { label: 'Техника', value: 'Работает на технике заказчика' },
      { label: 'Культуры', value: 'Пшеница, ячмень' },
      { label: 'Виды работ', value: 'Гербицидная обработка, опрыскивание' },
      { label: 'Готов к', value: 'Сезон + разовые выезды' },
      { label: 'География', value: 'Костанайская обл., выезд по региону' },
      { label: 'Ставка', value: 'от 12 000 ₸/день' },
    ],
  },
  {
    id: 'ad-seed-2', kind: 'op-seek', author: 'Ержан Каиров', authorRole: 'operator', authorId: 'op-erzhan',
    directions: ['Агро', 'Инспекция и мониторинг'], region: 'Атырауская обл.',
    title: 'Опытный оператор: агро + инспекция ЛЭП/трубопроводов',
    body: 'Опытный оператор, 7 лет. Агрообработка и тепловизионная инспекция промышленных объектов: ЛЭП, трубопроводы. Работал на нефтегаз. Все допуски и медсправка в порядке.',
    phone: '+7 701 000 00 07', createdAt: '2026-08-19T15:00:00.000Z', seed: true,
    badges: ['Категория 3', '7 лет опыта', 'Тепловизор', 'CAA'],
    details: [
      { label: 'Категория', value: '3' },
      { label: 'Свидетельство пилота', value: '№ СВП-2019-0088' },
      { label: 'Допуски', value: 'Курсы БАС · Медсправка · CAA' },
      { label: 'Опыт', value: '7 лет' },
      { label: 'Агро', value: '5 сезонов · 40 000 га' },
      { label: 'Инспекция', value: '4 года · 120 объектов' },
      { label: 'Техника', value: 'Своя · тепловизор для ЛЭП/трубопроводов' },
      { label: 'Отрасли', value: 'Нефтегаз, энергетика, АПК' },
      { label: 'Ставка', value: 'По договорённости' },
    ],
  },
  {
    id: 'ad-seed-7', kind: 'op-seek', author: 'Асхат Жумабеков', authorRole: 'operator', authorId: 'op-ashat',
    directions: ['Агро'], region: 'Акмолинская обл.',
    title: 'Оператор-агро, 3 сезона, 12 000 га',
    body: 'Оператор-агро. Работаю на технике заказчика: гербициды, фунгициды, десикация, внесение. Аккуратно, в срок. Готов на сезон и разовые выезды. Есть портфолио и отзывы.',
    phone: '+7 701 000 00 08', createdAt: '2026-08-18T14:00:00.000Z', seed: true,
    badges: ['Категория 3', 'Свидетельство пилота', '3 сезона · 12 000 га', 'Медсправка'],
    details: [
      { label: 'Категория', value: '3' },
      { label: 'Свидетельство пилота', value: '№ СВП-2024-0417' },
      { label: 'Допуски', value: 'Курсы БАС · Медсправка' },
      { label: 'Опыт', value: '4 года · 3 сезона на агродронах' },
      { label: 'Обработано', value: '12 000+ га' },
      { label: 'Техника', value: 'Работает на технике заказчика' },
      { label: 'Культуры', value: 'Пшеница, ячмень, рапс' },
      { label: 'Виды работ', value: 'Гербициды, фунгициды, десикация, внесение' },
      { label: 'Соцсети', value: 'instagram.com/ashat.agrodrone' },
      { label: 'Ставка', value: 'от 15 000 ₸/день или договорная' },
    ],
  },
  {
    id: 'ad-seed-10', kind: 'op-seek', author: 'Тимур Сапаров', authorRole: 'operator', authorId: 'op-timur',
    directions: ['Фото/видео'], region: 'Алматы', city: 'Алматы',
    title: 'Аэросъёмка: реклама, события, недвижимость',
    body: 'Оператор аэросъёмки. Реклама, клипы, мероприятия, недвижимость, промо объектов. Съёмка 6K + монтаж и цветокор под ключ. Своя техника: Mavic 3 Pro и Inspire.',
    phone: '+7 701 000 00 11', createdAt: '2026-08-12T10:00:00.000Z', seed: true,
    badges: ['Категория 1', '5 лет · 80 проектов', '6K', 'Монтаж включён'],
    details: [
      { label: 'Категория', value: '1' },
      { label: 'Допуски', value: 'Курсы БАС · Медсправка' },
      { label: 'Опыт', value: '5 лет · 80 проектов' },
      { label: 'Оборудование', value: 'DJI Mavic 3 Pro, Inspire (своё)' },
      { label: 'Разрешение', value: '6K · механический подвес · ночная съёмка' },
      { label: 'Услуги', value: 'Съёмка + монтаж + цветокоррекция' },
      { label: 'Форматы', value: 'Реклама, клипы, события, недвижимость' },
      { label: 'Соцсети', value: 'instagram.com/timur.aerial · youtube.com/@timuraero' },
      { label: 'Ставка', value: 'от 25 000 ₸/день' },
    ],
  },
  // ── Компании предлагают услуги (co-offer) ──
  {
    id: 'ad-seed-5', kind: 'co-offer', author: 'ТОО «JEDI»', authorRole: 'company', authorId: 'co-jedi',
    directions: ['Агро'], region: 'Астана', city: 'Астана',
    title: 'Обработка полей агродронами под ключ · по всему РК',
    body: 'Обработка полей агродронами под ключ. 3 бригады, до 400 га/смена. Гербициды, фунгициды, десикация, внесение. Работаем после дождя, без заезда техники в поле. Цена зависит от объёма (100–8000 га).',
    budget: 'от 2 700 ₸/га', phone: '+7 701 000 00 05', createdAt: '2026-08-16T10:00:00.000Z', seed: true,
    badges: ['ТОО · НДС', '★ 4.9', 'Парк 4 дрона · 3 бригады', 'по РК'],
    details: [
      { label: 'Юрформа', value: 'ТОО · плательщик НДС' },
      { label: 'БИН', value: '1234•••••012 (полностью — после отклика)' },
      { label: 'Рейтинг', value: '★ 4.9 · 64 отзыва' },
      { label: 'Парк', value: '3× DJI Agras T50, 1× T100' },
      { label: 'Бригад', value: '3 · до 400 га/смена на бригаду' },
      { label: 'Виды работ', value: 'Гербициды, фунгициды, десикация, внесение' },
      { label: 'Культуры', value: 'Пшеница, ячмень, подсолнечник, рапс, кукуруза, соя' },
      { label: 'Охват', value: 'по всему Казахстану' },
      { label: 'Сайт', value: 'jedi-agro.kz · instagram.com/jedi.agro' },
      { label: 'Цена', value: 'от 2 700 ₸/га (зависит от объёма)' },
    ],
  },
  {
    id: 'ad-seed-8', kind: 'co-offer', author: 'ТОО «GeoDrone»', authorRole: 'company', authorId: 'co-geodrone',
    directions: ['Геодезия', 'Картография'], region: 'Алматы', city: 'Алматы',
    title: 'Геодезия и картография под ключ · RTK до 2 см',
    body: 'Топосъёмка, ортофотопланы, 3D-модели, подсчёт объёмов. RTK-точность до 2 см, LiDAR. Работаем со строительными и добывающими компаниями. Выдаём в любых форматах.',
    budget: 'от 300 000 ₸/объект', phone: '+7 701 000 00 09', createdAt: '2026-08-15T13:00:00.000Z', seed: true,
    badges: ['ТОО · НДС', '★ 4.8', 'RTK до 2 см', 'LiDAR'],
    details: [
      { label: 'Юрформа', value: 'ТОО · плательщик НДС' },
      { label: 'Рейтинг', value: '★ 4.8 · 300 объектов' },
      { label: 'Оборудование', value: '2× DJI Phantom 4 RTK, Matrice 350 + LiDAR' },
      { label: 'Точность', value: 'RTK / PPK до 2 см' },
      { label: 'Что делаем', value: 'Ортофотоплан, 3D-модель, DEM, подсчёт объёмов' },
      { label: 'ПО обработки', value: 'Agisoft Metashape' },
      { label: 'Форматы', value: 'DWG, LAS, GeoTIFF, облако точек' },
      { label: 'Охват', value: 'Алматы и юг РК' },
      { label: 'Сайт', value: 'geodrone.kz' },
      { label: 'Цена', value: 'от 300 000 ₸/объект' },
    ],
  },
  {
    id: 'ad-seed-11', kind: 'co-offer', author: 'ТОО «InspectLine»', authorRole: 'company', authorId: 'co-inspect',
    directions: ['Инспекция и мониторинг'], region: 'Атырауская обл.', city: 'Атырау',
    title: 'Инспекция ЛЭП и трубопроводов · тепловизор',
    body: 'Промышленная инспекция: ЛЭП, трубопроводы, факелы, резервуары. Тепловизионная съёмка, поиск дефектов и перегревов. Отчёты с координатами дефектов. Работаем с нефтегазом и энергетикой.',
    budget: 'по запросу', phone: '+7 701 000 00 12', createdAt: '2026-08-11T10:00:00.000Z', seed: true,
    badges: ['ТОО · НДС', '★ 4.9', 'Тепловизор + LiDAR', '200 объектов'],
    details: [
      { label: 'Юрформа', value: 'ТОО · плательщик НДС' },
      { label: 'Рейтинг', value: '★ 4.9 · 200 объектов' },
      { label: 'Оборудование', value: 'DJI Matrice 350 · тепловизор · LiDAR' },
      { label: 'Что делаем', value: 'Тепловизионная инспекция, поиск дефектов, перегревов' },
      { label: 'Объекты', value: 'ЛЭП, трубопроводы, факелы, резервуары' },
      { label: 'Отчётность', value: 'Отчёт с выявленными дефектами и координатами' },
      { label: 'Отрасли', value: 'Нефтегаз, энергетика' },
      { label: 'Охват', value: 'Западный Казахстан' },
      { label: 'Сайт', value: 'inspectline.kz' },
      { label: 'Цена', value: 'по запросу (зависит от объёма)' },
    ],
  },
  // ── Заказчики ищут оператора (need-op) — часть данных скрыта до отклика ──
  {
    id: 'ad-seed-3', kind: 'need-op', author: 'ФХ «Айдана»', authorRole: 'customer', authorId: 'cu-aidana',
    directions: ['Агро'], region: 'Акмолинская обл.', city: 'Атбасар',
    title: 'Нужен оператор на десикацию, 1 200 га пшеницы',
    body: 'Есть своя техника DJI Agras T50 — нужен опытный оператор на сезон десикации. Поля рядом, логистика удобная, проживание предоставим. Работа сдельная, посменно.',
    budget: 'договорная, посменно', phone: '+7 701 000 00 01', createdAt: '2026-08-18T09:00:00.000Z', seed: true,
    badges: ['Крестьянское хозяйство', 'Техника заказчика', '1 200 га'],
    details: [
      { label: 'Кто ищет', value: 'Крестьянское хозяйство (ФХ)' },
      { label: 'Направление', value: 'Агро · десикация' },
      { label: 'Объём', value: '1 200 га пшеницы' },
      { label: 'Техника', value: 'Своя — DJI Agras T50 (оператор работает на ней)' },
      { label: 'Сроки', value: 'Конец августа, ~2 недели' },
      { label: 'Требования', value: 'Опыт от 2 сезонов, категория 3' },
      { label: 'Условия', value: 'Проживание предоставляется' },
      { label: 'Оплата', value: 'Договорная, посменно' },
    ],
  },
  {
    id: 'ad-seed-4', kind: 'need-op', author: 'ТОО «JEDI»', authorRole: 'company', authorId: 'co-jedi',
    directions: ['Агро'], region: 'Костанайская обл.',
    title: 'Компании нужны операторы на пик сезона',
    body: 'Своих бригад не хватает на пик. Нужны операторы с допусками на нашу технику T40/T50. Работа вахтой, проживание и ГСМ за наш счёт. Стабильная загрузка на 1,5–2 месяца.',
    budget: 'от 2 000 ₸/га', phone: '+7 701 000 00 02', createdAt: '2026-08-17T12:00:00.000Z', seed: true,
    badges: ['ТОО · НДС', '★ 4.9', 'Вахта · проживание + ГСМ'],
    details: [
      { label: 'Кто ищет', value: 'ТОО «JEDI» · плательщик НДС · ★ 4.9' },
      { label: 'Нужно операторов', value: '3–4 человека' },
      { label: 'Техника', value: 'Наша — DJI Agras T40 / T50' },
      { label: 'Виды работ', value: 'Опрыскивание, десикация' },
      { label: 'Сроки', value: 'Сентябрь–октябрь (1,5–2 мес)' },
      { label: 'Требования', value: 'Категория 3, свидетельство пилота' },
      { label: 'Условия', value: 'Вахта, проживание и ГСМ за счёт компании' },
      { label: 'Оплата', value: 'от 2 000 ₸/га' },
    ],
  },
  // ── Заказчики ищут услугу под ключ (need-service) — часть данных скрыта ──
  {
    id: 'ad-seed-6', kind: 'need-service', author: 'ФХ «Айдана»', authorRole: 'customer', authorId: 'cu-aidana',
    directions: ['Агро'], region: 'Акмолинская обл.', city: 'Атбасар',
    title: 'Нужна обработка 4 500 га под ключ',
    body: 'Ищем компанию со своим парком на гербицидную обработку и десикацию. Весь сезон. Богарные земли, рельеф равнинный. Нужен полный цикл: расчёт нормы, обработка, отчёт по полям.',
    budget: 'договорная', phone: '+7 701 000 00 06', createdAt: '2026-08-14T11:00:00.000Z', seed: true,
    badges: ['Крестьянское хозяйство', '4 500 га', 'Весь сезон'],
    details: [
      { label: 'Кто ищет', value: 'Крестьянское хозяйство (ФХ)' },
      { label: 'Направление', value: 'Агро · обработка под ключ' },
      { label: 'Объём', value: '4 500 га' },
      { label: 'Культуры', value: 'Пшеница, ячмень, рапс' },
      { label: 'Тип земель', value: 'Богарные, рельеф равнинный' },
      { label: 'Что нужно', value: 'Гербицидная обработка + десикация, полный цикл' },
      { label: 'Сроки', value: 'Весь сезон' },
      { label: 'Требования', value: 'Свой парк от 2 дронов, плательщик НДС, отчётность' },
      { label: 'Оплата', value: 'Договорная' },
    ],
  },
  {
    id: 'ad-seed-9', kind: 'need-service', author: 'Строй-компания «Аркада»', authorRole: 'customer', authorId: 'cu-arkada',
    directions: ['Геодезия'], region: 'Алматы', city: 'Алматы',
    title: 'Топосъёмка участка 40 га под коттеджный посёлок',
    body: 'Нужен ортофотоплан и 3D-модель площадки под проект застройки. Рельеф со склонами. Результат — в DWG и облако точек для проектировщиков. Сжатые сроки.',
    budget: 'до 400 000 ₸', phone: '+7 701 000 00 10', createdAt: '2026-08-13T10:00:00.000Z', seed: true,
    badges: ['Стройкомпания (ТОО)', '40 га', 'DWG + 3D'],
    details: [
      { label: 'Кто ищет', value: 'Строительная компания (ТОО)' },
      { label: 'Направление', value: 'Геодезия · топосъёмка' },
      { label: 'Объект', value: 'Участок 40 га под коттеджный посёлок' },
      { label: 'Рельеф', value: 'Со склонами' },
      { label: 'Что нужно', value: 'Ортофотоплан, 3D-модель, подсчёт объёмов' },
      { label: 'Форматы результата', value: 'DWG + облако точек' },
      { label: 'Требования', value: 'RTK-точность до 2 см' },
      { label: 'Сроки', value: 'До конца месяца' },
      { label: 'Бюджет', value: 'до 400 000 ₸' },
    ],
  },
  {
    id: 'ad-seed-12', kind: 'need-service', author: 'АО «Энергосети»', authorRole: 'customer', authorId: 'cu-energo',
    directions: ['Инспекция и мониторинг'], region: 'Актюбинская обл.', city: 'Актобе',
    title: 'Нужна тепловизионная инспекция 400 км ЛЭП',
    body: 'Ищем компанию с тепловизором для инспекции воздушных ЛЭП и подстанций. Поиск дефектных изоляторов и перегревов контактов. Нужен отчёт по каждому пролёту. Работа по тендеру.',
    budget: 'договорная, тендер', phone: '+7 701 000 00 13', createdAt: '2026-08-10T10:00:00.000Z', seed: true,
    badges: ['Энергокомпания (АО)', '400 км ЛЭП', 'Тендер'],
    details: [
      { label: 'Кто ищет', value: 'Энергетическая компания (АО)' },
      { label: 'Направление', value: 'Инспекция · тепловизор' },
      { label: 'Объём', value: '400 км воздушных ЛЭП + подстанции' },
      { label: 'Что нужно', value: 'Тепловизионная инспекция, дефекты изоляторов, перегревы' },
      { label: 'Отчётность', value: 'Отчёт по каждому пролёту' },
      { label: 'Требования', value: 'Тепловизор, опыт с энергосетями' },
      { label: 'Сроки', value: 'Сентябрь' },
      { label: 'Формат', value: 'Договорная, через тендер' },
    ],
  },
]
