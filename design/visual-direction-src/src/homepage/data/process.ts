import type { DocumentStatus } from './candidates';
import type { Availability } from './rules';

/** Demo offers for the «three approvals — one place» explainer (BR-01, BR-02, BR-04). */
export interface Offer {
  id: string;
  role: string;
  hotel: string;
  origin: 'Предложение отеля' | 'Ваш отклик';
  hoursLeft: number;
}

export const demoOffers: Offer[] = [
  { id: 'o1', role: 'Официант', hotel: 'Белек, курортный отель 5 звёзд', origin: 'Предложение отеля', hoursLeft: 68 },
  { id: 'o2', role: 'Room service', hotel: 'Кемер, курортный отель 5 звёзд', origin: 'Ваш отклик', hoursLeft: 41 },
  { id: 'o3', role: 'Официант', hotel: 'Аланья, курортный отель 4 звезды', origin: 'Предложение отеля', hoursLeft: 30 },
  { id: 'o4', role: 'Официант', hotel: 'Стамбул, городской отель 4 звезды', origin: 'Предложение отеля', hoursLeft: 9 },
  { id: 'o5', role: 'Бармен', hotel: 'Бодрум, курортный отель 5 звёзд', origin: 'Ваш отклик', hoursLeft: 55 },
];

/** Interview communication modes, FR-INT-01 / FR-INT-02. */
export interface InterviewMode {
  id: 'interpreter' | 'english' | 'subtitles';
  label: string;
  /** compact label for phones */
  short: string;
  description: string;
  availability: Availability;
}

export const interviewModes: InterviewMode[] = [
  {
    id: 'interpreter',
    label: 'Переводчик',
    short: 'Переводчик',
    description: 'В комнату входит переводчик Open Consulting или партнёра, который привёл кандидата.',
    availability: 'pilot',
  },
  {
    id: 'english',
    label: 'Прямой английский',
    short: 'Английский',
    description: 'Если обе стороны указали рабочий или свободный английский. Оператор всё равно получает уведомление.',
    availability: 'pilot',
  },
  {
    id: 'subtitles',
    label: 'Субтитры',
    short: 'Субтитры',
    description: 'Турецкая речь — русские субтитры кандидату, русская — турецкие отелю. Строка внизу видео.',
    availability: 'commercial',
  },
];

/** Starter document checklist for Kazakhstan → Turkey (TZ section 8, configurable by the operator). */
export const demoDocuments: { name: string; status: DocumentStatus; note?: string }[] = [
  { name: 'Загранпаспорт', status: 'ready', note: 'Срок не менее 6 месяцев' },
  { name: 'Диплом или аттестат', status: 'ready' },
  { name: 'Справка 075/у', status: 'review', note: 'Напомним за 30 дней до окончания' },
  { name: 'Справки из ПНД и НД', status: 'review' },
  { name: 'Справка о несудимости', status: 'ready' },
  { name: 'Фото на визу и страховка', status: 'missing', note: 'Нужны позже, для визы' },
];

/** Visa track after mutual confirmation, FR-VISA-01 (Should). Operator can add steps. */
export const visaTrack: { label: string; owner: 'Open Consulting' | 'Работодатель' | 'Кандидат' | 'Консульство' }[] = [
  { label: 'Пакет сверен', owner: 'Open Consulting' },
  { label: 'Апостиль и перевод', owner: 'Кандидат' },
  { label: 'Референс-номер консульства', owner: 'Кандидат' },
  { label: 'Подача в e-İzin', owner: 'Работодатель' },
  { label: 'Решение', owner: 'Консульство' },
  { label: 'Виза и билет', owner: 'Кандидат' },
  { label: 'Въезд', owner: 'Кандидат' },
];

export const visaTrackAvailability: Availability = 'commercial';
