/**
 * Demo vacancies for the public homepage. Fields follow TZ section 10.
 * Everything here is illustrative and is labelled «Пример» in the interface.
 * Hotel names stay hidden: no real or invented brands until hotels are verified partners.
 */

export type Region = 'Анталья' | 'Мугла' | 'Стамбул' | 'Измир';
export const regions: Region[] = ['Анталья', 'Мугла', 'Стамбул', 'Измир'];

export interface Vacancy {
  id: string;
  title: string;
  profession: string;
  hotel: string;
  city: string;
  region: Region;
  salary: { from: number; to?: number };
  housing: 'При отеле' | 'Компенсация аренды' | 'Не предоставляется';
  meals: 'Трёхразовое' | 'В смену' | 'Не предоставляется';
  schedule: string;
  language: string;
  places: number;
  season: string;
  /** days since publication, for «сегодня / 2 дня назад» */
  posted: number;
}

export const professions = [
  'Официант',
  'Горничная',
  'Повар',
  'Ресепшен',
  'Бармен',
  'Аниматор',
  'Помощник повара',
  'Кондитер',
  'Стюард',
  'SPA-мастер',
] as const;

export const vacancies: Vacancy[] = [
  { id: 'v01', title: 'Официант ресторана à la carte', profession: 'Официант', hotel: 'Курортный отель, 5 звёзд', city: 'Белек', region: 'Анталья', salary: { from: 32000, to: 36000 }, housing: 'При отеле', meals: 'Трёхразовое', schedule: '6/1, смены', language: 'Английский — базовый', places: 4, season: 'Апрель — октябрь', posted: 0 },
  { id: 'v02', title: 'Горничная', profession: 'Горничная', hotel: 'Курортный отель, 4 звезды', city: 'Аланья', region: 'Анталья', salary: { from: 28000 }, housing: 'При отеле', meals: 'Трёхразовое', schedule: '6/1', language: 'Не требуется', places: 6, season: 'Май — октябрь', posted: 0 },
  { id: 'v03', title: 'Повар горячего цеха', profession: 'Повар', hotel: 'Курортный отель, 5 звёзд', city: 'Кемер', region: 'Анталья', salary: { from: 40000, to: 46000 }, housing: 'При отеле', meals: 'Трёхразовое', schedule: '6/1, смены', language: 'Турецкий или английский — базовый', places: 2, season: 'Апрель — ноябрь', posted: 1 },
  { id: 'v04', title: 'Администратор ресепшен', profession: 'Ресепшен', hotel: 'Городской отель, 4 звезды', city: 'Стамбул', region: 'Стамбул', salary: { from: 38000 }, housing: 'Компенсация аренды', meals: 'В смену', schedule: '5/2, смены', language: 'Английский — рабочий', places: 1, season: 'Круглый год', posted: 1 },
  { id: 'v05', title: 'Бармен лобби-бара', profession: 'Бармен', hotel: 'Курортный отель, 5 звёзд', city: 'Бодрум', region: 'Мугла', salary: { from: 34000, to: 38000 }, housing: 'При отеле', meals: 'Трёхразовое', schedule: '6/1, смены', language: 'Английский — рабочий', places: 2, season: 'Май — октябрь', posted: 2 },
  { id: 'v06', title: 'Аниматор детского клуба', profession: 'Аниматор', hotel: 'Курортный отель, 5 звёзд', city: 'Сиде', region: 'Анталья', salary: { from: 30000, to: 33000 }, housing: 'При отеле', meals: 'Трёхразовое', schedule: '6/1', language: 'Английский — базовый', places: 3, season: 'Май — октябрь', posted: 2 },
  { id: 'v07', title: 'Помощник повара', profession: 'Помощник повара', hotel: 'Курортный отель, 4 звезды', city: 'Мармарис', region: 'Мугла', salary: { from: 29000 }, housing: 'При отеле', meals: 'Трёхразовое', schedule: '6/1, смены', language: 'Не требуется', places: 4, season: 'Апрель — октябрь', posted: 3 },
  { id: 'v08', title: 'Кондитер', profession: 'Кондитер', hotel: 'Курортный отель, 5 звёзд', city: 'Белек', region: 'Анталья', salary: { from: 42000, to: 48000 }, housing: 'При отеле', meals: 'Трёхразовое', schedule: '6/1', language: 'Турецкий или английский — базовый', places: 1, season: 'Апрель — ноябрь', posted: 3 },
  { id: 'v09', title: 'Стюард (мойка и кухня)', profession: 'Стюард', hotel: 'Курортный отель, 4 звезды', city: 'Аланья', region: 'Анталья', salary: { from: 27000 }, housing: 'При отеле', meals: 'Трёхразовое', schedule: '6/1, смены', language: 'Не требуется', places: 5, season: 'Май — октябрь', posted: 4 },
  { id: 'v10', title: 'Официант room service', profession: 'Официант', hotel: 'Курортный отель, 5 звёзд', city: 'Кемер', region: 'Анталья', salary: { from: 31000, to: 34000 }, housing: 'При отеле', meals: 'Трёхразовое', schedule: '6/1, смены', language: 'Английский — базовый', places: 2, season: 'Апрель — октябрь', posted: 5 },
  { id: 'v11', title: 'SPA-мастер (массаж)', profession: 'SPA-мастер', hotel: 'Курортный отель, 5 звёзд', city: 'Чешме', region: 'Измир', salary: { from: 36000, to: 42000 }, housing: 'При отеле', meals: 'Трёхразовое', schedule: '6/1', language: 'Английский — рабочий', places: 1, season: 'Май — сентябрь', posted: 6 },
  { id: 'v12', title: 'Горничная (старшая смена)', profession: 'Горничная', hotel: 'Городской отель, 5 звёзд', city: 'Стамбул', region: 'Стамбул', salary: { from: 33000 }, housing: 'Компенсация аренды', meals: 'В смену', schedule: '5/2', language: 'Английский — базовый', places: 2, season: 'Круглый год', posted: 6 },
];

/** Demo conversion so a candidate can read the salary in tenge. Not a real rate. */
export const DEMO_TRY_TO_KZT = 12;

const nf = new Intl.NumberFormat('ru-RU');

export function salaryTry(s: Vacancy['salary']) {
  return s.to ? `${nf.format(s.from)} – ${nf.format(s.to)} ₺` : `от ${nf.format(s.from)} ₺`;
}

export function salaryKzt(s: Vacancy['salary']) {
  const round = (n: number) => Math.round((n * DEMO_TRY_TO_KZT) / 1000) * 1000;
  return s.to ? `≈ ${nf.format(round(s.from))} – ${nf.format(round(s.to))} ₸` : `≈ от ${nf.format(round(s.from))} ₸`;
}

export function postedLabel(days: number) {
  if (days === 0) return 'сегодня';
  if (days === 1) return 'вчера';
  return `${days} ${days < 5 ? 'дня' : 'дней'} назад`;
}

export function search(query: string, region: Region | 'all') {
  const q = query.trim().toLocaleLowerCase('ru');
  return vacancies.filter(
    (v) =>
      (region === 'all' || v.region === region) &&
      (!q || `${v.title} ${v.profession} ${v.city}`.toLocaleLowerCase('ru').includes(q)),
  );
}

export function minSalaryFor(profession: string) {
  const list = vacancies.filter((v) => v.profession === profession);
  return list.length ? Math.min(...list.map((v) => v.salary.from)) : null;
}

export function countIn(region: Region) {
  return vacancies.filter((v) => v.region === region).length;
}

export function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

export const formatNumber = (n: number) => nf.format(n);
