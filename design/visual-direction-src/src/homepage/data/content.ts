/** Navigation and copy that does not belong to a single component. */

export type Role = 'candidate' | 'hotel';

export interface NavItem {
  label: string;
  href: string;
  role?: Role;
}

/** Menu items exactly as listed in TZ 4.1. */
export const primaryNav: NavItem[] = [
  { label: 'Вакансии', href: '#vacancies' },
  { label: 'Как это работает', href: '#how' },
  { label: 'Кандидатам', href: '#top', role: 'candidate' },
  { label: 'Работодателям', href: '#top', role: 'hotel' },
  { label: 'Партнёрам', href: '#partners' },
  { label: 'Новости', href: '#news' },
  { label: 'Контакты', href: '#contacts' },
];

export const languages = [
  { code: 'RU', name: 'Русский', ready: true },
  { code: 'KZ', name: 'Қазақша', ready: false },
  { code: 'TR', name: 'Türkçe', ready: false },
  { code: 'EN', name: 'English', ready: false },
] as const;

export interface HeroCopy {
  context: string;
  title: string;
  lead: string;
  primary: string;
  secondary: { label: string; href: string };
  note: string;
}

export const heroCopy: Record<Role, HeroCopy> = {
  candidate: {
    context: 'Для кандидатов из Казахстана',
    title: 'Работа в отелях Турции',
    lead: 'Запишите 30 секунд о себе — отель увидит вас до собеседования.',
    primary: 'Создать анкету',
    secondary: { label: 'Смотреть вакансии', href: '#vacancies' },
    note: 'Вход по номеру телефона или ЭЦП. Анкету видят только проверенные отели — после модерации.',
  },
  hotel: {
    context: 'Для отелей Турции',
    title: 'Сотрудники из Казахстана',
    lead: 'Посмотрите на кандидата до собеседования. Выбранный кандидат подтверждает только одно место.',
    primary: 'Зарегистрировать отель',
    secondary: { label: 'Как отель видит анкету', href: '#how' },
    note: 'Вакансии публикуются после проверки документов компании оператором Open Consulting.',
  },
};

export type NewsRubric = 'Визы и правила' | 'Отели' | 'Набор' | 'Партнёры';
export const newsRubrics: NewsRubric[] = ['Визы и правила', 'Отели', 'Набор', 'Партнёры'];

/** Demo publications. Real news are written and pinned by the operator (FR-UI-03). */
export const demoNews: { id: string; date: string; rubric: NewsRubric; title: string; lead: string; pinned?: boolean }[] = [
  {
    id: 'n1',
    date: '2026-10-02',
    rubric: 'Визы и правила',
    title: 'Какие документы собрать до публикации анкеты',
    lead: 'Чек-лист кандидата: что нужно сразу, а что понадобится только для визы.',
    pinned: true,
  },
  {
    id: 'n2',
    date: '2026-09-28',
    rubric: 'Отели',
    title: 'Как проходит собеседование с переводчиком',
    lead: 'Кто входит в комнату, как выбирается режим общения и почему встречу назначают заранее.',
  },
  {
    id: 'n3',
    date: '2026-09-21',
    rubric: 'Набор',
    title: 'Как подготовить видеопрезентацию',
    lead: 'Свет, кадр в рост, спокойный темп: шесть вопросов появятся на экране по очереди.',
  },
  {
    id: 'n4',
    date: '2026-09-14',
    rubric: 'Партнёры',
    title: 'Что даёт партнёрский код',
    lead: 'Логотип партнёра на анкете, общий кабинет и отчёт по выездам.',
  },
];

const dateFormat = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
export const formatDate = (iso: string) => dateFormat.format(new Date(iso));
