import { useRef, useState, type FormEvent } from 'react';
import { ToggleGroup } from 'radix-ui';
import { ArrowLeft, ArrowRight, ChevronDown, Search } from 'lucide-react';
import { Logo } from '../../homepage/components/Logo';
import { primaryNav, demoNews, formatDate, type Role } from '../../homepage/data/content';
import { flows } from '../../homepage/data/flows';
import { presentationQuestions } from '../../homepage/data/questions';
import { range, rules } from '../../homepage/data/rules';
import { formatSalary, regions, vacancies, type Region } from '../../homepage/data/vacancies';
import { typo } from '../../homepage/lib/typography';
import { cdnPhoto, credits, localPhotos } from '../shared/photos';
import { MenuSheet } from '../shared/MenuSheet';
import { useNextStep } from '../shared/NextStep';
import { plural, scrollBehavior, searchVacancies, type DirectionProps } from '../shared/directions';
import './scenes.css';

interface Scene {
  id: string;
  name: string;
  /** vacancy category it links to */
  category: string;
  work: string;
  img: { src: string; srcSet: string; alt: string; focal: string };
}

const service = localPhotos.service;
const cafe = localPhotos.cafe;
const reception = localPhotos.reception;
const housekeeper = cdnPhoto('housekeeperSheets');
const cook = cdnPhoto('cookPortrait');
const waiter = cdnPhoto('waiterCoffee');

const scenes: Scene[] = [
  {
    id: 'reception',
    name: 'Ресепшен',
    category: 'Ресепшен',
    work: 'Встречает гостей, ведёт заезд и выезд, отвечает на звонки.',
    img: { src: reception.src, srcSet: reception.srcSet, alt: reception.alt, focal: '72% 40%' },
  },
  {
    id: 'waiter',
    name: 'Официант',
    category: 'Официант',
    work: 'Обслуживает гостей в ресторане à la carte и на завтраке.',
    img: { ...waiter, focal: waiter.focal },
  },
  {
    id: 'housekeeper',
    name: 'Горничная',
    category: 'Горничная',
    work: 'Готовит номера к заезду: бельё, уборка, мини-бар.',
    img: { ...housekeeper, focal: housekeeper.focal },
  },
  {
    id: 'cook',
    name: 'Повар',
    category: 'Повар',
    work: 'Работает в горячем цехе или на линии раздачи.',
    img: { ...cook, focal: cook.focal },
  },
  {
    id: 'bar',
    name: 'Бармен',
    category: 'Бармен',
    work: 'Работает за стойкой лобби-бара: напитки, касса, гости.',
    img: { src: cafe.src, srcSet: cafe.srcSet, alt: cafe.alt, focal: '50% 30%' },
  },
];

function sceneFacts(category: string) {
  const list = vacancies.filter((v) => v.category === category);
  const first = list[0];
  if (!first) return null;
  return `${formatSalary(first.salary)} · жильё: ${first.housing.toLowerCase()} · ${first.city}`;
}

const copy: Record<Role, { title: string; sub: string; field: string; submit: string }> = {
  candidate: {
    title: 'Работа в отелях Турции',
    sub: `Для кандидатов из Казахстана. Покажите себя за ${rules.presentation.targetSeconds} секунд — отель увидит вас до собеседования.`,
    field: 'Профессия',
    submit: 'Найти работу',
  },
  hotel: {
    title: 'Сотрудники из Казахстана',
    sub: 'Для отелей Турции. Смотрите на кандидата до собеседования: фото, видео, опыт и языки.',
    field: 'Кого ищете',
    submit: 'Найти сотрудников',
  },
};

