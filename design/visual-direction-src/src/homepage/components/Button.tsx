import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../lib/cx';
import './button.css';

type Variant = 'primary' | 'secondary' | 'quiet' | 'inverse' | 'link';
type Size = 'md' | 'lg';

interface Common {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  block?: boolean;
  children: ReactNode;
}

type AsButton = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: AsButton | AsLink) {
  const { variant = 'primary', size = 'md', icon, block, children, className, ...rest } = props;
  const classes = cx('btn', `btn--${variant}`, `btn--${size}`, block && 'btn--block', className);
  const content = (
    <>
      <span className="btn__label">{children}</span>
      {icon && <span className="btn__icon" aria-hidden="true">{icon}</span>}
    </>
  );
  if (typeof rest.href === 'string') {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }
  const { type = 'button', ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
