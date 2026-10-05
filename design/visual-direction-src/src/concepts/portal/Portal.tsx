import { useMemo, useRef, useState, type FormEvent } from 'react';
import { ToggleGroup } from 'radix-ui';
import { ChevronDown, Search, X } from 'lucide-react';
import { Logo } from '../../homepage/components/Logo';
import { primaryNav, demoNews, formatDate, type Role } from '../../homepage/data/content';
import { flows } from '../../homepage/data/flows';
import { rules, range } from '../../homepage/data/rules';
import { formatSalary, professionShortcuts, regions, type Region, type Vacancy } from '../../homepage/data/vacancies';
import { typo } from '../../homepage/lib/typography';
import { localPhotos } from '../shared/photos';
import { MenuSheet } from '../shared/MenuSheet';
import { useNextStep } from '../shared/NextStep';
import { plural, scrollBehavior, searchVacancies, type DirectionProps } from '../shared/directions';
import './portal.css';

/** Hotel departments → professions. Taxonomy for navigation, not a list of open positions. */
const departments: { name: string; professions: string[] }[] = [
  { name: 'Ресторан и бар', professions: ['Официант', 'Бармен'] },
  { name: 'Номерной фонд', professions: ['Горничная'] },
  { name: 'Кухня', professions: ['Повар'] },
  { name: 'Приём гостей', professions: ['Ресепшен'] },
];

const copy: Record<Role, { title: string; lead: string; field: string; submit: string; cta: string }> = {
  candidate: {
    title: 'Работа в отелях Турции',
    lead: 'Вакансии для кандидатов из Казахстана. В каждой указаны зарплата, жильё, питание, график и язык.',
    field: 'Профессия или должность',
    submit: 'Найти',
    cta: 'Создать анкету',
  },
  hotel: {
    title: 'Сотрудники из Казахстана для отелей Турции',
    lead: 'Анкеты с фото и видеопрезентацией, проверенные оператором. Собеседование — с переводчиком.',
    field: 'Кого ищете: профессия',
    submit: 'Найти кандидатов',
    cta: 'Разместить вакансию',
  },
};

