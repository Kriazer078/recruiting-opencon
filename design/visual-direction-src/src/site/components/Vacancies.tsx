import { forwardRef, useState } from 'react';
import { ArrowRight, Building2, Check, Clock, Languages, MapPin, SearchX, X } from 'lucide-react';
import { flows } from '../../homepage/data/flows';
import { range } from '../../homepage/data/rules';
import {
  DEMO_TRY_TO_KZT,
  plural,
  postedLabel,
  professions,
  salaryKzt,
  salaryTry,
  search,
  type Region,
  type Vacancy,
} from '../data/vacancies';
import type { Role } from '../data/site';
import { useNextStep } from './NextStep';
import './vacancies.css';

interface Props {
  role: Role;
  query: string;
  region: Region | 'all';
  onFilter: (query: string, region: Region | 'all') => void;
}

const PAGE = 6;
const PAGE_PHONE = 3;
const isPhone = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches;
const tabs = ['Все', ...professions.slice(0, 7)];

export const Vacancies = forwardRef<HTMLElement, Props>(function Vacancies({ role, query, region, onFilter }, ref) {
  const openNext = useNextStep();
  const page = isPhone() ? PAGE_PHONE : PAGE;
  const [shown, setShown] = useState(page);
  const results = search(query, region);
  const visible = results.slice(0, shown);
  const filtered = Boolean(query.trim()) || region !== 'all';

  const apply = () =>
    openNext({
      title: 'Отклик на вакансию',
      steps: [...flows.candidateSignup.steps],
      text: 'Откликнуться можно после публикации анкеты: так отель увидит ваши фото, видео и опыт. Эта версия сайта не собирает данные.',
    });

  return (
    <section ref={ref} id="vacancies" className="section vac" aria-labelledby="vac-title">
      <div className="wrap">
        <div className="section__head">
          <h2 id="vac-title" className="h2">Вакансии дня</h2>
          <a className="more-link" href="#vacancies" onClick={() => openNext(flows.vacancy)}>
            Все вакансии <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>

        <div className="vac__tabs" role="group" aria-label="Профессия">
          {tabs.map((t) => {
            const value = t === 'Все' ? '' : t;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={query === value}
                onClick={() => {
                  setShown(page);
                  onFilter(value, region);
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="vac__meta" aria-live="polite">
          <span>
            {results.length} {plural(results.length, 'вакансия', 'вакансии', 'вакансий')}
            {query.trim() && <> по запросу «{query.trim()}»</>}
            {region !== 'all' && <> · {region}</>}
          </span>
          <span className="tag-demo">Пример</span>
          {filtered && (
            <button type="button" className="vac__reset" onClick={() => onFilter('', 'all')}>
              <X size={16} aria-hidden="true" /> Сбросить
            </button>
          )}
        </div>

        {visible.length > 0 ? (
          <ul className="vac__grid">
            {visible.map((v) => (
              <li key={v.id}>
                <VacancyCard v={v} hotel={role === 'hotel'} onOpen={() => openNext(flows.vacancy)} onApply={apply} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="vac__empty">
            <SearchX size={28} strokeWidth={1.5} aria-hidden="true" />
            <p className="h3">По этому запросу вакансий нет</p>
            <p>Попробуйте другую профессию или регион. Можно создать анкету — отели сами пришлют предложения по вашим профессиям.</p>
            <div>
              <button type="button" className="btn btn--line" onClick={() => onFilter('', 'all')}>Показать все вакансии</button>
              <button type="button" className="btn btn--red" onClick={() => openNext(flows.candidateSignup)}>Создать анкету</button>
            </div>
          </div>
        )}

        {results.length > shown && (
          <div className="vac__more">
            <button type="button" className="btn btn--line btn--lg" onClick={() => setShown((n) => n + page)}>
              Показать ещё {Math.min(page, results.length - shown)}
            </button>
          </div>
        )}

        <p className="vac__note">
          Откликнуться можно после публикации анкеты — вакансии подбираются по {range(1, 3)} профессиям из анкеты.
          Сумма в тенге — примерная, по условному курсу 1 ₺ = {DEMO_TRY_TO_KZT} ₸.
        </p>
      </div>
    </section>
  );
});

function VacancyCard({ v, hotel, onOpen, onApply }: { v: Vacancy; hotel: boolean; onOpen: () => void; onApply: () => void }) {
  const housingOk = v.housing === 'При отеле';
  const mealsOk = v.meals !== 'Не предоставляется';
  return (
    <article className="vcard">
      <div className="vcard__top">
        <span className="tag-demo">Пример</span>
        <span className="vcard__date">{postedLabel(v.posted)}</span>
      </div>
      <h3 className="vcard__title">
        <button type="button" onClick={onOpen}>{v.title}</button>
      </h3>
      <p className="vcard__salary num">
        {salaryTry(v.salary)} <span>в месяц</span>
      </p>
      <p className="vcard__kzt num">{salaryKzt(v.salary)}</p>
      <p className="vcard__where">
        <span><Building2 size={16} strokeWidth={1.75} aria-hidden="true" />{v.hotel}</span>
        <span><MapPin size={16} strokeWidth={1.75} aria-hidden="true" />{v.city}{v.city !== v.region && `, ${v.region}`}</span>
      </p>
      <ul className="vcard__conds" aria-label="Условия">
        <li className={housingOk ? 'is-ok' : undefined}>
          {housingOk ? <Check size={16} strokeWidth={2.25} aria-hidden="true" /> : <Building2 size={16} strokeWidth={1.75} aria-hidden="true" />}
          Жильё: {v.housing.toLowerCase()}
        </li>
        <li className={mealsOk ? 'is-ok' : undefined}>
          {mealsOk && <Check size={16} strokeWidth={2.25} aria-hidden="true" />}
          Питание: {v.meals.toLowerCase()}
        </li>
        <li><Clock size={16} strokeWidth={1.75} aria-hidden="true" />{v.schedule}</li>
        <li><Languages size={16} strokeWidth={1.75} aria-hidden="true" />{v.language}</li>
      </ul>
      <div className="vcard__foot">
        <span>
          {v.places} {plural(v.places, 'место', 'места', 'мест')} · {v.season}
        </span>
        {hotel ? (
          <button type="button" className="btn btn--line" onClick={onOpen}>Подробнее</button>
        ) : (
          <button type="button" className="btn btn--red" onClick={onApply}>Откликнуться</button>
        )}
      </div>
    </article>
  );
}
