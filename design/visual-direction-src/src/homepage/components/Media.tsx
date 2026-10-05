import type { CSSProperties, ReactNode } from 'react';
import { photos, srcSet } from '../data/media';
import type { Crop } from '../data/candidates';
import { cx } from '../lib/cx';
import './media.css';

interface CropImageProps {
  crop: Crop;
  /** sizes attribute for responsive loading */
  sizes: string;
  /** frame aspect ratio (width / height); required for zoomed crops */
  frameRatio?: number;
  priority?: boolean;
  /** alt override; empty string marks the image decorative */
  alt?: string;
  className?: string;
}

/** "4 / 5" → 0.8 */
export function ratioOf(ratio: string) {
  const [w, h] = ratio.split('/').map((n) => Number(n.trim()));
  return w && h ? w / h : 1;
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/**
 * Geometry for a zoomed crop: the image keeps its own ratio, covers the frame,
 * is enlarged by `zoom` and shifted so the focal point sits as close to the centre as the edges allow.
 */
function zoomedStyle(focal: string, zoom: number, imageRatio: number, frameRatio: number): CSSProperties {
  const [fx = 50, fy = 50] = focal.split(' ').map((v) => parseFloat(v));
  const wider = imageRatio >= frameRatio;
  const width = (wider ? imageRatio / frameRatio : 1) * 100 * zoom;
  const height = (wider ? 1 : frameRatio / imageRatio) * 100 * zoom;
  return {
    position: 'absolute',
    width: `${width}%`,
    height: `${height}%`,
    left: `${clamp(50 - (fx / 100) * width, 100 - width, 0)}%`,
    top: `${clamp(50 - (fy / 100) * height, 100 - height, 0)}%`,
    maxWidth: 'none',
    objectFit: 'fill',
  };
}

/** A real photograph cropped by focal point and optional zoom. */
export function CropImage({ crop, sizes, frameRatio, priority, alt, className }: CropImageProps) {
  const p = photos[crop.photo];
  const zoom = crop.zoom ?? 1;
  const zoomed = zoom > 1 && frameRatio !== undefined;
  // zoomed crops need a denser source to stay sharp
  const widths = zoomed ? [800, 1600, 2400] : [480, 800, 1200, 1600];
  const style: CSSProperties = zoomed
    ? zoomedStyle(crop.focal, zoom, p.ratio, frameRatio)
    : ({ '--focal': crop.focal } as CSSProperties);
  return (
    <img
      className={cx('crop-image', zoomed && 'crop-image--zoomed', className)}
      src={p.build(zoomed ? 1600 : 1200)}
      srcSet={srcSet(p, widths)}
      sizes={sizes}
      alt={alt ?? p.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      style={style}
    />
  );
}

interface MediaFrameProps {
  /** CSS aspect-ratio, e.g. "4 / 5" */
  ratio?: string;
  chamfer?: 's' | 'm' | 'l' | 'none';
  className?: string;
  children: ReactNode;
  /** overlays rendered above the image */
  overlay?: ReactNode;
  label?: string;
}

/**
 * The Open Consulting frame: a media window with the bottom-left corner cut at 45°,
 * taken from the «O» of the logo. People are always shown inside this frame.
 */
export function MediaFrame({ ratio = '4 / 5', chamfer = 'm', className, children, overlay, label }: MediaFrameProps) {
  return (
    <figure
      className={cx('frame', `frame--chamfer-${chamfer}`, className)}
      style={{ aspectRatio: ratio }}
      aria-label={label}
    >
      <div className="frame__media">{children}</div>
      {overlay}
    </figure>
  );
}

/** Visible marker for demonstration content. Never omit it on invented data. */
export function DemoTag({ children = 'Пример', tone = 'paper' }: { children?: ReactNode; tone?: 'paper' | 'night' }) {
  return <span className={cx('demo-tag', `demo-tag--${tone}`)}>{children}</span>;
}
