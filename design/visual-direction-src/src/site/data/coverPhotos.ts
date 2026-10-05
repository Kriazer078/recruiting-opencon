/**
 * Photo options for the «Обложка» first screen (variant A), offered for the user's choice
 * on 5 October 2026 after the reception photo was rejected. All real photographs, Pexels License,
 * loaded from the Pexels CDN. People shown are stock models, not candidates or partners.
 */
export interface CoverPhoto {
  id: string;
  name: string;
  alt: string;
  author: string;
  page: string;
  pexelsId: number;
  /** desktop crop: object-position, then a left-anchored zoom that moves the subject right of the text */
  desktop: { position: string; zoom: number; originY: string };
  /** phone photo band crop */
  phone: { position: string };
  /** a caution shown to the reviewer, not on the site */
  note?: string;
}

export const coverPhotos: CoverPhoto[] = [
  {
    id: 'waiter',
    name: 'Официант в зале',
    alt: 'Официант с подносом в зале ресторана отеля',
    author: 'Andrea Piacquadio',
    page: 'https://www.pexels.com/photo/waiter-with-tray-working-in-stylish-restaurant-3769740/',
    pexelsId: 3769740,
    desktop: { position: '50% 40%', zoom: 1.28, originY: '38%' },
    phone: { position: '58% 30%' },
  },
  {
    id: 'table',
    name: 'Сервировка в ресторане отеля',
    alt: 'Сотрудница ресторана отеля в форме сервирует стол',
    author: 'Western Skyline Hotel',
    page: 'https://www.pexels.com/photo/elegant-waitress-preparing-table-for-guests-4873361/',
    pexelsId: 4873361,
    desktop: { position: '50% 12%', zoom: 1.04, originY: '0%' },
    phone: { position: '66% 30%' },
    note: 'Автор на Pexels — аккаунт реального отеля (Ханой); подпись с названием отеля может читаться как партнёр',
  },
  {
    id: 'housekeeper',
    name: 'Горничная в номере',
    alt: 'Горничная в форме держит стопку чистых полотенец в номере отеля',
    author: 'cottonbro studio',
    page: 'https://www.pexels.com/photo/woman-holding-a-clean-towels-6466219/',
    pexelsId: 6466219,
    desktop: { position: '50% 30%', zoom: 1.1, originY: '30%' },
    phone: { position: '56% 18%' },
  },
];

export const DEFAULT_COVER_PHOTO = 'waiter';

const build = (id: number, w: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export function coverSrc(p: CoverPhoto) {
  return {
    src: build(p.pexelsId, 1920),
    srcSet: [960, 1440, 1920, 2560].map((w) => `${build(p.pexelsId, w)} ${w}w`).join(', '),
  };
}
