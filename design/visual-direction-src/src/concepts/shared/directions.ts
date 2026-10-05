import type { Role } from '../../homepage/data/content';
import { vacancies, type Region, type Vacancy } from '../../homepage/data/vacancies';

export type DirectionId = 'portal' | 'guide' | 'scenes';

export const directions: { id: DirectionId; name: string; model: string }[] = [
  { id: 'portal', name: 'Биржа', model: 'Каталог: сначала вакансии, правила — сноской' },
  { id: 'guide', name: 'Сопровождение', model: 'Услуга: маршрут, сроки и кто за что отвечает' },
  { id: 'scenes', name: 'Лица', model: 'Показ: люди за работой и формат видеопрезентации' },
];

export interface DirectionProps {
  role: Role;
  onRoleChange: (role: Role) => void;
}

/** Search on demo vacancies. Matches profession and its category, case-insensitive. */
export function searchVacancies(query: string, region: Region): Vacancy[] {
  const q = query.trim().toLocaleLowerCase('ru');
  return vacancies.filter((v) => {
    const byRegion = region === 'Вся Турция' || v.region === region;
    const byText = !q || `${v.profession} ${v.category} ${v.city}`.toLocaleLowerCase('ru').includes(q);
    return byRegion && byText;
  });
}

/** «1 вакансия», «2 вакансии», «5 вакансий». */
export function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

/** Programmatic scrolling respects the reduced-motion setting. */
export function scrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}
