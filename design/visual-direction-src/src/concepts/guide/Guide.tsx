import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Accordion } from 'radix-ui';
import { Check, ChevronDown, Search } from 'lucide-react';
import { Logo } from '../../homepage/components/Logo';
import { primaryNav, demoNews, formatDate, type Role } from '../../homepage/data/content';
import { flows } from '../../homepage/data/flows';
import { formatSalary, regions, type Region, type Vacancy } from '../../homepage/data/vacancies';
import { typo } from '../../homepage/lib/typography';
import { localPhotos } from '../shared/photos';
import { MenuSheet } from '../shared/MenuSheet';
import { useNextStep } from '../shared/NextStep';
import { plural, searchVacancies, type DirectionProps } from '../shared/directions';
import { faq, needs, routes } from './route';
import './guide.css';

const copy: Record<Role, { title: string; lead: string; field: string; other: string; otherAction: string }> = {
  candidate: {
    title: 'Работа в отелях Турции с сопровождением до выезда',
    lead: 'Open Consulting проверяет отели, переводит на собеседовании и ведёт документы. На каждом шаге видно, что делать дальше и кто за это отвечает.',
    field: 'Профессия',
    other: 'Вы работодатель?',
    otherAction: 'Ищу сотрудников',
  },
  hotel: {
    title: 'Сотрудники из Казахстана для вашего отеля',
    lead: 'Кандидаты проверены, у каждого — фото и видеопрезентация. Переводчик на собеседовании и документы — на стороне Open Consulting.',
    field: 'Кого ищете',
    other: 'Вы ищете работу?',
    otherAction: 'Ищу работу',
  },
};

