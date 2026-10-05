import { useState } from 'react';
import { ToggleGroup } from 'radix-ui';
import { Clock, Mic, MicOff, Video } from 'lucide-react';
import { Chapter } from '../components/Chapter';
import { CropImage, DemoTag, MediaFrame } from '../components/Media';
import { availabilityNote, rules } from '../data/rules';
import { interviewModes, type InterviewMode } from '../data/process';
import { candidates } from '../data/candidates';
import receptionPhoto from '../../../../product-map/visual-direction/home/assets/reception.jpg';
import markUrl from '../assets/brand/mark.png';
import { cx } from '../lib/cx';
import './interview.css';

const candidate = candidates[0]!;
const { kazakhstan, turkey } = rules.timezones;
const interviewLocalKz = 15; // 15:00 in Shymkent
const interviewLocalTr = interviewLocalKz - (kazakhstan.utcOffset - turkey.utcOffset);

const subtitle = {
  tr: 'Daha önce hangi otelde çalıştınız?',
  ru: 'В каком отеле вы работали раньше?',
};

export function InterviewChapter() {
  const [mode, setMode] = useState<InterviewMode['id']>('interpreter');
  const active = interviewModes.find((m) => m.id === mode)!;

  return (
    <Chapter
      id="interview"
      layout="stacked"
      tone="night"
      title="Собеседование без перелёта"
      lead="Комната на троих внутри платформы: кандидат, отель и переводчик Open Consulting. Время обеих стран показано рядом."
      sides={{
        candidate: 'Напоминания за 3 часа и за 30 минут. Перед входом — проверка камеры, микрофона и объяснение записи.',
        hotel: `Назначьте встречу не раньше чем через ${rules.interviewMinLeadHours} часов и выберите режим общения. После — подтвердите сотрудника или назначьте повтор.`,
      }}
    >
      <div className="room">
        <div className="room__toolbar">
          <ToggleGroup.Root
            type="single"
            value={mode}
            onValueChange={(v) => v && setMode(v as InterviewMode['id'])}
            className="mode-switch"
            aria-label="Режим общения"
          >
            {interviewModes.map((m) => (
              <ToggleGroup.Item key={m.id} value={m.id} className="mode-switch__item" aria-label={m.label}>
                <span className="mode-switch__long" aria-hidden="true">{m.label}</span>
                <span className="mode-switch__short" aria-hidden="true">{m.short}</span>
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
          <DemoTag tone="night">Пример комнаты</DemoTag>
        </div>
        <p className="room__mode-note t-small" aria-live="polite">
          {active.description}
          {availabilityNote[active.availability] && (
            <span className="room__availability"> {availabilityNote[active.availability]}.</span>
          )}
        </p>

        <div className={cx('room__stage', `room__stage--${mode}`)}>
          <div className="room__tile-wrap room__tile-wrap--main">
            <MediaFrame ratio="16 / 10" className="room__tile" label="Кандидат в видеокомнате">
              <CropImage
                crop={{ photo: 'waiterStanding', focal: '48% 54%', zoom: 2.4 }}
                frameRatio={16 / 10}
                sizes="(min-width: 1024px) 52rem, 100vw"
                alt="Кандидат на собеседовании — пример с фотографией модели"
              />
            </MediaFrame>
            {mode === 'subtitles' ? (
              <div className="room__subtitles">
                <p lang="tr" className="room__sub-tr">
                  {subtitle.tr}
                </p>
                <p className="room__sub-ru">{subtitle.ru}</p>
                <p className="room__sub-note">Строка автоматическая и может ошибаться</p>
              </div>
            ) : (
              <ParticipantLabel role="Кандидат" name={`${candidate.name}, ${candidate.homeCity}`} mic />
            )}
          </div>

          <div className="room__side">
            <div className="room__tile-wrap">
              <MediaFrame ratio="16 / 10" chamfer="s" className="room__tile" label="Представитель отеля">
                <img
                  className="crop-image"
                  src={receptionPhoto}
                  alt="Сотрудники отеля на ресепшен — фотография Rodrigo Salomon, Pixabay"
                  style={{ objectPosition: '66% 30%' }}
                  loading="lazy"
                />
              </MediaFrame>
              <ParticipantLabel role="Отель" name="Анталья" mic />
            </div>
            <div className={cx('room__tile-wrap', mode === 'english' && 'is-idle')}>
              <div className="room__interpreter">
                <img src={markUrl} alt="" width={40} height={24} />
                <p className="t-small room__interpreter-state">
                  {mode === 'english' ? 'Переводчик не нужен' : mode === 'subtitles' ? 'Оператор на связи' : 'Переводит RU ↔ TR'}
                </p>
              </div>
              <ParticipantLabel role="Переводчик" name="Open Consulting" mic={mode === 'interpreter'} />
            </div>
          </div>
        </div>

        <aside className="room__schedule" aria-label="Расписание собеседования">
          <div className="room__clock">
            <p className="t-label room__muted">Среда, 7 октября</p>
            <div className="room__times">
              <p>
                <span className="room__time t-num">{interviewLocalKz}:00</span>
                <span className="t-small">
                  {kazakhstan.city} · UTC+{kazakhstan.utcOffset}
                </span>
              </p>
              <p>
                <span className="room__time t-num">{interviewLocalTr}:00</span>
                <span className="t-small">
                  {turkey.city} · UTC+{turkey.utcOffset}
                </span>
              </p>
            </div>
          </div>
          <ul className="room__rules t-small">
            <li>
              <Clock size={16} aria-hidden="true" />
              Не раньше чем через {rules.interviewMinLeadHours} часов после назначения — оператор успевает подготовить перевод.
            </li>
            <li>
              <Video size={16} aria-hidden="true" />
              Режим общения нельзя сменить позже чем за {rules.interviewModeLockHours} часа до начала.
            </li>
            <li>
              <Mic size={16} aria-hidden="true" />
              Запись хранится {rules.recordingRetentionDays} дней и доступна оператору.
            </li>
          </ul>
        </aside>
      </div>
    </Chapter>
  );
}

function ParticipantLabel({ role, name, mic, className }: { role: string; name: string; mic: boolean; className?: string }) {
  return (
    <p className={cx('room__label', className)}>
      {mic ? <Mic size={14} aria-label="микрофон включён" /> : <MicOff size={14} aria-label="микрофон выключен" />}
      <span className="room__label-role">{role}</span>
      <span className="room__label-name">{name}</span>
    </p>
  );
}
