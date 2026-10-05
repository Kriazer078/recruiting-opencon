import { ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';
import { flows, useNextStep } from '../components/NextStep';
import { languages, type Role } from '../data/content';
import { licenseUrl, photoCredits } from '../data/media';
import './site-footer.css';

const PIXABAY_RECEPTION = {
  author: 'Rodrigo Salomon',
  page: 'https://pixabay.com/photos/receptionists-phone-call-hotel-5975962/',
};

export function SiteFooter({ onRoleChange }: { onRoleChange: (role: Role) => void }) {
  const openNext = useNextStep();
  const credits = photoCredits();

  return (
    <footer id="contacts" className="site-footer on-night">
      <div className="container">
        <div className="site-footer__paths">
          <button type="button" className="footer-path" onClick={() => openNext(flows.candidateSignup)}>
            <span className="t-label footer-path__who">Ищу работу</span>
            <span className="footer-path__what t-h2">
              Создать анкету <ArrowRight aria-hidden="true" />
            </span>
          </button>
          <button type="button" className="footer-path" onClick={() => openNext(flows.hotelSignup)}>
            <span className="t-label footer-path__who">Ищу сотрудников</span>
            <span className="footer-path__what t-h2">
              Зарегистрировать отель <ArrowRight aria-hidden="true" />
            </span>
          </button>
        </div>

        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <Logo tone="dark" className="site-footer__logo" />
            <p className="t-small">Подбор персонала из Казахстана в отели Турции. Шымкент, Казахстан.</p>
          </div>

          <nav className="site-footer__col" aria-label="Кандидатам">
            <h2 className="t-label">Кандидатам</h2>
            <ul>
              <li><a href="#top" onClick={() => onRoleChange('candidate')}>Как начать</a></li>
              <li><a href="#vacancies">Вакансии</a></li>
              <li><a href="#profile">Анкета и видео</a></li>
              <li><a href="#documents">Документы</a></li>
            </ul>
          </nav>
          <nav className="site-footer__col" aria-label="Работодателям">
            <h2 className="t-label">Работодателям</h2>
            <ul>
              <li><a href="#top" onClick={() => onRoleChange('hotel')}>Для отелей</a></li>
              <li><a href="#one-place">Правило одного места</a></li>
              <li><a href="#interview">Собеседование</a></li>
              <li><a href="#partners">Партнёрам</a></li>
            </ul>
          </nav>
          <div className="site-footer__col">
            <h2 className="t-label">Контакты</h2>
            <ul className="site-footer__contacts">
              <li>Шымкент, Казахстан</li>
              <li><span className="placeholder">Телефон — утверждается</span></li>
              <li><span className="placeholder">Почта — утверждается</span></li>
              <li><span className="placeholder">Реквизиты — утверждаются</span></li>
            </ul>
          </div>
        </div>

        <div className="site-footer__legal">
          <ul className="site-footer__docs">
            <li>
              <button type="button" onClick={() => openNext(flows.legal)}>Политика персональных данных</button>
            </li>
            <li>
              <button type="button" onClick={() => openNext(flows.legal)}>Публичная оферта</button>
            </li>
            <li className="site-footer__langs" aria-label="Языки сайта">
              {languages.map((l) => (
                <span key={l.code} aria-current={l.ready ? 'true' : undefined}>{l.code}</span>
              ))}
            </li>
          </ul>
          <p className="t-small">
            Open Consulting не подаёт заявления в e-İzin, не выдаёт визы и не гарантирует трудоустройство.
            Разрешение на работу оформляет работодатель.
          </p>
          <p className="site-footer__credits t-label">
            Демонстрационная версия главной: анкеты, вакансии и новости — примеры, данные не собираются. Фото:{' '}
            {credits.map((c, i) => (
              <span key={c.author}>
                <a href={c.page} target="_blank" rel="noreferrer">{c.author}</a>
                {i < credits.length - 1 ? ', ' : ''}
              </span>
            ))}{' '}
            — <a href={licenseUrl} target="_blank" rel="noreferrer">Pexels License</a>;{' '}
            <a href={PIXABAY_RECEPTION.page} target="_blank" rel="noreferrer">{PIXABAY_RECEPTION.author}</a> — Pixabay
            Content License. Люди на фото — модели, не кандидаты и не сотрудники партнёров.
          </p>
          <p className="t-label site-footer__copy">© 2026 Open Consulting</p>
        </div>
      </div>
    </footer>
  );
}
