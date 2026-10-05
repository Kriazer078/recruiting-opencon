import { forwardRef } from 'react';
import type { HeroProps } from './hero/parts';
import { HeroCover } from './hero/HeroCover';
import { HeroTiles } from './hero/HeroTiles';
import { HeroFresh } from './hero/HeroFresh';
import { HeroSplit } from './hero/HeroSplit';
import './hero/variant-bar.css';

export type HeroVariant = 'cover' | 'tiles' | 'fresh' | 'split';

/** First-screen variants offered for the user's choice (5 October 2026). None is approved yet. */
export const heroVariants: { id: HeroVariant; letter: string; name: string; idea: string }[] = [
  { id: 'cover', letter: 'A', name: 'Обложка', idea: 'Фото отеля на всю панель, поиск поверх — канон HH и Enbek' },
  { id: 'tiles', letter: 'B', name: 'Профессии', idea: 'Светлый экран, поиск в раме, профессии с фото' },
  { id: 'fresh', letter: 'C', name: 'Вакансии сразу', idea: 'Поиск и рядом свежие вакансии с зарплатой и условиями' },
  { id: 'split', letter: 'D', name: 'Два входа', idea: '«Ищу работу» и «Я работодатель» рядом, как у Enbek' },
];

export const DEFAULT_HERO: HeroVariant = 'cover';

export function isHeroVariant(v: string | null): v is HeroVariant {
  return heroVariants.some((h) => h.id === v);
}

export const Hero = forwardRef<HTMLFormElement, HeroProps & { variant: HeroVariant; photo?: string }>(function Hero(
  { variant, photo, ...props },
  ref,
) {
  switch (variant) {
    case 'tiles':
      return <HeroTiles ref={ref} {...props} />;
    case 'fresh':
      return <HeroFresh ref={ref} {...props} />;
    case 'split':
      return <HeroSplit ref={ref} {...props} />;
    default:
      return <HeroCover ref={ref} photo={photo} {...props} />;
  }
});

/** Floating switch to compare the variants; shown only with ?hero= or ?compare=1 in the address. */
export function HeroVariantBar({ value, onChange }: { value: HeroVariant; onChange: (v: HeroVariant) => void }) {
  const current = heroVariants.find((h) => h.id === value)!;
  return (
    <div className="vbar" role="region" aria-label="Сравнение вариантов первого экрана">
      <p className="vbar__note">
        <strong>Первый экран, вариант {current.letter}.</strong> {current.idea}
      </p>
      <div className="vbar__options" role="group" aria-label="Вариант">
        {heroVariants.map((h) => (
          <button key={h.id} type="button" aria-pressed={h.id === value} onClick={() => onChange(h.id)}>
            <span className="vbar__letter">{h.letter}</span> {h.name}
          </button>
        ))}
      </div>
    </div>
  );
}
