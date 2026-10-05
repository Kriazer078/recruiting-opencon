import { useState } from 'react';
import { Tabs } from 'radix-ui';
import { Check, EyeOff, Lock, Minus, Play } from 'lucide-react';
import { Chapter } from '../components/Chapter';
import { CropImage, DemoTag, MediaFrame } from '../components/Media';
import { LanguageScale, StatusMark } from '../components/Indicators';
import { candidates, type Candidate, type Crop } from '../data/candidates';
import { range, rules } from '../data/rules';
import { cx } from '../lib/cx';
import './profile.css';

type View = 'video' | 'face' | 'full-0' | 'full-1' | 'full-2';

function viewCrop(c: Candidate, view: View): Crop {
  if (view === 'video') return c.presentation.poster;
  if (view === 'face') return c.photos.face;
  return c.photos.full[Number(view.slice(-1))]!;
}

const viewLabel: Record<View, string> = {
  video: 'Видео',
  face: 'Лицо',
  'full-0': 'В рост 1',
  'full-1': 'В рост 2',
  'full-2': 'В рост 3',
};

export function ProfileChapter() {
  return (
    <Chapter
      id="profile"
      layout="stacked"
      title="Отель видит человека, а не только строки резюме"
      lead="Анкета — это данные, четыре фото и короткая видеопрезентация. Отель видит опыт и языки и слышит, как кандидат говорит, ещё до приглашения."
      sides={{
        candidate: `Одно фото лица, три кадра в полный рост и видео ${range(rules.presentation.minSeconds, rules.presentation.maxSeconds)} секунд. Подсказки-вопросы появляются на экране по очереди.`,
        hotel: 'Опубликованные анкеты по профессиям ваших вакансий: видео, фото, опыт, языки и статус документов.',
      }}
    >
      {/* opens on a different person than the hero, so the page shows more than one face */}
      <Tabs.Root defaultValue={candidates[1]!.id} className="profile">
        <div className="profile__tabs-row">
          <Tabs.List className="profile__tabs" aria-label="Примеры анкет">
            {candidates.map((c) => (
              <Tabs.Trigger key={c.id} value={c.id} className="profile__tab">
                {c.professions[0]}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          <DemoTag>Примеры анкет. Фото — Pexels, люди не являются кандидатами</DemoTag>
        </div>
        {candidates.map((c) => (
          <Tabs.Content key={c.id} value={c.id} className="profile__panel">
            <ProfileCard candidate={c} />
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Chapter>
  );
}

function ProfileCard({ candidate: c }: { candidate: Candidate }) {
  const [view, setView] = useState<View>('video');
  const crop = viewCrop(c, view);

  return (
    <article className="profile-card" aria-label={`Пример анкеты: ${c.professions[0]}`}>
      <div className="profile-card__media">
        <MediaFrame
          ratio="4 / 5"
          className="profile-card__frame"
          overlay={
            view === 'video' ? (
              <div className="caption-strip profile-card__caption">
                <span className="profile-card__play" aria-hidden="true">
                  <Play size={18} fill="currentColor" />
                </span>
                <span>
                  <span className="t-label">Видеопрезентация · {c.presentation.duration}</span>
                  <span className="profile-card__caption-sub t-small">
                    {rules.presentation.questions} вопросов, в рост и в лицо
                  </span>
                </span>
              </div>
            ) : (
              <div className="caption-strip profile-card__caption">
                <span className="t-label">{viewLabel[view]}</span>
              </div>
            )
          }
        >
          <CropImage
            key={`${c.id}-${view}`}
            crop={crop}
            frameRatio={4 / 5}
            sizes="(min-width: 1024px) 30rem, 100vw"
            className="profile-card__img"
          />
        </MediaFrame>

        <div className="profile-card__thumbs" role="group" aria-label="Материалы анкеты">
          {(Object.keys(viewLabel) as View[]).map((v) => (
            <button
              key={v}
              type="button"
              className={cx('thumb', v === view && 'is-active')}
              aria-pressed={v === view}
              onClick={() => setView(v)}
            >
              <MediaFrame ratio="3 / 4" chamfer="s" className="thumb__frame">
                <CropImage crop={viewCrop(c, v)} frameRatio={3 / 4} sizes="112px" alt="" />
                {v === 'video' && (
                  <span className="thumb__play" aria-hidden="true">
                    <Play size={12} fill="currentColor" />
                  </span>
                )}
              </MediaFrame>
              <span className="thumb__label">{viewLabel[v]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="profile-card__sheet">
        <header className="profile-card__head">
          <h3 className="t-h3">
            {c.name}
            <span className="profile-card__city">{c.homeCity}</span>
          </h3>
          <ul className="profile-card__professions" aria-label="Профессии">
            {c.professions.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </header>

        <dl className="sheet">
          <div className="sheet__row">
            <dt>Опыт</dt>
            <dd>
              <p className="t-num sheet__strong">{c.experienceTotal}</p>
              <ul className="sheet__list">
                {c.experience.map((e) => (
                  <li key={e.place}>
                    {e.role} · {e.place} <span className="t-num t-subtle">{e.period}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="sheet__row">
            <dt>Языки</dt>
            <dd className="sheet__langs">
              {c.languages.map((l) => (
                <LanguageScale key={l.name} name={l.name} level={l.level} />
              ))}
            </dd>
          </div>
          <div className="sheet__row">
            <dt>Готовность</dt>
            <dd className="sheet__checks">
              {c.readiness.map((r) => (
                <span key={r.label} className={cx('sheet__check', !r.value && 'is-no')}>
                  {r.value ? <Check size={16} aria-hidden="true" /> : <Minus size={16} aria-hidden="true" />}
                  {r.label}
                  <span className="visually-hidden">{r.value ? ': да' : ': нет'}</span>
                </span>
              ))}
            </dd>
          </div>
          <div className="sheet__row">
            <dt>Ожидание</dt>
            <dd className="t-num">{c.salary}</dd>
          </div>
          <div className="sheet__row">
            <dt>Источник</dt>
            <dd>{c.source.label}</dd>
          </div>
          <div className="sheet__row">
            <dt>Документы</dt>
            <dd className="sheet__docs">
              <StatusMark status={c.documents} />
              <span className="t-small t-subtle">Файлы видит только оператор</span>
            </dd>
          </div>
        </dl>

        <ul className="profile-card__privacy t-small">
          <li>
            <Lock size={16} aria-hidden="true" />
            Анкету видят только проверенные отели — по профессиям их вакансий и после модерации.
          </li>
          <li>
            <EyeOff size={16} aria-hidden="true" />
            Номер паспорта и файлы справок отелю не показываются.
          </li>
        </ul>
      </div>
    </article>
  );
}
