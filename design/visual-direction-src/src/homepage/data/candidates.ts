import type { PhotoKey } from './media';

/** Language levels exactly as defined in TZ 6.1. */
export const languageLevels = ['нет', 'базовый', 'рабочий', 'свободный'] as const;
export type LanguageLevel = 0 | 1 | 2 | 3;

/** Document package traffic light, FR-DOC-01. */
export type DocumentStatus = 'missing' | 'review' | 'ready';

export interface Crop {
  photo: PhotoKey;
  /** object-position and transform-origin */
  focal: string;
  /** additional zoom over object-fit: cover */
  zoom?: number;
}

export interface Candidate {
  id: string;
  /** demo first name; real profiles show the name only to verified hotels */
  name: string;
  professions: string[];
  homeCity: string;
  experienceTotal: string;
  experience: { role: string; place: string; period: string }[];
  languages: { name: string; level: LanguageLevel }[];
  readiness: { label: string; value: boolean }[];
  salary: string;
  source: { kind: 'open-consulting' | 'partner'; label: string };
  documents: DocumentStatus;
  presentation: { poster: Crop; duration: string };
  photos: { face: Crop; full: [Crop, Crop, Crop] };
}

/**
 * Demo profiles. Invented for UI development and marked «Пример» everywhere they appear.
 * The photographs are stock images of models, not of real candidates.
 */
export const candidates: Candidate[] = [
  {
    id: 'waiter',
    name: 'Даурен',
    professions: ['Официант', 'Room service'],
    homeCity: 'Шымкент',
    experienceTotal: '4 года',
    experience: [
      { role: 'Официант', place: 'Ресторан при гостинице, Шымкент', period: '2021–2025' },
      { role: 'Room service', place: 'Гостиница, Туркестан', period: '2020–2021' },
    ],
    languages: [
      { name: 'Казахский', level: 3 },
      { name: 'Русский', level: 3 },
      { name: 'Английский', level: 2 },
      { name: 'Турецкий', level: 1 },
    ],
    readiness: [
      { label: 'Проживание при отеле', value: true },
      { label: 'Сменный график', value: true },
    ],
    salary: 'от 30 000 ₺ в месяц',
    source: { kind: 'open-consulting', label: 'Open Consulting' },
    documents: 'ready',
    presentation: { poster: { photo: 'waiterStanding', focal: '47% 56%', zoom: 1.3 }, duration: '0:31' },
    photos: {
      face: { photo: 'waiterCoffee', focal: '47% 33%', zoom: 4 },
      full: [
        { photo: 'waiterStanding', focal: '47% 55%' },
        { photo: 'waiterCoffee', focal: '30% 50%' },
        { photo: 'waiterLinen', focal: '32% 50%' },
      ],
    },
  },
  {
    id: 'housekeeper',
    name: 'Айжан',
    professions: ['Горничная', 'Прачечная'],
    homeCity: 'Туркестан',
    experienceTotal: '3 года',
    experience: [{ role: 'Горничная', place: 'Отель, Алматы', period: '2022–2025' }],
    languages: [
      { name: 'Казахский', level: 3 },
      { name: 'Русский', level: 2 },
      { name: 'Турецкий', level: 1 },
      { name: 'Английский', level: 0 },
    ],
    readiness: [
      { label: 'Проживание при отеле', value: true },
      { label: 'Сменный график', value: true },
    ],
    salary: 'от 26 000 ₺ в месяц',
    source: { kind: 'partner', label: 'Партнёр Open Consulting' },
    documents: 'review',
    presentation: { poster: { photo: 'housekeeperSheets', focal: '50% 35%' }, duration: '0:28' },
    photos: {
      face: { photo: 'housekeeperSheets', focal: '54% 27%', zoom: 2.6 },
      full: [
        { photo: 'housekeeperSheets', focal: '50% 40%' },
        { photo: 'housekeeperPillow', focal: '45% 40%' },
        { photo: 'housekeeperBed', focal: '50% 45%' },
      ],
    },
  },
  {
    id: 'cook',
    name: 'Мадина',
    professions: ['Повар горячего цеха', 'Помощник повара'],
    homeCity: 'Алматы',
    experienceTotal: '6 лет',
    experience: [
      { role: 'Повар горячего цеха', place: 'Ресторан, Алматы', period: '2021–2025' },
      { role: 'Помощник повара', place: 'Кафе при гостинице, Алматы', period: '2019–2021' },
    ],
    languages: [
      { name: 'Русский', level: 3 },
      { name: 'Казахский', level: 2 },
      { name: 'Английский', level: 1 },
      { name: 'Турецкий', level: 0 },
    ],
    readiness: [
      { label: 'Проживание при отеле', value: true },
      { label: 'Сменный график', value: true },
    ],
    salary: 'от 38 000 ₺ в месяц',
    source: { kind: 'open-consulting', label: 'Open Consulting' },
    documents: 'ready',
    presentation: { poster: { photo: 'cookPortrait', focal: '52% 30%' }, duration: '0:34' },
    photos: {
      face: { photo: 'cookPortrait', focal: '53% 20%', zoom: 2.6 },
      full: [
        { photo: 'cookPortrait', focal: '52% 40%' },
        { photo: 'cookSteamer', focal: '50% 40%' },
        { photo: 'cookWorking', focal: '50% 45%' },
      ],
    },
  },
];

export const documentStatusLabel: Record<DocumentStatus, string> = {
  missing: 'Не собран',
  review: 'На проверке',
  ready: 'Готов',
};
