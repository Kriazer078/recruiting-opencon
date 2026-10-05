import { forwardRef } from 'react';
import { typo } from '../../../homepage/lib/typography';
import { localPhotos } from '../../../concepts/shared/photos';
import { heroCopy } from '../../data/site';
import { Credit, Facts, HeroSearch, QuickLinks, RoleTabs, type HeroProps } from './parts';
import './cover.css';

const photo = localPhotos.reception;

/**
 * A · «Обложка». The category's own first screen (HH, Enbek): one real photograph of hotel work
 * across the whole panel, a dark ink shade for the text, the search line on top. Red only on «Найти».
 */
export const HeroCover = forwardRef<HTMLFormElement, HeroProps>(function HeroCover(props, ref) {
  const c = heroCopy[props.role];
  return (
    <section className="hero hero-cover" aria-labelledby="hero-title">
      <div className="wrap">
        <div className="cover">
          <img
            className="cover__img"
            src={photo.src}
            srcSet={photo.srcSet}
            sizes="(min-width: 1344px) 1280px, 100vw"
            alt={photo.alt}
            fetchPriority="high"
          />
          <div className="cover__shade" aria-hidden="true" />

          <div className="cover__body">
            <RoleTabs role={props.role} onRole={props.onRole} tone="dark" />
            <h1 id="hero-title" className="cover__title">
              {typo(c.title)}
            </h1>
            <p className="cover__lead">{typo(c.lead)}</p>
            <HeroSearch ref={ref} id="hero" tone="dark" {...props} />
            <QuickLinks tone="dark" {...props} />
          </div>

          <div className="cover__foot">
            <Facts tone="dark" />
            <Credit tone="dark" author={photo.author} site={photo.site} page={photo.page} />
          </div>
        </div>
      </div>
    </section>
  );
});
