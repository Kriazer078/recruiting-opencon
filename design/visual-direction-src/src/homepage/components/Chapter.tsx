import type { ReactNode } from 'react';
import { cx } from '../lib/cx';
import { typo } from '../lib/typography';
import './chapter.css';

export const chapters = [
  { id: 'profile', short: 'Анкета' },
  { id: 'vacancies', short: 'Вакансии' },
  { id: 'one-place', short: 'Одно место' },
  { id: 'interview', short: 'Собеседование' },
  { id: 'documents', short: 'Документы' },
] as const;

export type ChapterId = (typeof chapters)[number]['id'];

interface ChapterProps {
  id: ChapterId;
  title: ReactNode;
  lead: ReactNode;
  /** «Кандидату» / «Отелю» notes: every step has two sides */
  sides?: { candidate: ReactNode; hotel: ReactNode };
  layout?: 'side' | 'stacked';
  tone?: 'paper' | 'night';
  children: ReactNode;
  className?: string;
}

/** A step of the hiring path. The homepage is the path itself, in TZ order. */
export function Chapter({ id, title, lead, sides, layout = 'side', tone = 'paper', children, className }: ChapterProps) {
  const index = chapters.findIndex((c) => c.id === id);
  const headingId = `${id}-title`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cx('chapter', `chapter--${layout}`, `chapter--${tone}`, tone === 'night' && 'on-night', className)}
    >
      <div className="container chapter__grid">
        <header className="chapter__head">
          <p className="chapter__step t-label">
            <span className="t-num">Шаг {index + 1}</span>
            <span aria-hidden="true" className="chapter__step-rule" />
            {chapters[index]?.short}
          </p>
          <h2 id={headingId} className="chapter__title t-h2">
            {typeof title === 'string' ? typo(title) : title}
          </h2>
          <p className="chapter__lead t-body-lg">{typeof lead === 'string' ? typo(lead) : lead}</p>
          {sides && (
            <dl className="chapter__sides">
              <div>
                <dt className="t-label">Кандидату</dt>
                <dd className="t-small">{typeof sides.candidate === 'string' ? typo(sides.candidate) : sides.candidate}</dd>
              </div>
              <div>
                <dt className="t-label">Отелю</dt>
                <dd className="t-small">{typeof sides.hotel === 'string' ? typo(sides.hotel) : sides.hotel}</dd>
              </div>
            </dl>
          )}
        </header>
        <div className="chapter__body">{children}</div>
      </div>
    </section>
  );
}
