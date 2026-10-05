/**
 * Demo vacancies (fields from TZ section 10). Hotel names are deliberately not shown:
 * no real or invented brands appear until hotels are verified partners.
 */
export interface Vacancy {
  id: string;
  profession: string;
  category: string;
  hotel: string;
  city: string;
  region: string;
  salary: { from: number; to?: number; currency: '₺' };
  housing: string;
  meals: string;
  schedule: string;
  language: string;
  places: number;
  season: string;
}

export const regions = ['Вся Турция', 'Анталья', 'Мугла', 'Стамбул'] as const;
export type Region = (typeof regions)[number];

export const professionShortcuts = ['Официант', 'Горничная', 'Повар', 'Ресепшен', 'Бармен'] as const;

export const vacancies: Vacancy[] = [
  {
    id: 'v1',
    profession: 'Официант ресторана à la carte',
    category: 'Официант',
    hotel: 'Курортный отель, 5 звёзд',
    city: 'Белек',
    region: 'Анталья',
    salary: { from: 32000, to: 36000, currency: '₺' },
    housing: 'При отеле',
    meals: 'Трёхразовое',
    schedule: '6/1, смены',
    language: 'Английский — базовый',
    places: 4,
    season: 'Апрель — октябрь',
  },
  {
    id: 'v2',
    profession: 'Горничная',
    category: 'Горничная',
    hotel: 'Курортный отель, 4 звезды',
    city: 'Аланья',
    region: 'Анталья',
    salary: { from: 28000, currency: '₺' },
    housing: 'При отеле',
    meals: 'Трёхразовое',
    schedule: '6/1',
    language: 'Не требуется',
    places: 6,
    season: 'Май — октябрь',
  },
  {
    id: 'v3',
    profession: 'Повар горячего цеха',
    category: 'Повар',
    hotel: 'Курортный отель, 5 звёзд',
    city: 'Кемер',
    region: 'Анталья',
    salary: { from: 40000, to: 46000, currency: '₺' },
    housing: 'При отеле',
    meals: 'Трёхразовое',
    schedule: '6/1, смены',
    language: 'Турецкий или английский — базовый',
    places: 2,
    season: 'Апрель — ноябрь',
  },
  {
    id: 'v4',
    profession: 'Администратор ресепшен',
    category: 'Ресепшен',
    hotel: 'Городской отель, 4 звезды',
    city: 'Стамбул',
    region: 'Стамбул',
    salary: { from: 38000, currency: '₺' },
    housing: 'Компенсация аренды',
    meals: 'В смену',
    schedule: '5/2, смены',
    language: 'Английский — рабочий',
    places: 1,
    season: 'Круглый год',
  },
  {
    id: 'v5',
    profession: 'Бармен лобби-бара',
    category: 'Бармен',
    hotel: 'Курортный отель, 5 звёзд',
    city: 'Бодрум',
    region: 'Мугла',
    salary: { from: 34000, to: 38000, currency: '₺' },
    housing: 'При отеле',
    meals: 'Трёхразовое',
    schedule: '6/1, смены',
    language: 'Английский — рабочий',
    places: 2,
    season: 'Май — октябрь',
  },
];

const numberFormat = new Intl.NumberFormat('ru-RU');

export function formatSalary(s: Vacancy['salary']) {
  const from = numberFormat.format(s.from);
  return s.to ? `${from}–${numberFormat.format(s.to)} ${s.currency}` : `от ${from} ${s.currency}`;
}
