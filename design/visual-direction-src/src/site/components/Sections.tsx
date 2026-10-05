import { Accordion } from 'radix-ui';
import { ArrowRight, Check, ChevronDown, ChevronRight, Pin } from 'lucide-react';
import { Logo } from '../../homepage/components/Logo';
import { demoNews, formatDate } from '../../homepage/data/content';
import { flows } from '../../homepage/data/flows';
import { typo } from '../../homepage/lib/typography';
import { candidateSteps, faq, hotelPoints } from '../data/site';
import { countIn, formatNumber, minSalaryFor, plural, professions, regions, type Region } from '../data/vacancies';
import { useNextStep } from './NextStep';
import './sections.css';

export function Browse({ onPick }: { onPick: (query: string, region: Region | 'all') => void }) {
  return (
    <section className="section section--tint" aria-labelledby="browse-title">
      <div className="wrap browse">
        <div>
          <h2 id="browse-title" className="h2">Работа по профессиям</h2>
          <ul className="browse__prof">
            {professions.map((p) => {
              const min = minSalaryFor(p);
              return (
                <li key={p}>
                  <a href="#vacancies" onClick={() => onPick(p, 'all')}>
                    <span className="browse__name">{p}</span>
                    {min && <span className="browse__sal num">от {formatNumber(min)} ₺</span>}
                    <ChevronRight size={18} strokeWidth={1.75} aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h2 className="h2">Регионы Турции</h2>
          <ul className="browse__reg">
            {regions.map((r) => {
              const n = countIn(r);
              return (
                <li key={r}>
                  <a href="#vacancies" onClick={() => onPick('', r)}>
                    <span className="browse__name">{r}</span>
                    <span className="browse__count num">
                      {n} {plural(n, 'вакансия', 'вакансии', 'вакансий')}
                    </span>
                    <ChevronRight size={18} strokeWidth={1.75} aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
          <p className="browse__note">Зарплаты и количество — по примерам вакансий.</p>
        </div>
      </div>
    </section>
  );
}

export function How() {
  const openNext = useNextStep();
  return (
    <section id="how" className="section how" aria-labelledby="how-title">
      <div className="wrap">
        <div className="section__head">
          <div>
            <h2 id="how-title" className="h2">Как устроен найм</h2>
            <p className="lead how__lead">От анкеты до выезда — пять шагов. На каждом видно, что делать дальше.</p>
          </div>
          <button type="button" className="btn btn--red btn--lg how__cta" onClick={() => openNext(flows.candidateSignup)}>
            Создать анкету
          </button>
        </div>
        <ol className="how__steps">
          {candidateSteps.map((s, i) => (
            <li key={s.title}>
              <span className="how__num num" aria-hidden="true">{i + 1}</span>
              <h3 className="h3">{s.title}</h3>
              <p>{typo(s.text)}</p>
            </li>
          ))}
        </ol>
        <button type="button" className="btn btn--red btn--lg how__cta-after" onClick={() => openNext(flows.candidateSignup)}>
          Создать анкету
        </button>
        <p className="how__bound">
          {typo('Open Consulting не подаёт заявление в e-İzin и не выдаёт визы: разрешение на работу оформляет работодатель, визу — консульство.')}
        </p>
      </div>
    </section>
  );
}

export function Employers() {
  const openNext = useNextStep();
  return (
    <section id="employers" className="section" aria-labelledby="emp-title">
      <div className="wrap">
        <div className="emp">
          <div className="emp__main">
            <h2 id="emp-title" className="emp__title">Отелям Турции — сотрудники из Казахстана</h2>
            <p className="emp__lead">
              {typo('Компания проходит проверку, первая вакансия — модерацию. Дальше вы видите анкеты по своим профессиям и приглашаете на собеседование.')}
            </p>
            <div className="emp__actions">
              <button type="button" className="btn btn--red btn--lg" onClick={() => openNext(flows.hotelSignup)}>
                Разместить вакансию
              </button>
              <button type="button" className="btn btn--lg emp__ghost" onClick={() => openNext(flows.hotelSignup)}>
                Условия для отелей <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
          <ul className="emp__points">
            {hotelPoints.map((p) => (
              <li key={p.title}>
                <Check size={20} strokeWidth={2.25} aria-hidden="true" />
                <div>
                  <h3>{p.title}</h3>
                  <p>{typo(p.text)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function NewsAds() {
  const openNext = useNextStep();
  return (
    <section id="news" className="section section--tint" aria-labelledby="news-title">
      <div className="wrap">
        <div className="section__head">
          <h2 id="news-title" className="h2">Новости и полезное</h2>
          <a className="more-link" href="#news" onClick={() => openNext(flows.news)}>
            Все новости <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="news">
          <ul className="news__list">
            {demoNews.slice(0, 3).map((n) => (
              <li key={n.id}>
                <article className="ncard">
                  <p className="ncard__meta">
                    <span className="ncard__rubric">{n.rubric}</span>
                    <time dateTime={n.date}>{formatDate(n.date)}</time>
                    {n.pinned && (
                      <span className="ncard__pin"><Pin size={14} aria-hidden="true" /> Закреплено</span>
                    )}
                  </p>
                  <h3 className="ncard__title">
                    <button type="button" onClick={() => openNext(flows.news)}>{typo(n.title)}</button>
                  </h3>
                  <p className="ncard__lead">{typo(n.lead)}</p>
                  <span className="tag-demo">Пример</span>
                </article>
              </li>
            ))}
          </ul>
          <aside className="ad" aria-label="Реклама">
            <p className="ad__label">Реклама</p>
            <div className="ad__plate">
              <Logo className="ad__logo" />
              <p>{typo('Работа в отелях Турции с сопровождением документов')}</p>
              <span>Место для баннера партнёра</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className="section" aria-labelledby="faq-title">
      <div className="wrap faq">
        <div>
          <h2 id="faq-title" className="h2">Вопросы и ответы</h2>
          <p className="lead faq__lead">Коротко о главном для кандидатов. Подробные правила — в разделе «Как это работает».</p>
        </div>
        <Accordion.Root type="single" collapsible defaultValue="0" className="faq__list">
          {faq.map((f, i) => (
            <Accordion.Item key={f.q} value={String(i)} className="faq__item">
              <Accordion.Header asChild>
                <h3>
                  <Accordion.Trigger className="faq__q">
                    {f.q}
                    <ChevronDown size={20} strokeWidth={1.75} aria-hidden="true" />
                  </Accordion.Trigger>
                </h3>
              </Accordion.Header>
              <Accordion.Content className="faq__a">
                <p>{typo(f.a)}</p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}

export function Partners() {
  const openNext = useNextStep();
  return (
    <section id="partners" className="partners" aria-labelledby="partners-title">
      <div className="wrap">
        <div className="partners__row">
          <div>
            <h2 id="partners-title" className="h3">Агентствам и партнёрам</h2>
            <p>{typo('Свой код и логотип на анкетах ваших кандидатов, участие в собеседованиях и отчёты по выездам.')}</p>
          </div>
          <button type="button" className="btn btn--line btn--lg" onClick={() => openNext(flows.partner)}>
            Стать партнёром
          </button>
        </div>
      </div>
    </section>
  );
}
