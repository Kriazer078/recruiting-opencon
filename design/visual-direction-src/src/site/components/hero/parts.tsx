import { forwardRef, type FormEvent } from 'react';
import { CheckCircle2, ChevronDown, Search } from 'lucide-react';
import { flows } from '../../../homepage/data/flows';
import { heroCopy, type Role } from '../../data/site';
import { professions, regions, type Region } from '../../data/vacancies';
import { useNextStep } from '../NextStep';
import './parts.css';

export type HeroTone = 'light' | 'dark';

export interface HeroProps {
  role: Role;
  onRole: (r: Role) => void;
  query: string;
  onQuery: (q: string) => void;
  region: Region | 'all';
  onRegion: (r: Region | 'all') => void;
  onSearch: (q?: string) => void;
}

type SearchProps = Pick<HeroProps, 'role' | 'query' | 'onQuery' | 'region' | 'onRegion' | 'onSearch'> & {
  tone: HeroTone;
  /** "framed": 2px ink frame on a light page (HH-style search line) */
  framed?: boolean;
  id: string;
};

/** The one search form of the first screen; every variant renders it. */
export const HeroSearch = forwardRef<HTMLFormElement, SearchProps>(function HeroSearch(
  { role, query, onQuery, region, onRegion, onSearch, tone, framed, id },
  ref,
) {
  const c = heroCopy[role];
  const openNext = useNextStep();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (role === 'hotel') {
      openNext({
        ...flows.hotelSignup,
        title: 'Поиск кандидатов',
        text: 'Анкеты видят только проверенные отели — по профессиям своих вакансий. Зарегистрируйте компанию, и после проверки откроется каталог кандидатов. Эта версия сайта не собирает данные.',
      });
      return;
    }
    onSearch();
  };

  return (
    <form
      ref={ref}
      className={`hs hs--${tone}${framed ? ' hs--framed' : ''}`}
      role="search"
      aria-label={role === 'hotel' ? 'Поиск кандидатов' : 'Поиск вакансий'}
      onSubmit={submit}
    >
      <label className="hs__q">
        <span className="visually-hidden">{c.placeholder}</span>
        <Search size={22} strokeWidth={1.75} aria-hidden="true" />
        <input
          id={`${id}-q`}
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={c.placeholder}
          autoComplete="off"
          enterKeyHint="search"
        />
      </label>
      <label className="hs__region">
        <span className="visually-hidden">{role === 'hotel' ? 'Где ваш отель' : 'Регион Турции'}</span>
        <select id={`${id}-region`} value={region} onChange={(e) => onRegion(e.target.value as Region | 'all')}>
          <option value="all">Вся Турция</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <ChevronDown size={18} strokeWidth={1.75} aria-hidden="true" />
      </label>
      <button type="submit" className="btn btn--red hs__submit">
        {c.submit}
      </button>
    </form>
  );
});

/** «Часто ищут» as text links: quick picks without a row of pills. */
export function QuickLinks({
  role,
  query,
  onQuery,
  onSearch,
  tone,
  count = 5,
}: Pick<HeroProps, 'role' | 'query' | 'onQuery' | 'onSearch'> & { tone: HeroTone; count?: number }) {
  return (
    <div className={`ql ql--${tone}`}>
      <span className="ql__label">{role === 'hotel' ? 'Чаще всего нужны' : 'Часто ищут'}</span>
      <ul>
        {professions.slice(0, count).map((p) => (
          <li key={p}>
            <button
              type="button"
              aria-pressed={query === p}
              onClick={() => {
                onQuery(p);
                // a hotel looks for people, not jobs: the link only fills the field
                if (role === 'candidate') onSearch(p);
              }}
            >
              {p}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Role switch for phones, where the audience strip of the header is hidden. */
export function RoleTabs({ role, onRole, tone }: Pick<HeroProps, 'role' | 'onRole'> & { tone: HeroTone }) {
  return (
    <div className={`rt rt--${tone}`} role="group" aria-label="Кто вы">
      <button type="button" aria-pressed={role === 'candidate'} onClick={() => onRole('candidate')}>
        Ищу работу
      </button>
      <button type="button" aria-pressed={role === 'hotel'} onClick={() => onRole('hotel')}>
        Ищу сотрудников
      </button>
    </div>
  );
}

const facts = ['Отели проверены', 'Собеседование с переводчиком', 'Сопровождение документов'];

/** What Open Consulting does, linked to «Как устроен найм». */
export function Facts({ tone }: { tone: HeroTone }) {
  return (
    <ul className={`facts facts--${tone}`} aria-label="Что делает Open Consulting">
      {facts.map((f) => (
        <li key={f}>
          <a href="#how">
            <CheckCircle2 size={17} strokeWidth={1.75} aria-hidden="true" />
            {f}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Credit({ author, site, page, tone }: { author: string; site: string; page: string; tone: HeroTone }) {
  return (
    <p className={`credit credit--${tone}`}>
      Фото:{' '}
      <a href={page} target="_blank" rel="noreferrer">
        {author}, {site}
      </a>
    </p>
  );
}
