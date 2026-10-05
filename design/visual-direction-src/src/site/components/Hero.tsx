import { forwardRef, type FormEvent } from 'react';
import { CheckCircle2, ChevronDown, Search } from 'lucide-react';
import { flows } from '../../homepage/data/flows';
import { typo } from '../../homepage/lib/typography';
import { heroCopy, type Role } from '../data/site';
import { professions, regions, type Region } from '../data/vacancies';
import photo from '../assets/reception-portrait.jpg';
import { useNextStep } from './NextStep';
import './hero.css';

interface Props {
  role: Role;
  onRole: (r: Role) => void;
  query: string;
  onQuery: (q: string) => void;
  region: Region | 'all';
  onRegion: (r: Region | 'all') => void;
  onSearch: (q?: string) => void;
}

const quick = professions.slice(0, 5);

export const Hero = forwardRef<HTMLFormElement, Props>(function Hero(
  { role, onRole, query, onQuery, region, onRegion, onSearch },
  searchRef,
) {
  const c = heroCopy[role];
  const openNext = useNextStep();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (role === 'hotel') {
      openNext({
        ...flows.hotelSignup,
        title: 'Поиск кандидатов',
        text: 'Анкеты видят только проверенные отели — по профессиям своих вакансий. Зарегистрируйте компанию, и после проверки откроется каталог кандидатов. Эта версия сайта не собирает данные.',
      });
      return;
    }
    onSearch();
  };

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap">
        <div className="hero__panel">
          <div className="hero__field">
            <div className="hero__roles" role="group" aria-label="Кто вы">
              <button type="button" aria-pressed={role === 'candidate'} onClick={() => onRole('candidate')}>
                Ищу работу
              </button>
              <button type="button" aria-pressed={role === 'hotel'} onClick={() => onRole('hotel')}>
                Ищу сотрудников
              </button>
            </div>

            <h1 id="hero-title" className="hero__title">{typo(c.title)}</h1>
            <p className="hero__lead">{typo(c.lead)}</p>

            <form ref={searchRef} className="hero__search" role="search" onSubmit={submit}>
              <label className="hero__q">
                <span className="visually-hidden">{c.placeholder}</span>
                <Search size={22} strokeWidth={1.75} aria-hidden="true" />
                <input
                  id="hero-q"
                  type="search"
                  value={query}
                  onChange={(e) => onQuery(e.target.value)}
                  placeholder={c.placeholder}
                  autoComplete="off"
                  enterKeyHint="search"
                />
              </label>
              <label className="hero__region">
                <span className="visually-hidden">{role === 'hotel' ? 'Где ваш отель' : 'Регион Турции'}</span>
                <select id="hero-region" value={region} onChange={(e) => onRegion(e.target.value as Region | 'all')}>
                  <option value="all">Вся Турция</option>
                  {regions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <ChevronDown size={18} strokeWidth={1.75} aria-hidden="true" />
              </label>
              <button type="submit" className="btn btn--ink hero__submit">
                {c.submit}
              </button>
            </form>

            <div className="hero__quick">
              <span>Часто ищут</span>
              <ul>
                {quick.map((p) => (
                  <li key={p}>
                    <button
                      type="button"
                      aria-pressed={query === p}
                      onClick={() => {
                        onQuery(p);
                        // a hotel looks for people, not jobs: the chip only fills the field
                        if (role === 'candidate') onSearch(p);
                      }}
                    >
                      {p}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="hero__facts" aria-label="Что делает Open Consulting">
              <li><a href="#how"><CheckCircle2 size={18} strokeWidth={1.75} aria-hidden="true" />Отели проверены</a></li>
              <li><a href="#how"><CheckCircle2 size={18} strokeWidth={1.75} aria-hidden="true" />Собеседование с переводчиком</a></li>
              <li><a href="#how"><CheckCircle2 size={18} strokeWidth={1.75} aria-hidden="true" />Сопровождение документов</a></li>
            </ul>
          </div>

          <figure className="hero__photo">
            <img src={photo} alt="Администратор ресепшен отеля разговаривает по телефону за стойкой" width={620} height={854} />
            <figcaption>
              Фото: <a href="https://pixabay.com/photos/receptionists-phone-call-hotel-5975962/" target="_blank" rel="noreferrer">Rodrigo Salomon, Pixabay</a>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
});
