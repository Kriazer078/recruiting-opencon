import { useId, useMemo, useState } from 'react';
import { ArrowRight, BedDouble, CalendarClock, ChevronDown, Languages, Search, UtensilsCrossed, X } from 'lucide-react';
import { Chapter } from '../components/Chapter';
import { DemoTag } from '../components/Media';
import { flows, useNextStep } from '../components/NextStep';
import { formatSalary, professionShortcuts, regions, vacancies, type Region, type Vacancy } from '../data/vacancies';
import { range, rules } from '../data/rules';
import { cx } from '../lib/cx';
import './vacancies.css';

const normalize = (s: string) => s.trim().toLowerCase().replace(/ё/g, 'е');

function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

export function VacanciesChapter() {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState<Region>('Вся Турция');
  const ids = { query: useId(), region: useId() };

  const results = useMemo(() => {
    const q = normalize(query);
    return vacancies.filter(
      (v) =>
        (region === 'Вся Турция' || v.region === region) &&
        (!q || normalize(v.profession).includes(q) || normalize(v.category).includes(q)),
    );
  }, [query, region]);

  const reset = () => {
    setQuery('');
    setRegion('Вся Турция');
  };

  return (
    <Chapter
      id="vacancies"
      title="Вакансии с условиями, которые важны до переезда"
      lead="Зарплата, жильё, питание, график и требования к языку — в первой строке, а не в конце описания."
      sides={{
        candidate: `Лента подбирается по ${range(rules.professionsPerProfile.min, rules.professionsPerProfile.max)} профессиям вашей анкеты. Откликнуться можно после её публикации.`,
        hotel: 'Вакансии публикуются после проверки компании. Первая проходит модерацию.',
      }}
    >
      <form className="vsearch" role="search" aria-label="Поиск вакансий" onSubmit={(e) => e.preventDefault()}>
        <div className="vsearch__field vsearch__field--query">
          <label htmlFor={ids.query} className="t-label">
            Профессия
          </label>
          <div className="vsearch__control">
            <Search size={18} aria-hidden="true" />
            <input
              id={ids.query}
              type="search"
              value={query}
              placeholder="Например, официант"
              autoComplete="off"
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button type="button" className="vsearch__clear" onClick={() => setQuery('')} aria-label="Очистить профессию">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="vsearch__field vsearch__field--region">
          <label htmlFor={ids.region} className="t-label">
            Регион Турции
          </label>
          <div className="vsearch__control vsearch__control--select">
            <select id={ids.region} value={region} onChange={(e) => setRegion(e.target.value as Region)}>
              {regions.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <ChevronDown size={18} aria-hidden="true" />
          </div>
        </div>
        <div className="vsearch__shortcuts" role="group" aria-label="Быстрый выбор профессии">
          {professionShortcuts.map((p) => {
            const active = normalize(query) === normalize(p);
            return (
              <button
                key={p}
                type="button"
                className={cx('chip', active && 'is-active')}
                aria-pressed={active}
                onClick={() => setQuery(active ? '' : p)}
              >
                {p}
              </button>
            );
          })}
        </div>
      </form>

      <div className="vlist-head">
        <p className="t-small t-muted" aria-live="polite">
          <span className="t-num">{results.length}</span> {plural(results.length, 'вакансия', 'вакансии', 'вакансий')}
        </p>
        <DemoTag>Примеры вакансий. Названия отелей скрыты</DemoTag>
      </div>

      {results.length > 0 ? (
        <ul className="vlist">
          {results.map((v) => (
            <li key={v.id}>
              <VacancyRow vacancy={v} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="vempty">
          <p className="t-h3">В примерах нет такой вакансии</p>
          <p className="t-small t-muted">
            Попробуйте другую профессию или регион. В рабочей версии здесь будут все опубликованные вакансии.
          </p>
          <button type="button" className="btn btn--secondary btn--md vempty__reset" onClick={reset}>
            Сбросить фильтр
          </button>
        </div>
      )}
    </Chapter>
  );
}

function VacancyRow({ vacancy: v }: { vacancy: Vacancy }) {
  const openNext = useNextStep();
  const titleId = useId();
  const conditions = [
    { icon: BedDouble, label: 'Жильё', value: v.housing },
    { icon: UtensilsCrossed, label: 'Питание', value: v.meals },
    { icon: CalendarClock, label: 'График', value: v.schedule },
    { icon: Languages, label: 'Язык', value: v.language },
  ];
  return (
    <article className="vrow" aria-labelledby={titleId}>
      <div className="vrow__main">
        <h3 id={titleId} className="vrow__title">
          {v.profession}
        </h3>
        <p className="vrow__place t-small">
          {v.hotel} · {v.city === v.region ? v.city : `${v.city}, ${v.region}`}
        </p>
      </div>
      <p className="vrow__salary">
        <span className="t-num">{formatSalary(v.salary)}</span>
        <span className="t-small t-muted">в месяц</span>
      </p>
      <dl className="vrow__conditions">
        {conditions.map(({ icon: Icon, label, value }) => (
          <div key={label}>
            <dt>
              <Icon size={16} aria-hidden="true" />
              {label}
            </dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="vrow__meta t-small">
        <span className="t-num">
          {v.places} {plural(v.places, 'место', 'места', 'мест')}
        </span>
        <span aria-hidden="true">·</span>
        <span>Сезон: {v.season.toLowerCase()}</span>
      </div>
      <button type="button" className="vrow__more" onClick={() => openNext(flows.vacancy)}>
        Подробнее <ArrowRight size={16} aria-hidden="true" />
        <span className="visually-hidden">: {v.profession}</span>
      </button>
    </article>
  );
}
