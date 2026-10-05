import logoOnLight from '../assets/brand/logo-on-light.png';
import logoOnDark from '../assets/brand/logo-on-dark.png';

/** Official Open Consulting logo, cropped copies of the supplied PNG (originals untouched). */
export function Logo({ tone = 'light', className }: { tone?: 'light' | 'dark'; className?: string }) {
  return (
    <img
      className={className}
      src={tone === 'light' ? logoOnLight : logoOnDark}
      width={899}
      height={233}
      alt="Open Consulting"
      decoding="async"
    />
  );
}
