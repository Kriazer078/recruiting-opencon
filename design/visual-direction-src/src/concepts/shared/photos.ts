/**
 * Local copies of three real photographs with verified sources (checked 5 October 2026,
 * see design/product-map/home/DIRECTIONS.md and HOME_SCREEN.md). Resized with ImageMagick, not edited.
 * Local files keep first screens working without the Pexels CDN.
 * People shown are stock models, not candidates, employees or partners of Open Consulting.
 */
import service2200 from '../assets/photos/service-2200.jpg';
import service1100 from '../assets/photos/service-1100.jpg';
import cafe2000 from '../assets/photos/cafe-2000.jpg';
import cafe1000 from '../assets/photos/cafe-1000.jpg';
import reception1280 from '../assets/photos/reception-1280.jpg';
import { photos as cdnPhotos, srcSet as cdnSrcSet, type PhotoKey } from '../../homepage/data/media';

export interface LocalPhoto {
  src: string;
  srcSet: string;
  alt: string;
  author: string;
  site: 'Pexels' | 'Pixabay';
  page: string;
  license: string;
  licenseUrl: string;
  /** width / height of the file */
  ratio: number;
}

export const localPhotos = {
  service: {
    src: service2200,
    srcSet: `${service1100} 1100w, ${service2200} 2200w`,
    alt: 'Официантка в фартуке несёт тарелку гостю в зале ресторана',
    author: 'Ketut Subiyanto',
    site: 'Pexels',
    page: 'https://www.pexels.com/photo/calm-waitress-with-plate-serving-restaurant-guest-4350080/',
    license: 'Pexels License',
    licenseUrl: 'https://www.pexels.com/license/',
    ratio: 1.5,
  },
  cafe: {
    src: cafe2000,
    srcSet: `${cafe1000} 1000w, ${cafe2000} 2000w`,
    alt: 'Сотрудница кафе улыбается за стойкой с кассовым терминалом',
    author: 'Andrea Piacquadio',
    site: 'Pexels',
    page: 'https://www.pexels.com/photo/cheerful-black-waitress-standing-at-counter-3801426/',
    license: 'Pexels License',
    licenseUrl: 'https://www.pexels.com/license/',
    ratio: 1.5,
  },
  reception: {
    src: reception1280,
    srcSet: `${reception1280} 1280w`,
    alt: 'Администраторы ресепшен отеля: сотрудница говорит по телефону, коллега работает за компьютером',
    author: 'Rodrigo Salomon',
    site: 'Pixabay',
    page: 'https://pixabay.com/photos/receptionists-phone-call-hotel-5975962/',
    license: 'Pixabay Content License',
    licenseUrl: 'https://pixabay.com/service/license-summary/',
    ratio: 1.5,
  },
} satisfies Record<string, LocalPhoto>;

export type LocalPhotoKey = keyof typeof localPhotos;

/**
 * Photos already registered for homepage v1 and loaded from the Pexels CDN.
 * Used only below the first screen; without network access the frame keeps its colour.
 */
export function cdnPhoto(key: PhotoKey, widths: readonly number[] = [480, 800, 1200]) {
  const p = cdnPhotos[key];
  return { src: p.build(800), srcSet: cdnSrcSet(p, widths), alt: p.alt, author: p.author, page: p.page, focal: p.focal };
}

export function credits(keys: LocalPhotoKey[], cdn: PhotoKey[] = []) {
  const list = [
    ...keys.map((k) => ({ author: localPhotos[k].author, site: localPhotos[k].site, page: localPhotos[k].page })),
    ...cdn.map((k) => ({ author: cdnPhotos[k].author, site: 'Pexels' as const, page: cdnPhotos[k].page })),
  ];
  const seen = new Set<string>();
  return list.filter((c) => (seen.has(c.author) ? false : (seen.add(c.author), true)));
}