export function Portal({ role, onRoleChange }: DirectionProps) {
  const openNext = useNextStep();
  const c = copy[role];
  const photo = localPhotos.cafe;

  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState<Region>('Вся Турция');
  const [housingOnly, setHousingOnly] = useState(false);
  const [noLanguage, setNoLanguage] = useState(false);
  const feedRef = useRef<HTMLElement>(null);

  const results = useMemo(
    () =>
      searchVacancies(query, region).filter(
        (v) => (!housingOnly || v.housing === 'При отеле') && (!noLanguage || v.language === 'Не требуется'),
      ),
    [query, region, housingOnly, noLanguage],
  );

  const toFeed = () => feedRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (role === 'hotel') {
      openNext({
        ...flows.hotelSignup,
        text: 'Анкеты кандидатов видят только проверенные отели — по профессиям своих вакансий. Гость их не видит. Эта версия главной не собирает данные.',
      });
      return;
    }
    setQuery(draft);
    toFeed();
  };

  const pickProfession = (p: string) => {
    setDraft(p);
    if (role === 'candidate') {
      setQuery(p);
    }
  };

  const reset = () => {
    setDraft('');
    setQuery('');
    setRegion('Вся Турция');
    setHousingOnly(false);
    setNoLanguage(false);
  };

  const signup = () => openNext(role === 'hotel' ? flows.hotelSignup : flows.candidateSignup);

  return (
    <div className="pt">
      <header className="pt-head">
        <div className="pt-wrap pt-head__top">
          <a href="#top" className="pt-head__brand" aria-label="Open Consulting — на главную">
            <Logo className="pt-head__logo" />
          </a>
          <ToggleGroup.Root
            type="single"
            value={role}
            onValueChange={(v) => v && onRoleChange(v as Role)}
            className="pt-roles pt-roles--head"
            aria-label="Кто вы"
          >
            <ToggleGroup.Item value="candidate">Ищу работу</ToggleGroup.Item>
            <ToggleGroup.Item value="hotel">Ищу сотрудников</ToggleGroup.Item>
          </ToggleGroup.Root>
          <div className="pt-head__actions">
            <button type="button" className="pt-head__lang" onClick={() => openNext(flows.language)}>
              RU <ChevronDown size={16} aria-hidden="true" />
            </button>
            <button type="button" className="pt-btn pt-btn--soft" onClick={() => openNext(flows.login)}>
              Войти
            </button>
            <button type="button" className="pt-btn pt-btn--ink pt-head__cta" onClick={signup}>
              {c.cta}
            </button>
            <MenuSheet role={role} onRoleChange={onRoleChange} className="pt-head__menu" />
          </div>
        </div>
        <nav className="pt-head__nav" aria-label="Основное меню">
          <ul className="pt-wrap">
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
      </header>

      <div className="pt-wrap pt-roles-bar">
        <ToggleGroup.Root
          type="single"
          value={role}
          onValueChange={(v) => v && onRoleChange(v as Role)}
          className="pt-roles"
          aria-label="Кто вы"
        >
          <ToggleGroup.Item value="candidate">Ищу работу</ToggleGroup.Item>
          <ToggleGroup.Item value="hotel">Ищу сотрудников</ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>

      <main id="top">
        <section className="pt-hero" aria-labelledby="pt-title">
          <img className="pt-hero__img" src={photo.src} srcSet={photo.srcSet} sizes="(min-width: 1376px) 1344px, 100vw" alt={photo.alt} />
          <div className="pt-hero__body">
            <h1 id="pt-title" className="pt-hero__title">{typo(c.title)}</h1>
            <p className="pt-hero__lead">{typo(c.lead)}</p>
            <form className="pt-search" role="search" onSubmit={submit}>
              <label className="pt-search__field">
                <span className="visually-hidden">{c.field}</span>
                <Search size={20} aria-hidden="true" />
                <input
                  type="search"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={c.field}
                  autoComplete="off"
                />
              </label>
              <label className="pt-search__select">
                <span className="visually-hidden">{role === 'hotel' ? 'Где ваш отель' : 'Регион Турции'}</span>
                <select value={region} onChange={(e) => setRegion(e.target.value as Region)}>
                  {regions.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
                <ChevronDown size={18} aria-hidden="true" />
              </label>
              <button type="submit" className="pt-btn pt-btn--red pt-search__submit">
                {c.submit}
              </button>
            </form>
            <div className="pt-hero__quick">
              <span>Часто ищут:</span>
              {professionShortcuts.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={draft === p}
                  onClick={() => pickProfession(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <p className="pt-hero__credit">
            Фото: <a href={photo.page} target="_blank" rel="noreferrer">{photo.author}, {photo.site}</a>
          </p>
        </section>

        <div className="pt-wrap pt-body">
          <aside className="pt-filters" aria-label="Фильтры вакансий">
            <h2 className="pt-h3">Профессии</h2>
            <ul className="pt-filters__deps">
              {departments.map((d) => (
                <li key={d.name}>
                  <p>{d.name}</p>
                  <ul>
                    {d.professions.map((p) => (
                      <li key={p}>
                        <button
                          type="button"
                          aria-pressed={query === p}
                          onClick={() => {
                            const next = query === p ? '' : p;
                            setQuery(next);
                            setDraft(next);
                          }}
                        >
                          {p}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <h2 className="pt-h3 pt-filters__conds">Условия</h2>
            <label className="pt-check">
              <input type="checkbox" checked={housingOnly} onChange={(e) => setHousingOnly(e.target.checked)} />
              Жильё при отеле
            </label>
            <label className="pt-check">
              <input type="checkbox" checked={noLanguage} onChange={(e) => setNoLanguage(e.target.checked)} />
              Без требований к языку
            </label>
          </aside>

          <section className="pt-feed" id="vacancies" ref={feedRef} aria-labelledby="pt-feed-title">
            <div className="pt-feed__head">
              <h2 id="pt-feed-title" className="pt-h2">Вакансии</h2>
              <p className="pt-feed__count" aria-live="polite">
                <span className="pt-tag">Пример</span>
                {results.length} {plural(results.length, 'вакансия', 'вакансии', 'вакансий')}
                {query && <> · «{query}»</>}
                {region !== 'Вся Турция' && <> · {region}</>}
              </p>
              {(query || region !== 'Вся Турция' || housingOnly || noLanguage) && (
                <button type="button" className="pt-feed__reset" onClick={reset}>
                  <X size={16} aria-hidden="true" /> Сбросить
                </button>
              )}
            </div>
            {results.length > 0 ? (
              <ol className="pt-feed__list">
                {results.map((v) => (
                  <VacancyRow key={v.id} v={v} onOpen={() => openNext(flows.vacancy)} />
                ))}
              </ol>
            ) : (
              <div className="pt-empty">
                <p>В примерах нет вакансий по этому запросу.</p>
                <button type="button" className="pt-btn pt-btn--soft" onClick={reset}>
                  Показать все
                </button>
              </div>
            )}
            <p className="pt-feed__note">
              {typo(
                `Откликнуться можно после публикации анкеты. Лента подбирается по ${range(1, 3)} профессиям, выбранным в анкете.`,
              )}{' '}
              <button type="button" className="pt-link" onClick={() => openNext(flows.candidateSignup)}>
                Создать анкету
              </button>
            </p>
          </section>

          <aside className="pt-side">
            <section className="pt-ad" aria-label="Реклама">
              <p className="pt-ad__label">Реклама</p>
              <div className="pt-ad__plate">
                <Logo className="pt-ad__logo" />
                <p>{typo('Работа в отелях Турции с сопровождением документов до выезда')}</p>
              </div>
              <p className="pt-ad__note">Пустой слот: нейтральная плашка Open Consulting</p>
            </section>
            <section className="pt-news" id="news" aria-labelledby="pt-news-title">
              <h2 id="pt-news-title" className="pt-h3">Новости</h2>
              <ul>
                {demoNews.map((n) => (
                  <li key={n.id}>
                    <p className="pt-news__meta">
                      <time dateTime={n.date}>{formatDate(n.date)}</time> · {n.rubric}
                    </p>
                    <button type="button" className="pt-news__title" onClick={() => openNext(flows.news)}>
                      {typo(n.title)}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="pt-news__foot">
                <span className="pt-tag">Пример</span> публикаций
              </p>
            </section>
          </aside>
        </div>

        <section className="pt-wrap pt-rules" id="how" aria-labelledby="pt-rules-title">
          <div className="pt-rules__head">
            <h2 id="pt-rules-title" className="pt-h2">Правила площадки</h2>
            <p>{typo('Одинаковые для всех кандидатов и отелей. Проверяются на стороне платформы.')}</p>
          </div>
          <ol className="pt-rules__list">
            <li>{typo('Анкету видят только проверенные отели — и только после модерации оператором.')}</li>
            <li>
              {typo(
                `В анкете — ${rules.photos.face + rules.photos.fullLength} фото и видеопрезентация ${range(rules.presentation.minSeconds, rules.presentation.maxSeconds)} секунд: ${rules.presentation.questions} вопросов появляются на экране по очереди.`,
              )}
            </li>
            <li>
              {typo(
                `Одновременно можно одобрить до ${rules.activeApprovals} предложений. Каждое действует ${rules.offerLifetimeHours} часа.`,
              )}
            </li>
            <li>
              {typo(
                `Собеседование — онлайн, с переводчиком. Назначается не раньше чем через ${rules.interviewMinLeadHours} часов.`,
              )}
            </li>
            <li>{typo('Окончательно выбрать можно один отель. Остальным предложениям уходит отказ.')}</li>
            <li>{typo('Документы проверяет оператор. Отель видит статус пакета, но не файлы и не номер паспорта.')}</li>
          </ol>
          <p className="pt-rules__foot">
            {typo('Open Consulting не подаёт заявление в e-İzin и не выдаёт визы: разрешение оформляет работодатель, визу — консульство.')}
          </p>
        </section>

        <section className="pt-wrap pt-employers" aria-labelledby="pt-emp-title">
          <h2 id="pt-emp-title" className="pt-h2">Работодателям</h2>
          <dl className="pt-employers__list">
            <div>
              <dt>Проверка компании</dt>
              <dd>{typo('Оператор подтверждает отель до публикации вакансий. Первая вакансия проходит модерацию.')}</dd>
            </div>
            <div>
              <dt>Анкеты по вашим профессиям</dt>
              <dd>{typo('Опыт, языки, четыре фото, видеопрезентация и статус документов.')}</dd>
            </div>
            <div>
              <dt>Одно место</dt>
              <dd>{typo('Подтвердивший вас кандидат не может держать второе место.')}</dd>
            </div>
          </dl>
          <div className="pt-employers__actions">
            <button type="button" className="pt-btn pt-btn--red" onClick={() => openNext(flows.hotelSignup)}>
              Разместить вакансию
            </button>
            <p id="partners">
              {typo('Агентствам: свой код и логотип на анкетах ваших кандидатов.')}{' '}
              <button type="button" className="pt-link" onClick={() => openNext(flows.partner)}>
                Стать партнёром
              </button>
            </p>
          </div>
        </section>
      </main>

      <PortalFooter onRoleChange={onRoleChange} />
    </div>
  );
}

function VacancyRow({ v, onOpen }: { v: Vacancy; onOpen: () => void }) {
  return (
    <li className="pt-vac">
      <div className="pt-vac__main">
        <h3 className="pt-vac__title">
          <button type="button" onClick={onOpen}>{v.profession}</button>
        </h3>
        <p className="pt-vac__salary num">
          {formatSalary(v.salary)} <span>в месяц</span>
        </p>
        <p className="pt-vac__where">
          {v.hotel} · {v.city === v.region ? v.city : `${v.city}, ${v.region}`}
        </p>
        <dl className="pt-vac__terms">
          <div><dt>Жильё</dt><dd>{v.housing}</dd></div>
          <div><dt>Питание</dt><dd>{v.meals}</dd></div>
          <div><dt>График</dt><dd>{v.schedule}</dd></div>
          <div><dt>Язык</dt><dd>{v.language}</dd></div>
        </dl>
        <p className="pt-vac__meta">
          {v.places} {plural(v.places, 'место', 'места', 'мест')} · {v.season}
        </p>
      </div>
      <button type="button" className="pt-btn pt-btn--line pt-vac__apply" onClick={onOpen}>
        Откликнуться
      </button>
    </li>
  );
}

function PortalFooter({ onRoleChange }: { onRoleChange: (r: Role) => void }) {
  const openNext = useNextStep();
  const photo = localPhotos.cafe;
  return (
    <footer className="pt-foot" id="contacts">
      <div className="pt-wrap pt-foot__cols">
        <div>
          <h2>Кандидатам</h2>
          <ul>
            <li><a href="#vacancies" onClick={() => onRoleChange('candidate')}>Вакансии</a></li>
            <li><button type="button" onClick={() => openNext(flows.candidateSignup)}>Создать анкету</button></li>
            <li><a href="#how">Правила площадки</a></li>
          </ul>
        </div>
        <div>
          <h2>Работодателям</h2>
          <ul>
            <li><button type="button" onClick={() => openNext(flows.hotelSignup)}>Регистрация отеля</button></li>
            <li><button type="button" onClick={() => openNext(flows.hotelSignup)}>Разместить вакансию</button></li>
          </ul>
        </div>
        <div>
          <h2>Партнёрам</h2>
          <ul>
            <li><button type="button" onClick={() => openNext(flows.partner)}>Стать партнёром</button></li>
            <li><a href="#news">Новости</a></li>
          </ul>
        </div>
        <div>
          <h2>Контакты</h2>
          <ul>
            <li>Шымкент, Казахстан</li>
            <li>Телефон и почта — уточняются</li>
            <li>Реквизиты — уточняются</li>
          </ul>
        </div>
        <div>
          <h2>Документы</h2>
          <ul>
            <li><button type="button" onClick={() => openNext(flows.legal)}>Политика персональных данных</button></li>
            <li><button type="button" onClick={() => openNext(flows.legal)}>Оферта</button></li>
          </ul>
        </div>
      </div>
      <div className="pt-wrap pt-foot__base">
        <p>© Open Consulting. Демонстрационная версия: вакансии и новости — примеры.</p>
        <p>
          Фото: <a href={photo.page} target="_blank" rel="noreferrer">{photo.author}, {photo.site}</a> ({photo.license}).
          Люди на фото — не кандидаты платформы.
        </p>
      </div>
    </footer>
  );
}
