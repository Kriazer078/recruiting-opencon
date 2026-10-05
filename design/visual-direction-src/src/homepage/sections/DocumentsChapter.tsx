import { Check } from 'lucide-react';
import { Chapter } from '../components/Chapter';
import { DemoTag } from '../components/Media';
import { StatusMark } from '../components/Indicators';
import { demoDocuments, visaTrack, visaTrackAvailability } from '../data/process';
import { availabilityNote, rules } from '../data/rules';
import { cx } from '../lib/cx';
import './documents.css';

const CURRENT_STEP = 1; // demo: package verified, apostille in progress

const responsibilities = [
  {
    who: 'Работодатель',
    does: 'Подаёт заявление на разрешение на работу в e-İzin и завершает его после референс-номера кандидата.',
  },
  {
    who: 'Open Consulting',
    does: 'Проверяет документы, ведёт статусы и сроки, напоминает о следующем шаге до выезда.',
  },
  {
    who: 'Чего мы не делаем',
    does: 'Не подаём заявления в e-İzin, не выдаём визы, не оказываем апостиль как услугу и не гарантируем трудоустройство.',
    limit: true,
  },
] as { who: string; does: string; limit?: boolean }[];

export function DocumentsChapter() {
  return (
    <Chapter
      id="documents"
      title="Документы и путь до въезда"
      lead="Пакет не теряется: у каждого документа есть статус и срок, а после выбора места — понятный следующий шаг до въезда."
      sides={{
        candidate: `Напомним за ${rules.documentReminderDays} дней, если справка скоро истечёт. Свои файлы видите только вы и оператор.`,
        hotel: 'Статус пакета кандидата — сразу. Номер паспорта и файлы справок отелю не показываются.',
      }}
    >
      <div className="docs">
        <section className="docs__block" aria-labelledby="docs-check-title">
          <div className="docs__head">
            <h3 id="docs-check-title" className="t-h3">
              Чек-лист кандидата
            </h3>
            <DemoTag>Пример</DemoTag>
          </div>
          <ul className="docs__list">
            {demoDocuments.map((d) => (
              <li key={d.name} className="docs__row">
                <span className="docs__name">{d.name}</span>
                <span className="docs__note t-small">{d.note}</span>
                <StatusMark status={d.status} />
              </li>
            ))}
          </ul>
          <p className="docs__foot t-small">
            Файлы открывает только оператор Open Consulting; каждое открытие записывается в журнал. Перечень
            настраивается по стране и сверяется с консульством перед запуском.
          </p>
        </section>

        <section className="docs__block" aria-labelledby="docs-track-title">
          <div className="docs__head">
            <h3 id="docs-track-title" className="t-h3">
              Путь до въезда
            </h3>
            {availabilityNote[visaTrackAvailability] && (
              <span className="docs__availability t-label">{availabilityNote[visaTrackAvailability]}</span>
            )}
          </div>
          <ol className="track" aria-label="Этапы сопровождения после взаимного подтверждения">
            {visaTrack.map((step, i) => {
              const state = i < CURRENT_STEP ? 'done' : i === CURRENT_STEP ? 'current' : 'next';
              return (
                <li key={step.label} className={cx('track__step', `is-${state}`)} aria-current={state === 'current' ? 'step' : undefined}>
                  <span className="track__marker" aria-hidden="true">
                    {state === 'done' ? <Check size={12} strokeWidth={3} /> : null}
                  </span>
                  <span className="track__label">{step.label}</span>
                  <span className="track__owner t-label">{step.owner}</span>
                  <span className="visually-hidden">
                    {state === 'done' ? ' — выполнено' : state === 'current' ? ' — текущий этап' : ''}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        <dl className="duties">
          {responsibilities.map((r) => (
            <div key={r.who} className={cx('duties__row', r.limit && 'duties__row--limit')}>
              <dt>{r.who}</dt>
              <dd className="t-small">{r.does}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Chapter>
  );
}
