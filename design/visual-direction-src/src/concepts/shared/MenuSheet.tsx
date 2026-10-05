import { useState } from 'react';
import { Dialog } from 'radix-ui';
import { Menu, X } from 'lucide-react';
import { primaryNav, type NavItem, type Role } from '../../homepage/data/content';
import { flows } from '../../homepage/data/flows';
import { useNextStep } from './NextStep';

interface Props {
  role: Role;
  onRoleChange: (role: Role) => void;
  className?: string;
}

/** Phone menu: the seven TZ menu items, language, login and registration. Styled by --dlg-* tokens. */
export function MenuSheet({ role, onRoleChange, className }: Props) {
  const [open, setOpen] = useState(false);
  const openNext = useNextStep();

  const go = (item: NavItem) => {
    if (item.role) onRoleChange(item.role);
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={className} aria-label="Меню">
        <Menu size={22} aria-hidden="true" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="c-dialog-overlay" />
        <Dialog.Content className="c-sheet" aria-describedby={undefined}>
          <div className="c-sheet__head">
            <Dialog.Title className="c-sheet__title">Меню</Dialog.Title>
            <Dialog.Close className="c-dialog__close" aria-label="Закрыть меню">
              <X size={22} aria-hidden="true" />
            </Dialog.Close>
          </div>
          <nav aria-label="Основное меню">
            <ul className="c-sheet__nav">
              {primaryNav.map((item) => (
                <li key={item.label}>
                  <a href={item.href} onClick={() => go(item)} aria-current={item.role === role ? 'true' : undefined}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="c-sheet__actions">
            <button type="button" onClick={() => { setOpen(false); openNext(flows.language); }}>
              Язык: русский
            </button>
            <button type="button" onClick={() => { setOpen(false); openNext(flows.login); }}>
              Войти
            </button>
            <button
              type="button"
              className="c-sheet__primary"
              onClick={() => { setOpen(false); openNext(role === 'hotel' ? flows.hotelSignup : flows.candidateSignup); }}
            >
              Регистрация
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
