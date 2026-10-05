import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { CropImage, DemoTag, MediaFrame } from '../components/Media';
import { StatusMark } from '../components/Indicators';
import { candidates, languageLevels } from '../data/candidates';
import { presentationQuestions } from '../data/questions';
import { rules } from '../data/rules';
import type { Role } from '../data/content';
import { useDocumentVisible, useInView, useReducedMotion } from '../lib/hooks';
import { cx } from '../lib/cx';
import './presentation-frame.css';

const QUESTION_MS = (rules.presentation.targetSeconds * 1000) / rules.presentation.questions; // 5 s
const TOTAL_MS = rules.presentation.targetSeconds * 1000;
const HOLD_MS = 1600;
const TICK_MS = 100;

const featured = candidates[0]!;

function clock(ms: number) {
  const s = Math.min(Math.floor(ms / 1000), rules.presentation.targetSeconds);
  return `0:${String(s).padStart(2, '0')}`;
}

/**
 * The hero's product visual: one video presentation seen from two sides.
 * Candidate view — the recording with questions appearing at the bottom (FR-MED-02).
 * Hotel view — the same person with the profile summary a hotel sees.
 */
export function PresentationFrame({ role }: { role: Role }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, 0.4);
  const pageVisible = useDocumentVisible();
  const [userPaused, setUserPaused] = useState(false);
  const [elapsed, setElapsed] = useState(QUESTION_MS + 0.8 * QUESTION_MS); // start mid question 2

  const autoplay = !reduced && !userPaused && inView && pageVisible && role === 'candidate';

  useEffect(() => {
    if (reduced) setUserPaused(true);
  }, [reduced]);

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setInterval(() => {
      setElapsed((ms) => (ms + TICK_MS >= TOTAL_MS + HOLD_MS ? 0 : ms + TICK_MS));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [autoplay]);

  const position = Math.min(elapsed, TOTAL_MS - 1);
  const current = Math.floor(position / QUESTION_MS);
  const question = presentationQuestions[current]!;
  const fill = (position % QUESTION_MS) / QUESTION_MS;

  return (
    <div ref={ref} className={cx('pframe', `pframe--${role}`)}>
      <MediaFrame
        ratio="4 / 5"
        chamfer="l"
        className="pframe__frame"
        label={role === 'candidate' ? 'Пример видеопрезентации кандидата' : 'Пример анкеты, как её видит отель'}
        overlay={
          <>
            <div className="frame-topbar">
              <DemoTag tone="night">{role === 'candidate' ? 'Пример записи' : 'Пример анкеты'}</DemoTag>
              {role === 'candidate' ? (
                <div className="pframe__controls">
                  <span className="pframe__time t-num" aria-hidden="true">
                    {clock(position)} / 0:{rules.presentation.targetSeconds}
                  </span>
                  <button
                    type="button"
                    className="pframe__play"
                    onClick={() => setUserPaused((p) => !p)}
                    aria-label={userPaused ? 'Продолжить пример' : 'Остановить пример'}
                  >
                    {userPaused ? <Play size={18} /> : <Pause size={18} />}
                  </button>
                </div>
              ) : (
                <span className="pframe__time t-num">
                  <Play size={14} aria-hidden="true" /> {featured.presentation.duration}
                </span>
              )}
            </div>

            {role === 'candidate' ? (
              <div className="caption-strip pframe__caption">
                <p className="pframe__q-index t-label t-num">
                  Вопрос {current + 1} из {rules.presentation.questions} · {question.topic}
                </p>
                <p className="pframe__q-text" key={current}>
                  {question.text}
                </p>
                <div className="pframe__segments" role="group" aria-label="Вопросы презентации">
                  {presentationQuestions.map((q, i) => (
                    <button
                      key={q.topic}
                      type="button"
                      className={cx('pframe__seg', i < current && 'is-done', i === current && 'is-current')}
                      aria-label={`Вопрос ${i + 1}: ${q.topic}`}
                      aria-current={i === current ? 'step' : undefined}
                      onClick={() => setElapsed(i * QUESTION_MS)}
                    >
                      <span
                        className="pframe__seg-fill"
                        style={{ transform: `scaleX(${i < current ? 1 : i === current ? fill : 0})` }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="caption-strip pframe__caption pframe__caption--profile">
                <p className="pframe__name t-h3">
                  {featured.name}
                  <span className="pframe__city t-small">{featured.homeCity}</span>
                </p>
                <p className="pframe__professions t-small">{featured.professions.join(' · ')}</p>
                <dl className="pframe__facts t-small">
                  <div>
                    <dt>Опыт</dt>
                    <dd className="t-num">{featured.experienceTotal}</dd>
                  </div>
                  <div>
                    <dt>Языки</dt>
                    <dd>
                      {featured.languages
                        .filter((l) => l.level >= 2)
                        .map((l) => `${l.name.toLowerCase()} — ${languageLevels[l.level]}`)
                        .join(', ')}
                    </dd>
                  </div>
                  <div>
                    <dt>Документы</dt>
                    <dd>
                      <StatusMark status={featured.documents} tone="night" />
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </>
        }
      >
        <CropImage
          crop={featured.presentation.poster}
          frameRatio={4 / 5}
          sizes="(min-width: 1024px) 36rem, 100vw"
          priority
        />
      </MediaFrame>

      <ol className="visually-hidden" aria-label="Шесть вопросов видеопрезентации">
        {presentationQuestions.map((q) => (
          <li key={q.topic}>{q.text}</li>
        ))}
      </ol>
    </div>
  );
}
