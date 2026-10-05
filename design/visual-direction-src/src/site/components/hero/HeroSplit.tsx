import { forwardRef } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { typo } from '../../../homepage/lib/typography';
import { flows } from '../../../homepage/data/flows';
import { localPhotos } from '../../../concepts/shared/photos';
import { heroCopy } from '../../data/site';
import { useNextStep } from '../NextStep';
import { Credit, HeroSearch, QuickLinks, type HeroProps } from './parts';
import './split.css';

const photo = localPhotos.reception;

const sides = {
  hotel: {
    title: 'Ищете сотрудников для отеля?',
    points: ['Проверенные анкеты с фото и видео', 'Собеседование с переводчиком', 'Кандидат подтверждает только одно место'],
    action: 'Разместить вакансию',
  },
  candidate: {
    title: 'Ищете работу в Турции?',
    points: ['Анкета с короткой видеопрезентацией', 'Проверенные отели', 'Сопровождение документов до выезда'],
    action: 'Создать анкету',
  },
};

/**
 * D · «Два входа». The TZ's central block taken literally: «Ищу работу» and «Я работодатель»
 * side by side, as Enbek splits its audiences. The search belongs to the current role;
 * the other audience gets its own door with a photograph of hotel staff at work.
 */
export const HeroSplit = forwardRef<HTMLFormElement, HeroProps>(function HeroSplit(props, ref) {
  const c = heroCopy[props.role];
  const other = props.role === 'candidate' ? 'hotel' : 'candidate';
  const s = sides[other];
  const openNext = useNextStep();

  return (
    <section className="hero hero-split" aria-labelledby="hero-title">
      <div className="wrap split">
        <div className="split__main">
          <div className="split__tabs" role="group" aria-label="Кто вы">
            <button type="button" aria-pressed={props.role === 'candidate'} onClick={() => props.onRole('candidate')}>
              Ищу работу
            </button>
            <button type="button" aria-pressed={props.role === 'hotel'} onClick={() => props.onRole('hotel')}>
              Я работодатель
            </button>
          </div>
          <h1 id="hero-title" className="split__title">
            {typo(c.title)}
          </h1>
          <p className="split__lead">{typo(c.lead)}</p>
          <HeroSearch ref={ref} id="hero" tone="light" framed {...props} />
          <QuickLinks tone="light" {...props} />
        </div>

        <aside className="split__door" aria-labelledby="door-title">
          <div className="split__photo">
            <img src={photo.src} alt={photo.alt} loading="lazy" />
            <Credit tone="dark" author={photo.author} site={photo.site} page={photo.page} />
          </div>
          <div className="split__door-body">
            <h2 id="door-title" className="split__door-title">
              {s.title}
            </h2>
            <ul className="split__points">
              {s.points.map((p) => (
                <li key={p}>
                  <Check size={16} strokeWidth={2.25} aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="split__actions">
              <button
                type="button"
                className="btn btn--red"
                onClick={() => openNext(other === 'hotel' ? flows.hotelSignup : flows.candidateSignup)}
              >
                {s.action}
              </button>
              <button type="button" className="split__switch" onClick={() => props.onRole(other)}>
                {other === 'hotel' ? 'Открыть раздел для отелей' : 'Открыть раздел для кандидатов'}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
});