export function Scenes({ role, onRoleChange }: DirectionProps) {
  const openNext = useNextStep();
  const c = copy[role];

  const [draft, setDraft] = useState('');
  const [region, setRegion] = useState<Region>('Вся Турция');
  const [picked, setPicked] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const stripRef = useRef<HTMLOListElement>(null);
  const scenesRef = useRef<HTMLElement>(null);

  const scrollToScene = (id: string) => {
    const el = stripRef.current?.querySelector<HTMLElement>(`[data-scene="${id}"]`);
    el?.scrollIntoView({ behavior: scrollBehavior(), inline: 'start', block: 'nearest' });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (role === 'hotel') {
      openNext({
        ...flows.hotelSignup,
        text: 'Анкеты кандидатов видят только проверенные отели — по профессиям своих вакансий. Эта версия главной не собирает данные.',
      });
      return;
    }
    const found = searchVacancies(draft, region);
    const scene = scenes.find((s) => found.some((v) => v.category === s.category));
    setPicked(scene?.id ?? null);
    setStatus(
      found.length > 0
        ? `${found.length} ${plural(found.length, 'вакансия', 'вакансии', 'вакансий')} в примерах${draft.trim() ? ` по запросу «${draft.trim()}»` : ''}.`
        : 'В примерах таких вакансий нет. Посмотрите, кем можно работать.',
    );
    scenesRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    if (scene) window.setTimeout(() => scrollToScene(scene.id), 350);
  };

  const step = (dir: 1 | -1) => {
    const strip = stripRef.current;
    if (!strip) return;
    const card = strip.querySelector<HTMLElement>('li');
    strip.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 16), behavior: scrollBehavior() });
  };

  const signup = () => openNext(role === 'hotel' ? flows.hotelSignup : flows.candidateSignup);

  return (
    <div className="sc">
      <header className="sc-head">
        <div className="sc-wrap sc-head__bar">
          <a href="#top" className="sc-head__brand" aria-label="Open Consulting — на главную">
            <Logo tone="dark" className="sc-head__logo" />
          </a>
          <ToggleGroup.Root
            type="single"
            value={role}
            onValueChange={(v) => v && onRoleChange(v as Role)}
            className="sc-roles"
            aria-label="Кто вы"
          >
            <ToggleGroup.Item value="candidate">Ищу работу</ToggleGroup.Item>
            <ToggleGroup.Item value="hotel">Ищу сотрудников</ToggleGroup.Item>
          </ToggleGroup.Root>
          <nav className="sc-head__nav" aria-label="Основное меню">
            <ul>
              {primaryNav
                .filter((item) => !item.role)
                .map((item) => (
                  <li key={item.label}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
            </ul>
          </nav>
          <div className="sc-head__actions">
            <button type="button" className="sc-head__plain" onClick={() => openNext(flows.language)}>
              RU
            </button>
            <button type="button" className="sc-head__plain" onClick={() => openNext(flows.login)}>
              Войти
            </button>
            <button type="button" className="sc-btn sc-btn--red sc-head__signup" onClick={signup}>
              Регистрация
            </button>
            <MenuSheet role={role} onRoleChange={onRoleChange} className="sc-head__menu" />
          </div>
        </div>
      </header>

      <main id="top">
        <section className="sc-hero" aria-labelledby="sc-title">
          <div className="sc-hero__frame">
            <img
              src={service.src}
              srcSet={service.srcSet}
              sizes="100vw"
              alt={service.alt}
              className="sc-hero__img"
            />
            <p className="sc-hero__credit">
              Фото: <a href={service.page} target="_blank" rel="noreferrer">{service.author}, {service.site}</a>
            </p>
          </div>
          <div className="sc-hero__band">
            <div className="sc-wrap">
              <div className="sc-roles-bar">
                <ToggleGroup.Root
                  type="single"
                  value={role}
                  onValueChange={(v) => v && onRoleChange(v as Role)}
                  className="sc-roles"
                  aria-label="Кто вы"
                >
                  <ToggleGroup.Item value="candidate">Ищу работу</ToggleGroup.Item>
                  <ToggleGroup.Item value="hotel">Ищу сотрудников</ToggleGroup.Item>
                </ToggleGroup.Root>
              </div>
              <h1 id="sc-title" className="sc-hero__title">{typo(c.title)}</h1>
              <div className="sc-hero__row">
                <p className="sc-hero__sub">{typo(c.sub)}</p>
                <form className="sc-search" role="search" onSubmit={submit}>
                  <label className="sc-search__field">
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
                  <label className="sc-search__select">
                    <span className="visually-hidden">{role === 'hotel' ? 'Где ваш отель' : 'Регион Турции'}</span>
                    <select value={region} onChange={(e) => setRegion(e.target.value as Region)}>
                      {regions.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} aria-hidden="true" />
                  </label>
                  <button type="submit" className="sc-btn sc-btn--red sc-search__submit">
                    {c.submit}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="sc-scenes" id="vacancies" ref={scenesRef} aria-labelledby="sc-scenes-title">
          <div className="sc-wrap sc-scenes__head">
            <div>
              <h2 id="sc-scenes-title" className="sc-h2">Кем можно работать</h2>
              <p className="sc-scenes__status" aria-live="polite">
                {status || 'Пять профессий отеля. Условия — из примеров вакансий.'}
              </p>
            </div>
            <div className="sc-scenes__nav">
              <button type="button" onClick={() => step(-1)} aria-label="Предыдущие профессии">
                <ArrowLeft size={22} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Следующие профессии">
                <ArrowRight size={22} aria-hidden="true" />
              </button>
            </div>
          </div>
          <ol className="sc-strip" ref={stripRef}>
            {scenes.map((s) => {
              const facts = sceneFacts(s.category);
              return (
                <li key={s.id} data-scene={s.id} className="sc-scene" aria-current={picked === s.id ? 'true' : undefined}>
                  <img
                    src={s.img.src}
                    srcSet={s.img.srcSet}
                    sizes="(min-width: 768px) 360px, 78vw"
                    alt={s.img.alt}
                    loading="lazy"
                    style={{ objectPosition: s.img.focal }}
                  />
                  <div className="sc-scene__caption">
                    <h3>{s.name}</h3>
                    <p className="sc-scene__work">{typo(s.work)}</p>
                    {facts && (
                      <p className="sc-scene__facts num">
                        <span className="sc-tag">Пример</span> {facts}
                      </p>
                    )}
                    <button type="button" className="sc-scene__more" onClick={() => openNext(flows.vacancy)}>
                      Вакансии: {s.name.toLowerCase()} <ArrowRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <Presentation role={role} onSignup={signup} />

        <section className="sc-hotels" aria-labelledby="sc-hotels-title">
          <div className="sc-wrap sc-hotels__grid">
            <h2 id="sc-hotels-title" className="sc-h2 sc-hotels__title">
              {typo('Выбранный кандидат держит только одно место')}
            </h2>
            <div className="sc-hotels__text">
              <p>
                {typo(
                  `Кандидат может одобрить до ${rules.activeApprovals} предложений, чтобы пройти собеседования, но окончательно выбирает один отель. Второе место система не подтвердит, остальным отелям уходит отказ.`,
                )}
              </p>
              <p className="sc-hotels__time">
                <span className="sc-hotels__time-label">Пример времени собеседования</span>
                <span>
                  <strong className="num">14:00</strong> {rules.timezones.kazakhstan.city}, UTC+{rules.timezones.kazakhstan.utcOffset}
                </span>
                <span>
                  <strong className="num">12:00</strong> {rules.timezones.turkey.city}, UTC+{rules.timezones.turkey.utcOffset}
                </span>
              </p>
              <p className="sc-hotels__note">
                {typo(
                  `Собеседование — в комнате платформы, с переводчиком Open Consulting. Назначается не раньше чем через ${rules.interviewMinLeadHours} часов; время показано для обеих стран.`,
                )}
              </p>
              <button type="button" className="sc-btn sc-btn--red" onClick={() => openNext(flows.hotelSignup)}>
                Разместить вакансию
              </button>
            </div>
          </div>
        </section>

        <section className="sc-news" id="news" aria-labelledby="sc-news-title">
          <div className="sc-wrap sc-news__grid">
            <div>
              <h2 id="sc-news-title" className="sc-h2 sc-h2--ink">Новости</h2>
              <ul className="sc-news__list">
                {demoNews.map((n) => (
                  <li key={n.id}>
                    <p className="sc-news__meta">
                      <time dateTime={n.date}>{formatDate(n.date)}</time> · {n.rubric}
                    </p>
                    <button type="button" onClick={() => openNext(flows.news)}>{typo(n.title)}</button>
                  </li>
                ))}
              </ul>
              <p className="sc-news__demo">
                <span className="sc-tag sc-tag--ink">Пример</span> публикаций. Новости ведёт оператор Open Consulting.
              </p>
            </div>
            <aside className="sc-ad" aria-label="Реклама">
              <p className="sc-ad__label">Реклама</p>
              <div className="sc-ad__plate">
                <Logo className="sc-ad__logo" />
                <p>{typo('Работа в отелях Турции — от анкеты до выезда')}</p>
              </div>
            </aside>
          </div>
        </section>

        <section className="sc-partners" id="partners" aria-label="Партнёрам">
          <div className="sc-wrap sc-partners__row">
            <p>{typo('Агентствам: свой код и логотип на анкетах ваших кандидатов, участие в собеседованиях и отчёты по выездам.')}</p>
            <button type="button" className="sc-btn sc-btn--line" onClick={() => openNext(flows.partner)}>
              Стать партнёром
            </button>
          </div>
        </section>
      </main>

      <footer className="sc-foot" id="contacts">
        <div className="sc-wrap sc-foot__grid">
          <Logo tone="dark" className="sc-foot__logo" />
          <p>Шымкент, Казахстан. Телефон, почта и реквизиты уточняются.</p>
          <ul>
            <li><button type="button" onClick={() => openNext(flows.legal)}>Политика персональных данных</button></li>
            <li><button type="button" onClick={() => openNext(flows.legal)}>Оферта</button></li>
          </ul>
          <p className="sc-foot__credits">
            Демонстрационная версия. Фото:{' '}
            {credits(['service', 'reception', 'cafe'], ['housekeeperSheets', 'cookPortrait', 'waiterCoffee']).map((cr, i, all) => (
              <span key={cr.author}>
                <a href={cr.page} target="_blank" rel="noreferrer">{cr.author}</a>, {cr.site}
                {i < all.length - 1 ? '; ' : '. '}
              </span>
            ))}
            Люди на фото — не кандидаты и не сотрудники платформы.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Presentation({ role, onSignup }: { role: Role; onSignup: () => void }) {
  const [q, setQ] = useState(1);
  const question = presentationQuestions[q]!;
  const total = presentationQuestions.length;
  const p = rules.presentation;

  return (
    <section className="sc-pres" aria-labelledby="sc-pres-title">
      <div className="sc-wrap sc-pres__grid">
        <figure className="sc-pres__frame">
          <img src={cafe.src} srcSet={cafe.srcSet} sizes="(min-width: 1024px) 560px, 100vw" alt={cafe.alt} loading="lazy" />
          <span className="sc-pres__demo">Пример кадра</span>
          <figcaption className="sc-pres__sub" aria-live="polite">
            <span className="sc-pres__count num">
              Вопрос {q + 1} из {total}
            </span>
            <span className="sc-pres__text">{question.text}</span>
          </figcaption>
          <div className="sc-pres__progress" aria-hidden="true">
            {presentationQuestions.map((item, i) => (
              <span key={item.topic} className={i <= q ? 'is-done' : undefined} />
            ))}
          </div>
        </figure>
        <div className="sc-pres__text-col">
          <h2 id="sc-pres-title" className="sc-h2 sc-h2--ink">
            {role === 'hotel' ? 'Вы увидите человека до собеседования' : `Покажите себя за ${p.targetSeconds} секунд`}
          </h2>
          <p className="sc-pres__lead">
            {typo(
              role === 'hotel'
                ? `В каждой анкете — видеопрезентация ${range(p.minSeconds, p.maxSeconds)} секунд и четыре фото. Вопросы одинаковые для всех кандидатов, их задаёт оператор.`
                : `Одна запись ${range(p.minSeconds, p.maxSeconds)} секунд. Вопросы появляются внизу экрана по очереди — читать с бумажки не нужно.`,
            )}
          </p>
          <ol className="sc-pres__questions">
            {presentationQuestions.map((item, i) => (
              <li key={item.topic}>
                <button type="button" aria-pressed={i === q} onClick={() => setQ(i)}>
                  <span className="num">{i + 1}</span>
                  {item.topic}
                </button>
              </li>
            ))}
          </ol>
          <p className="sc-pres__note">Формулировки вопросов — пример; итоговые утверждает Open Consulting.</p>
          <div className="sc-pres__photos" aria-label="Четыре фото в анкете">
            {['Лицо', 'В рост', 'В рост', 'В рост'].map((label, i) => (
              <span key={i} className={i === 0 ? 'is-face' : undefined}>
                {label}
              </span>
            ))}
          </div>
          {role === 'candidate' && (
            <button type="button" className="sc-btn sc-btn--ink" onClick={onSignup}>
              Создать анкету
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
