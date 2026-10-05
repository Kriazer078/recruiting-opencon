import { Check, Clock3, Circle } from 'lucide-react';
import { documentStatusLabel, languageLevels, type DocumentStatus, type LanguageLevel } from '../data/candidates';
import { rules } from '../data/rules';
import { cx } from '../lib/cx';
import './indicators.css';

/** Document traffic light (FR-DOC-01). Shape + colour + text, never colour alone. */
export function StatusMark({ status, tone = 'paper', label }: { status: DocumentStatus; tone?: 'paper' | 'night'; label?: string }) {
  const Icon = status === 'ready' ? Check : status === 'review' ? Clock3 : Circle;
  return (
    <span className={cx('status-mark', `status-mark--${status}`, `status-mark--${tone}`)}>
      <span className="status-mark__icon" aria-hidden="true">
        <Icon size={12} strokeWidth={2.5} />
      </span>
      {label ?? documentStatusLabel[status]}
    </span>
  );
}

/** Four-step language level from TZ 6.1: нет / базовый / рабочий / свободный. */
export function LanguageScale({ name, level }: { name: string; level: LanguageLevel }) {
  const word = languageLevels[level];
  return (
    <div className="lang-scale">
      <span className="lang-scale__name">{name}</span>
      <span className="lang-scale__bar" role="img" aria-label={`${name}: ${word}`}>
        {[1, 2, 3].map((step) => (
          <span key={step} className={cx('lang-scale__seg', step <= level && 'is-on')} />
        ))}
      </span>
      <span className="lang-scale__level">{word}</span>
    </div>
  );
}

/** «Занято N из 3» — approval slots (BR-01). Squares echo the logo's square window. */
export function SlotMeter({ used, tone = 'paper' }: { used: number; tone?: 'paper' | 'night' }) {
  const total = rules.activeApprovals;
  return (
    <div className={cx('slot-meter', `slot-meter--${tone}`)}>
      <span className="slot-meter__cells" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={cx('slot-meter__cell', i < used && 'is-used')} />
        ))}
      </span>
      <span className="slot-meter__text t-num">
        Занято {used} из {total}
      </span>
    </div>
  );
}
