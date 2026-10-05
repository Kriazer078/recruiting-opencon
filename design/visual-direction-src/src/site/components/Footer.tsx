import { Logo } from '../../homepage/components/Logo';
import { flows } from '../../homepage/data/flows';
import type { Role } from '../data/site';
import { useNextStep } from './NextStep';
import './footer.css';

export function Footer({ onRole }: { onRole: (r: Role) => void }) {
  const openNext = useNextStep();
  return (
    <footer id="contacts" className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <Logo className="footer__logo" />
          <p>Подбор персонала из Казахстана для отелей Турции: проверка анкет, перевод на собеседованиях, сопровождение документов.</p>
        </div>
        <nav aria-label="Кандидатам">
          <h2>Кандидатам</h2>
          <ul>
            <li><a href="#vacancies" onClick={() => onRole('candidate')}>Вакансии</a></li>
            <li><button type="button" onClick={() => openNext(flows.candidateSignup)}>Создать анкету</button></li>
            <li><a href="#how">Как это работает</a></li>
          </ul>
        </nav>
        <nav aria-label="Работодателям">
          <h2>Работодателям</h2>
          <ul>
            <li><button type="button" onClick={() => openNext(flows.hotelSignup)}>Разместить вакансию</button></li>
            <li><a href="#employers" onClick={() => onRole('hotel')}>Условия для отелей</a></li>
            <li><a href="#partners">Партнёрам</a></li>
          </ul>
        </nav>
        <nav aria-label="О компании">
          <h2>Open Consulting</h2>
          <ul>
            <li><a href="#news">Новости</a></li>
            <li>Шымкент, Казахстан</li>
            <li className="footer__muted">Телефон и почта уточняются</li>
          </ul>
        </nav>
        <nav aria-label="Документы">
          <h2>Документы</h2>
          <ul>
            <li><button type="button" onClick={() => openNext(flows.legal)}>Политика персональных данных</button></li>
            <li><button type="button" onClick={() => openNext(flows.legal)}>Публичная оферта</button></li>
            <li><button type="button" onClick={() => openNext(flows.legal)}>Реквизиты</button></li>
          </ul>
        </nav>
      </div>
      <div className="wrap footer__base">
        <p>© 2026 Open Consulting. Демонстрационная версия: вакансии и новости — примеры.</p>
        <p>
          Фото: <a href="https://pixabay.com/photos/receptionists-phone-call-hotel-5975962/" target="_blank" rel="noreferrer">Rodrigo Salomon</a>, Pixabay Content License. На фото — не кандидаты платформы.
        </p>
      </div>
    </footer>
  );
}
