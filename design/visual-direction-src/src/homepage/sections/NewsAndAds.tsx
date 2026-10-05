import { useState } from 'react';
import { ToggleGroup } from 'radix-ui';
import { ArrowRight, Pin } from 'lucide-react';
import { DemoTag } from '../components/Media';
import { flows, useNextStep } from '../components/NextStep';
import { demoNews, formatDate, newsRubrics, type NewsRubric } from '../data/content';
import markUrl from '../assets/brand/mark.png';
import './news.css';

type Filter = 'all' | NewsRubric;

export function NewsAndAds() {
  const openNext = useNextStep();
  const [filter, setFilter] = useState<Filter>('all');
  const items = demoNews.filter((n) => filter === 'all' || n.rubric === filter);

  return (
    <section id="news" className="news" aria-labelledby="news-title">
      <div className="container news__grid">
        <div className="news__main">
          <div className="news__head">
            <h2 id="news-title" className="t-h2">
              Новости
            </h2>
            <DemoTag>Примеры публикаций</DemoTag>
          </div>

          <ToggleGroup.Root
            type="single"
            value={filter}
            onValueChange={(v) => v && setFilter(v as Filter)}
            className="news__filter"
            aria-label="Рубрики"
          >
            <ToggleGroup.Item value="all" className="chip">
              Все
            </ToggleGroup.Item>
            {newsRubrics.map((r) => (
              <ToggleGroup.Item key={r} value={r} className="chip">
                {r}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>

          <ul className="news__list" aria-live="polite">
            {items.map((n) => (
              <li key={n.id} className="news-item">
                <p className="news-item__meta t-label">
                  <time dateTime={n.date} className="t-num">
                    {formatDate(n.date)}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span>{n.rubric}</span>
                  {n.pinned && (
                    <span className="news-item__pin">
                      <Pin size={13} aria-hidden="true" /> Закреплено
                    </span>
                  )}
                </p>
                <h3 className="news-item__title t-h3">
                  <button type="button" onClick={() => openNext(flows.news)}>
                    {n.title}
                    <ArrowRight size={18} aria-hidden="true" />
                  </button>
                </h3>
                <p className="news-item__lead t-small">{n.lead}</p>
              </li>
            ))}
          </ul>
          {items.length === 0 && <p className="t-small t-muted">В этой рубрике пока нет публикаций.</p>}
        </div>

        {/* FR-UI-02: a separate ad zone, never mixed with news. Empty slot shows the neutral Open Consulting plate. */}
        <aside className="ad-slot" aria-label="Реклама">
          <p className="ad-slot__label t-label">Реклама</p>
          <div className="ad-slot__plate">
            <img src={markUrl} alt="" width={64} height={39} />
            <p className="ad-slot__text">
              Open Consulting — подбор персонала из Казахстана для отелей Турции
            </p>
            <a href="#contacts" className="ad-slot__link t-small">
              Разместить рекламу <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
