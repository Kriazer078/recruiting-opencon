import { useEffect, useState } from 'react';
import { Dialog, DropdownMenu } from 'radix-ui';
import { Check, ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { flows, useNextStep } from '../components/NextStep';
import { languages, primaryNav, type NavItem, type Role } from '../data/content';
import { cx } from '../lib/cx';
import './site-header.css';

interface Props {
  role: Role;
  onRoleChange: (role: Role) => void;
}

export function SiteHeader({ role, onRoleChange }: Props) {
  const openNext = useNextStep();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onNav = (item: NavItem) => {
    if (item.role) onRoleChange(item.role);
    setMenuOpen(false);
  };

  const signup = () => openNext(role === 'candidate' ? flows.candidateSignup : flows.hotelSignup);

  return (
    <header className={cx('site-header', scrolled && 'is-scrolled')}>
      <div className="container site-header__bar">
        <a href="#top" className="site-header__brand" aria-label="Open Consulting — на главную">
          <Logo className="site-header__logo" />
        </a>

        <nav className="site-header__nav" aria-label="Основное меню">
          <ul>
            {primaryNav.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => onNav(item)}
                  aria-current={item.role && item.role === role ? 'true' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <LanguageMenu />
          <button type="button" className="site-header__login" onClick={() => openNext(flows.login)}>
            Войти
          </button>
          <Button variant="quiet" className="site-header__signup" onClick={signup}>
            Регистрация
          </Button>

          <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <Dialog.Trigger asChild>
              <button type="button" className="site-header__menu-button" aria-label="Открыть меню">
                <Menu size={22} />
                <span>Меню</span>
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="menu-sheet-overlay" />
              <Dialog.Content className="menu-sheet" aria-describedby={undefined}>
                <div className="menu-sheet__top">
                  <Logo className="site-header__logo" />
                  <Dialog.Close className="menu-sheet__close" aria-label="Закрыть меню">
                    <X size={22} />
                  </Dialog.Close>
                </div>
                <Dialog.Title className="visually-hidden">Меню</Dialog.Title>
                <div className="menu-sheet__roles">
                  {(['candidate', 'hotel'] as const).map((r) => (
                    <a
                      key={r}
                      href="#top"
                      className={cx('menu-sheet__role', r === role && 'is-current')}
                      onClick={() => {
                        onRoleChange(r);
                        setMenuOpen(false);
                      }}
                    >
                      <span className="t-h3">{r === 'candidate' ? 'Ищу работу' : 'Ищу сотрудников'}</span>
                      <span className="t-small">
                        {r === 'candidate' ? 'Кандидатам из Казахстана' : 'Отелям Турции'}
                      </span>
                      <ArrowRight size={20} aria-hidden="true" />
                    </a>
                  ))}
                </div>
                <nav aria-label="Разделы">
                  <ul className="menu-sheet__nav">
                    {primaryNav
                      .filter((i) => !i.role)
                      .map((item) => (
                        <li key={item.label}>
                          <a href={item.href} onClick={() => onNav(item)}>
                            {item.label}
                          </a>
                        </li>
                      ))}
                  </ul>
                </nav>
                <div className="menu-sheet__actions">
                  <Button variant="secondary" block onClick={() => { setMenuOpen(false); openNext(flows.login); }}>
                    Войти
                  </Button>
                  <Button variant="quiet" block onClick={() => { setMenuOpen(false); signup(); }}>
                    Регистрация
                  </Button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}

function LanguageMenu() {
  const openNext = useNextStep();
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger className="lang-trigger" aria-label="Язык сайта: русский">
        RU <ChevronDown size={14} aria-hidden="true" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="lang-menu" align="end" sideOffset={8}>
          {languages.map((l) => (
            <DropdownMenu.Item
              key={l.code}
              className="lang-menu__item"
              onSelect={() => !l.ready && openNext(flows.language)}
            >
              <span lang={l.code === 'KZ' ? 'kk' : l.code.toLowerCase()}>{l.name}</span>
              {l.ready ? (
                <Check size={16} aria-label="выбран" />
              ) : (
                <span className="lang-menu__soon">готовится</span>
              )}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
