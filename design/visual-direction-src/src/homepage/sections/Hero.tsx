import { ToggleGroup } from 'radix-ui';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { flows, useNextStep } from '../components/NextStep';
import { chapters } from '../components/Chapter';
import { heroCopy, type Role } from '../data/content';
import { photos } from '../data/media';
import { range } from '../data/rules';
import { typo } from '../lib/typography';
import { PresentationFrame } from './PresentationFrame';
import './hero.css';

interface Props {
  role: Role;
  onRoleChange: (role: Role) => void;
}

const chapterHints: Record<(typeof chapters)[number]['id'], string> = {
  profile: 'Фото и 30 секунд видео',
  vacancies: `По ${range(1, 3)} вашим профессиям`,
  'one-place': 'До трёх согласий, выбор одного отеля',
  interview: 'Онлайн, с переводчиком',
  documents: 'Проверка и сопровождение до въезда',
};

export function Hero({ role, onRoleChange }: Props) {
  const openNext = useNextStep();
  const copy = heroCopy[role];
  const poster = photos.waiterStanding;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__text">
          <ToggleGroup.Root
            type="single"
            value={role}
            onValueChange={(v) => v && onRoleChange(v as Role)}
            className="role-switch"
            aria-label="Кто вы"
          >
            <ToggleGroup.Item value="candidate" className="role-switch__item">
              Ищу работу
            </ToggleGroup.Item>
            <ToggleGroup.Item value="hotel" className="role-switch__item">
              Ищу сотрудников
            </ToggleGroup.Item>
          </ToggleGroup.Root>

          <div className="hero__copy" key={role}>
            <p className="hero__context t-label">
              <span className="hero__route">
                Казахстан <ArrowRight size={14} aria-label="в" /> Турция
              </span>
              <span aria-hidden="true">·</span>
              {copy.context}
            </p>
            <h1 id="hero-title" className="hero__title t-display">
              {typo(copy.title)}
            </h1>
            <p className="hero__lead">{typo(copy.lead)}</p>
          </div>

          <div className="hero__actions">
            <Button
              size="lg"
              icon={<ArrowRight size={20} />}
              onClick={() => openNext(role === 'candidate' ? flows.candidateSignup : flows.hotelSignup)}
            >
              {copy.primary}
            </Button>
            <Button variant="link" href={copy.secondary.href} icon={<ArrowRight size={16} />}>
              {copy.secondary.label}
            </Button>
          </div>
          <p className="hero__note t-small">{copy.note}</p>
        </div>

        <div className="hero__visual">
          <PresentationFrame role={role} />
          <p className="photo-credit">
            Фото:{' '}
            <a href={poster.page} target="_blank" rel="noreferrer">
              {poster.author}, Pexels
            </a>
            . Модель, не кандидат платформы.
          </p>
        </div>
      </div>

      <nav id="how" className="container path-index" aria-label="Как это работает">
        <p className="path-index__title t-label">Как это работает</p>
        <ol className="path-index__list">
          {chapters.map((c, i) => (
            <li key={c.id}>
              <a href={`#${c.id}`}>
                <span className="path-index__num t-num">{i + 1}</span>
                <span className="path-index__name">{c.short}</span>
                <span className="path-index__hint t-small">{chapterHints[c.id]}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </section>
  );
}