export function Guide({ role, onRoleChange }: DirectionProps) {
  const openNext = useNextStep();
  const c = copy[role];
  const photo = localPhotos.reception;

  const [draft, setDraft] = useState('');
  const [region, setRegion] = useState<Region>('Вся Турция');
  const [results, setResults] = useState<Vacancy[] | null>(null);

  useEffect(() => setResults(null), [role]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (role === 'hotel') {
      openNext({
        ...flows.hotelSignup,
        text: 'Анкеты кандидатов видят только проверенные отели — по профессиям своих вакансий. Эта версия главной не собирает данные.',
      });
      return;
    }
    setResults(searchVacancies(draft, region));
  };

  const signup = () => openNext(role === 'hotel' ? flows.hotelSignup : flows.candidateSignup);

  return (
    <div className="gd">
      <header className="gd-head">
        <div className="gd-wrap gd-head__bar">
          <a href="#top" className="gd-head__brand" aria-label="Open Consulting — на главную">
            <Logo className="gd-head__logo" />
          </a>
          <nav className="gd-head__nav" aria-label="Основное меню">
            <ul>
              {primaryNav.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={() => item.role && onRoleChange(item.role)}
                    aria-current={item.role === role ? 'true' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="gd-head__actions">
            <button type="button" className="gd-head__lang" onClick={() => openNext(flows.language)}>
              Рус
            </button>
            <button type="button" className="gd-head__login" onClick={() => openNext(flows.login)}>
              Войти
            </button>
            <button type="button" className="gd-btn gd-btn--red gd-head__signup" onClick={signup}>
              Регистрация
            </button>
            <MenuSheet role={role} onRoleChange={onRoleChange} className="gd-head__menu" />
          </div>
        </div>
      </header>

      <main id="top">
        <section className="gd-hero" aria-labelledby="gd-title">
          <div className="gd-wrap gd-hero__grid">
            <div className="gd-hero__text">
              <h1 id="gd-title" className="gd-hero__title">{typo(c.title)}</h1>
              <p className="gd-hero__lead">{typo(c.lead)}</p>

              <form className="gd-search" role="search" onSubmit={submit}>
                <label className="gd-search__role">
                  <span className="visually-hidden">Кто вы</span>
                  <select value={role} onChange={(e) => onRoleChange(e.target.value as Role)}>
                    <option value="candidate">Ищу работу</option>
                    <option value="hotel">Ищу сотрудников</option>
                  </select>
                  <ChevronDown size={18} aria-hidden="true" />
                </label>
                <label className="gd-search__field">
                  <span className="visually-hidden">{c.field}</span>
                  <input
                    type="search"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={role === 'hotel' ? 'Кого ищете' : 'Профессия'}
                    autoComplete="off"
                  />
                </label>
                <label className="gd-search__region">
                  <span className="visually-hidden">{role === 'hotel' ? 'Где ваш отель' : 'Регион Турции'}</span>
                  <select value={region} onChange={(e) => setRegion(e.target.value as Region)}>
                    {regions.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                  <ChevronDown size={18} aria-hidden="true" />
                </label>
                <button type="submit" className="gd-btn gd-btn--red gd-search__submit">
                  <Search size={20} aria-hidden="true" />
                  Найти
                </button>
              </form>

              <p className="gd-hero__other">
                {c.other}{' '}
                <button type="button" onClick={() => onRoleChange(role === 'hotel' ? 'candidate' : 'hotel')}>
                  {c.otherAction}
                </button>
              </p>

              <div aria-live="polite">
                {results && <SearchResults results={results} query={draft} onSignup={signup} onOpen={() => openNext(flows.vacancy)} />}
              </div>
            </div>
            <figure className="gd-hero__photo">
              <img src={photo.src} srcSet={photo.srcSet} sizes="(min-width: 1024px) 45vw, 100vw" alt={photo.alt} />
              <figcaption>
                Фото: <a href={photo.page} target="_blank" rel="noreferrer">{photo.author}, {photo.site}</a>
              </figcaption>
            </figure>
          </div>
        </section>

        <Needs role={role} />
        <Route role={role} onRoleChange={onRoleChange} />

        <section className="gd-section gd-faq" aria-labelledby="gd-faq-title">
          <div className="gd-wrap gd-section__grid">
            <h2 id="gd-faq-title" className="gd-h2">Частые вопросы</h2>
            <Accordion.Root type="single" collapsible className="gd-faq__list" defaultValue="0">
              {faq.map((item, i) => (
                <Accordion.Item key={item.q} value={String(i)} className="gd-faq__item">
                  <Accordion.Header asChild>
                    <h3>
                      <Accordion.Trigger className="gd-faq__q">
                        {item.q}
                        <ChevronDown size={22} aria-hidden="true" />
                      </Accordion.Trigger>
                    </h3>
                  </Accordion.Header>
                  <Accordion.Content className="gd-faq__a">
                    <p>{typo(item.a)}</p>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
        </section>

        <section className="gd-section" id="news" aria-labelledby="gd-news-title">
          <div className="gd-wrap gd-section__grid">
            <h2 id="gd-news-title" className="gd-h2">Новости</h2>
            <div className="gd-news">
              <ul className="gd-news__list">
                {demoNews.map((n) => (
                  <li key={n.id}>
                    <p className="gd-news__meta">
                      <time dateTime={n.date}>{formatDate(n.date)}</time> · {n.rubric}
                      {n.pinned && <> · закреплено</>}
                    </p>
                    <h3>
                      <button type="button" onClick={() => openNext(flows.news)}>{typo(n.title)}</button>
                    </h3>
                    <p className="gd-news__lead">{typo(n.lead)}</p>
                  </li>
                ))}
                <li className="gd-news__demo">Пример публикаций. Новости ведёт оператор Open Consulting.</li>
              </ul>
              <aside className="gd-ad" aria-label="Реклама">
                <p className="gd-ad__label">Реклама</p>
                <div className="gd-ad__plate">
                  <Logo className="gd-ad__logo" />
                  <p>{typo('Сопровождение от анкеты до выезда')}</p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="gd-section gd-partners" id="partners" aria-labelledby="gd-partners-title">
          <div className="gd-wrap gd-section__grid">
            <h2 id="gd-partners-title" className="gd-h2">Партнёрам</h2>
            <div>
              <p className="gd-partners__text">
                {typo('Агентства ведут своих кандидатов: свой код и логотип на анкете, участие в собеседованиях и отчёты по выездам. Чужие анкеты партнёру недоступны.')}
              </p>
              <button type="button" className="gd-btn gd-btn--line" onClick={() => openNext(flows.partner)}>
                Стать партнёром
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="gd-foot" id="contacts">
        <div className="gd-wrap gd-foot__grid">
          <div>
            <Logo className="gd-foot__logo" />
            <p>Шымкент, Казахстан. Телефон, почта и реквизиты уточняются.</p>
          </div>
          <ul>
            <li><button type="button" onClick={() => openNext(flows.legal)}>Политика персональных данных</button></li>
            <li><button type="button" onClick={() => openNext(flows.legal)}>Оферта</button></li>
            <li><button type="button" onClick={() => openNext(flows.legal)}>Реквизиты</button></li>
          </ul>
          <p className="gd-foot__note">
            Демонстрационная версия: вакансии и новости — примеры. Фото:{' '}
            <a href={photo.page} target="_blank" rel="noreferrer">{photo.author}, {photo.site}</a> ({photo.license}); люди на фото — не
            сотрудники и не кандидаты платформы.
          </p>
        </div>
      </footer>
    </div>
  );
}

function SearchResults({
  results,
  query,
  onSignup,
  onOpen,
}: {
  results: Vacancy[];
  query: string;
  onSignup: () => void;
  onOpen: () => void;
}) {
  return (
    <section className="gd-results" aria-label="Результаты поиска">
      <p className="gd-results__count">
        <strong>
          {results.length} {plural(results.length, 'вакансия', 'вакансии', 'вакансий')}
        </strong>{' '}
        {query.trim() && <>по запросу «{query.trim()}» </>}— пример
      </p>
      {results.length > 0 ? (
        <ul>
          {results.slice(0, 3).map((v) => (
            <li key={v.id}>
              <button type="button" onClick={onOpen}>{v.profession}</button>
              <span className="num">{formatSalary(v.salary)}</span>
              <span>{v.city}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>В примерах таких вакансий нет. Попробуйте другую профессию или регион.</p>
      )}
      <p className="gd-results__next">
        <strong>Следующий шаг:</strong> {typo('откликнуться можно после публикации анкеты.')}{' '}
        <button type="button" onClick={onSignup}>Создать анкету</button>
      </p>
    </section>
  );
}

function Needs({ role }: { role: Role }) {
  const items = needs[role];
  const [done, setDone] = useState<Set<string>>(new Set());
  useEffect(() => setDone(new Set()), [role]);

  const toggle = (id: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const left = items.length - done.size;

  return (
    <section className="gd-section gd-needs" aria-labelledby="gd-needs-title">
      <div className="gd-wrap gd-section__grid">
        <div>
          <h2 id="gd-needs-title" className="gd-h2">
            {role === 'hotel' ? 'Что понадобится отелю' : 'Что понадобится для анкеты'}
          </h2>
          <p className="gd-needs__status" aria-live="polite">
            {left === 0
              ? 'Всё готово — можно начинать.'
              : `Отметьте, что у вас уже есть. Осталось: ${left}\u00a0из\u00a0${items.length}.`}
          </p>
        </div>
        <div>
          <ul className="gd-needs__list">
            {items.map((item) => (
              <li key={item.id}>
                <label className="gd-needs__item">
                  <input type="checkbox" checked={done.has(item.id)} onChange={() => toggle(item.id)} />
                  <span className="gd-needs__box" aria-hidden="true">
                    <Check size={18} strokeWidth={2.5} />
                  </span>
                  <span className="gd-needs__label">{item.label}</span>
                  {item.note && <span className="gd-needs__note">{item.note}</span>}
                </label>
              </li>
            ))}
          </ul>
          <p className="gd-needs__foot">
            {role === 'hotel'
              ? typo('Проверку компании проводит оператор Open Consulting до публикации вакансий.')
              : typo('Документы для визы понадобятся позже — после выбора отеля. Перечень утверждает Open Consulting.')}
          </p>
        </div>
      </div>
    </section>
  );
}

function Route({ role, onRoleChange }: { role: Role; onRoleChange: (r: Role) => void }) {
  const stages = routes[role];
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    setActive(0);
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const top = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
        const idx = refs.current.indexOf(top.target as HTMLElement);
        if (idx >= 0) setActive(idx);
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [role]);

  const labels = useMemo(() => stages.map((s) => s.title), [stages]);

  return (
    <section className="gd-section gd-route" id="how" aria-labelledby="gd-route-title">
      <div className="gd-wrap">
        <div className="gd-route__head">
          <h2 id="gd-route-title" className="gd-h2">Как проходит отбор</h2>
          <div className="gd-route__tabs" role="group" aria-label="Чей маршрут показать">
            <button type="button" aria-pressed={role === 'candidate'} onClick={() => onRoleChange('candidate')}>
              Кандидату
            </button>
            <button type="button" aria-pressed={role === 'hotel'} onClick={() => onRoleChange('hotel')}>
              Отелю
            </button>
          </div>
        </div>
        <div className="gd-route__grid">
          <nav className="gd-route__rail" aria-label="Шаги">
            <ol>
              {labels.map((label, i) => (
                <li key={label}>
                  <a href={`#${stages[i]!.id}`} aria-current={i === active ? 'step' : undefined}>
                    <span className="num">{i + 1}</span>
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <ol className="gd-route__stages">
            {stages.map((s, i) => (
              <li
                key={s.id}
                id={s.id}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="gd-stage"
              >
                <p className="gd-stage__num num" aria-hidden="true">{i + 1}</p>
                <div>
                  <h3 className="gd-stage__title">{s.title}</h3>
                  <p className="gd-stage__q">{s.question}</p>
                  <dl className="gd-stage__rows">
                    {s.rows.map((r) => (
                      <div key={r.who}>
                        <dt>{r.who}</dt>
                        <dd>{typo(r.does)}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="gd-stage__rule">
                    <strong>Правило.</strong> {typo(s.rule)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
