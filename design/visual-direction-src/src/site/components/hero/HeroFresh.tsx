import { forwardRef } from 'react';
import { ArrowRight, Check, MapPin } from 'lucide-react';
import { typo } from '../../../homepage/lib/typography';
import { flows } from '../../../homepage/data/flows';
import { heroCopy } from '../../data/site';
import { plural, postedLabel, salaryKzt, salaryTry, vacancies } from '../../data/vacancies';
import { useNextStep } from '../NextStep';
import { Facts, HeroSearch, QuickLinks, RoleTabs, type HeroProps } from './parts';
import './fresh.css';

const fresh = vacancies.slice(0, 3);

/**
 * C · «Вакансии сразу». No stock photo in the first screen: the evidence is the product itself.
 * Search on the left; on the right, the newest vacancies with the salary in lira and tenge and
 * the living conditions — the thing a candidate actually came to check.
 */
export const HeroFresh = forwardRef<HTMLFormElement, HeroProps>(function HeroFresh(props, ref) {
  const c = heroCopy[props.role];
  const openNext = useNextStep();

  return (
    <section className="hero hero-fresh" aria-labelledby="hero-title">
      <div className="wrap fresh">
        <div className="fresh__main">
          <RoleTabs role={props.role} onRole={props.onRole} tone="light" />
          <h1 id="hero-title" className="fresh__title">
            {typo(c.title)}
          </h1>
          <p className="fresh__lead">{typo(c.lead)}</p>
          <HeroSearch ref={ref} id="hero" tone="light" {...props} />
          <QuickLinks tone="light" {...props} />
          <Facts tone="light" />
        </div>

        <aside className="fresh__list" aria-labelledby="fresh-title">
          <div className="fresh__list-head">
            <h2 id="fresh-title" className="fresh__list-title">
              Свежие вакансии
            </h2>
            <span className="tag-demo">Пример</span>
          </div>
          <ul>
            {fresh.map((v) => (
              <li key={v.id}>
                <button type="button" className="frow" onClick={() => openNext(flows.vacancy)}>
                  <span className="frow__top">
                    <span className="frow__title">{v.title}</span>
                    <span className="frow__date">{postedLabel(v.posted)}</span>
                  </span>
                  <span className="frow__salary num">
                    {salaryTry(v.salary)}
                    <span className="frow__kzt">{salaryKzt(v.salary)}</span>
                  </span>
                  <span className="frow__where">
                    <MapPin size={15} strokeWidth={1.75} aria-hidden="true" />
                    {v.city}
                    {v.city !== v.region && `, ${v.region}`} · {v.hotel.toLowerCase()}
                  </span>
                  <span className="frow__conds">
                    {v.housing === 'При отеле' && (
                      <span>
                        <Check size={14} strokeWidth={2.25} aria-hidden="true" />
                        Жильё
                      </span>
                    )}
                    {v.meals !== 'Не предоставляется' && (
                      <span>
                        <Check size={14} strokeWidth={2.25} aria-hidden="true" />
                        Питание
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <a className="fresh__all" href="#vacancies">
            Все {vacancies.length} {plural(vacancies.length, 'вакансия', 'вакансии', 'вакансий')}
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </aside>
      </div>
    </section>
  );
});
