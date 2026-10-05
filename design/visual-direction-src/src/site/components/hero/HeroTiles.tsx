import { forwardRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { typo } from '../../../homepage/lib/typography';
import { photos as cdn, srcSet as cdnSrcSet } from '../../../homepage/data/media';
import { localPhotos } from '../../../concepts/shared/photos';
import { heroCopy } from '../../data/site';
import { formatNumber, minSalaryFor, plural, professions, vacancies } from '../../data/vacancies';
import { Facts, HeroSearch, RoleTabs, type HeroProps } from './parts';
import './tiles.css';

interface Tile {
  profession: (typeof professions)[number];
  src: string;
  srcSet?: string;
  focal: string;
  credit: string;
}

const tiles: Tile[] = [
  { profession: 'Официант', src: cdn.waiterCoffee.build(640), srcSet: cdnSrcSet(cdn.waiterCoffee, [480, 800]), focal: '42% 36%', credit: cdn.waiterCoffee.author },
  { profession: 'Горничная', src: cdn.housekeeperPillow.build(640), srcSet: cdnSrcSet(cdn.housekeeperPillow, [480, 800]), focal: '46% 34%', credit: cdn.housekeeperPillow.author },
  { profession: 'Повар', src: cdn.cookPortrait.build(640), srcSet: cdnSrcSet(cdn.cookPortrait, [480, 800]), focal: '52% 30%', credit: cdn.cookPortrait.author },
  { profession: 'Ресепшен', src: localPhotos.reception.src, focal: '70% 30%', credit: localPhotos.reception.author },
];

const others = professions.filter((p) => !tiles.some((t) => t.profession === p)).slice(0, 5);
const countFor = (p: string) => vacancies.filter((v) => v.profession === p).length;

/**
 * B · «Профессии». A white page whose first object is the search line in an ink frame;
 * below it, the four most common hotel jobs as photo tiles with the salary floor — browsing by
 * profession the way large portals do, with real people at work instead of icons.
 */
export const HeroTiles = forwardRef<HTMLFormElement, HeroProps>(function HeroTiles(props, ref) {
  const c = heroCopy[props.role];
  const pick = (p: string) => {
    props.onQuery(p);
    if (props.role === 'candidate') props.onSearch(p);
  };

  return (
    <section className="hero hero-tiles" aria-labelledby="hero-title">
      <div className="wrap">
        <RoleTabs role={props.role} onRole={props.onRole} tone="light" />
        <div className="tiles-head">
          <h1 id="hero-title" className="tiles-head__title">
            {typo(c.title)}
          </h1>
          <p className="tiles-head__lead">{typo(c.lead)}</p>
        </div>

        <HeroSearch ref={ref} id="hero" tone="light" framed {...props} />
        <Facts tone="light" />

        <div className="ptiles">
          <div className="ptiles__head">
            <h2 className="ptiles__title">{props.role === 'hotel' ? 'Кого чаще ищут отели' : 'Популярные профессии'}</h2>
            <span className="tag-demo">Пример</span>
          </div>
          <ul className="ptiles__grid">
            {tiles.map((t) => {
              const min = minSalaryFor(t.profession);
              const n = countFor(t.profession);
              return (
                <li key={t.profession}>
                  <button type="button" className="ptile" onClick={() => pick(t.profession)}>
                    <span className="ptile__photo">
                      <img src={t.src} srcSet={t.srcSet} sizes="(min-width: 1024px) 240px, 45vw" alt="" loading="lazy" style={{ objectPosition: t.focal }} />
                    </span>
                    <span className="ptile__name">{t.profession}</span>
                    <span className="ptile__meta num">
                      {min !== null && <>от {formatNumber(min)} ₺</>}
                      {n > 0 && <> · {n} {plural(n, 'вакансия', 'вакансии', 'вакансий')}</>}
                    </span>
                  </button>
                </li>
              );
            })}
            <li className="ptiles__rest">
              <p className="ptiles__rest-title">Ещё профессии</p>
              <ul>
                {others.map((p) => (
                  <li key={p}>
                    <button type="button" onClick={() => pick(p)}>
                      {p}
                      <ArrowRight size={15} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
          <p className="ptiles__credit">
            Фото: {[...new Set(tiles.map((t) => t.credit))].join(', ')} — Pexels, Pixabay. Люди на фото — модели, не кандидаты.
          </p>
        </div>
      </div>
    </section>
  );
});
