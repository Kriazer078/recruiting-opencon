import { useState, type FormEvent } from 'react';
import { Dialog, DropdownMenu } from 'radix-ui';
import { Check, ChevronDown, Globe, Menu, Search, X } from 'lucide-react';
import { Logo } from '../../homepage/components/Logo';
import { languages } from '../../homepage/data/content';
import { flows } from '../../homepage/data/flows';
import { audienceLinks, heroCopy, mainNav, type Role } from '../data/site';
import { useNextStep } from './NextStep';
import './header.css';

interface Props {
  role: Role;
  onRole: (r: Role) => void;
  /** compact search appears in the bar once the hero search has scrolled away */
  compact: boolean;
  query: string;
  onQuery: (q: string) => void;
  onSearch: () => void;
}

export function Header({ role, onRole, compact, query, onQuery, onSearch }: Props) {
  const openNext = useNextStep();
  const [menu, setMenu] = useState(false);
  const signup = () => openNext(role === 'hotel' ? flows.hotelSignup : flows.candidateSignup);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (role === 'hotel') {
      openNext({
        ...flows.hotelSignup,
        title: 'Поиск кандидатов',
        text: 'Анкеты видят только проверенные отели — по профессиям своих вакансий. Эта версия сайта не собирает данные.',
      });
      return;
    }
    onSearch();
  };

  return (
    <>
      <div className="topbar">
        <div className="wrap topbar__row">
          <nav aria-label="Разделы для аудиторий">
            <ul className="topbar__aud">
              {audienceLinks.map((a) => (
                <li key={a.label}>
                  {a.role ? (
                    <button type="button" aria-pressed={role === a.role} onClick={() => onRole(a.role!)}>
                      {a.label}
                    </button>
                  ) : (
                    <a href={a.href}>{a.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="topbar__aside">
            <LanguageMenu />
            <a href="#contacts">Помощь и контакты</a>
          </div>
        </div>
      </div>

      <header className="header">
        <div className="wrap header__row">
          <a className="header__brand" href="#top" aria-label="Open Consulting — на главную">
            <Logo className="header__logo" />
          </a>
          <nav className="header__nav" aria-label="Основное меню">
            <ul>
              {mainNav.map((n) => (
                <li key={n.label}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <form className={`header__search${compact ? ' is-on' : ''}`} role="search" onSubmit={submit} aria-hidden={!compact}>
            <Search size={18} strokeWidth={1.75} aria-hidden="true" />
            <label className="visually-hidden" htmlFor="header-q">Поиск вакансий</label>
            <input
              id="header-q"
              type="search"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder={heroCopy[role].placeholder}
              tabIndex={compact ? 0 : -1}
              autoComplete="off"
            />
          </form>
          <div className="header__actions">
            <button type="button" className="btn btn--soft header__login" onClick={() => openNext(flows.login)}>
              Войти
            </button>
            <button type="button" className="btn btn--red header__cta" onClick={signup}>
              {heroCopy[role].cta}
            </button>
            <button type="button" className="header__burger" aria-label="Открыть меню" onClick={() => setMenu(true)}>
              <Menu size={22} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <Dialog.Root open={menu} onOpenChange={setMenu}>
        <Dialog.Portal>
          <Dialog.Overlay className="ns-overlay" />
          <Dialog.Content className="sheet" aria-describedby={undefined}>
            <div className="sheet__head">
              <Logo className="sheet__logo" />
              <Dialog.Close className="ns__close" aria-label="Закрыть меню">
                <X size={20} strokeWidth={1.75} aria-hidden="true" />
              </Dialog.Close>
            </div>
            <Dialog.Title className="visually-hidden">Меню</Dialog.Title>
            <div className="sheet__roles" role="group" aria-label="Кто вы">
              <button type="button" aria-pressed={role === 'candidate'} onClick={() => onRole('candidate')}>Ищу работу</button>
              <button type="button" aria-pressed={role === 'hotel'} onClick={() => onRole('hotel')}>Ищу сотрудников</button>
            </div>
            <nav aria-label="Основное меню">
              <ul className="sheet__nav">
                {mainNav.map((n) => (
                  <li key={n.label}>
                    <a href={n.href} onClick={() => setMenu(false)}>{n.label}</a>
                  </li>
                ))}
                {audienceLinks.map((a) => (
                  <li key={a.label}>
                    <a
                      href={a.href}
                      onClick={() => {
                        if (a.role) onRole(a.role);
                        setMenu(false);
                      }}
                    >
                      {a.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="sheet__actions">
              <button type="button" className="btn btn--red btn--lg" onClick={() => { setMenu(false); signup(); }}>
                {heroCopy[role].cta}
              </button>
              <button type="button" className="btn btn--soft btn--lg" onClick={() => { setMenu(false); openNext(flows.login); }}>
                Войти
              </button>
              <button type="button" className="btn btn--line btn--lg" onClick={() => { setMenu(false); openNext(flows.language); }}>
                <Globe size={18} strokeWidth={1.75} aria-hidden="true" /> Русский
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function LanguageMenu() {
  const openNext = useNextStep();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="topbar__lang">
        <Globe size={15} strokeWidth={1.75} aria-hidden="true" /> RU <ChevronDown size={14} aria-hidden="true" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="menu" align="end" sideOffset={6}>
          {languages.map((l) => (
            <DropdownMenu.Item
              key={l.code}
              className="menu__item"
              onSelect={() => !l.ready && openNext(flows.language)}
            >
              <span>{l.name}</span>
              {l.ready ? <Check size={16} aria-label="выбран" /> : <span className="menu__soon">скоро</span>}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
