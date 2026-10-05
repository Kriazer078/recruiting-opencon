/**
 * Photography registry. Every image is a real photograph with a verified source.
 * People shown are stock models, not candidates, employees or partners of Open Consulting.
 * Replace with commissioned production photography before launch: only `src` builders change.
 */

export interface Photo {
  id: string;
  alt: string;
  author: string;
  page: string;
  license: 'Pexels License';
  /** CSS object-position focal point for crops */
  focal: string;
  /** intrinsic ratio of the source, width / height */
  ratio: number;
  build: (width: number) => string;
}

const PEXELS_LICENSE = 'https://www.pexels.com/license/';

function pexels(id: number) {
  return (width: number) =>
    `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}

function photo(
  key: string,
  pexelsId: number,
  author: string,
  slug: string,
  alt: string,
  focal: string,
  ratio: number,
): Photo {
  return {
    id: key,
    alt,
    author,
    page: `https://www.pexels.com/photo/${slug}-${pexelsId}/`,
    license: 'Pexels License',
    focal,
    ratio,
    build: pexels(pexelsId),
  };
}

export const licenseUrl = PEXELS_LICENSE;

export const photos = {
  waiterStanding: photo('waiterStanding', 3770093, 'Andrea Piacquadio', 'cheerful-restaurant-manager-looking-at-camera',
    'Сотрудник ресторана отеля в белой рубашке стоит в зале и смотрит в камеру', '47% 58%', 1.5),
  waiterCoffee: photo('waiterCoffee', 3770107, 'Andrea Piacquadio', 'hotel-servant-carrying-coffee-to-guest',
    'Официант несёт поднос с кофе в номер отеля', '28% 45%', 1.5),
  waiterLinen: photo('waiterLinen', 3770106, 'Andrea Piacquadio', 'hotel-staff-with-bed-linen',
    'Сотрудник отеля несёт стопку постельного белья', '30% 50%', 1.5),
  waiterTables: photo('waiterTables', 3770091, 'Andrea Piacquadio', 'male-employee-preparing-tables-in-restaurant',
    'Сотрудник ресторана накрывает столы', '58% 55%', 1.5),
  roomService: photo('roomService', 3770102, 'Andrea Piacquadio', 'male-servant-preparing-hotel-room-for-guests',
    'Сотрудник готовит номер отеля к заезду гостей', '62% 50%', 1.5),
  housekeeperSheets: photo('housekeeperSheets', 9462739, 'Liliana Drew', 'woman-wearing-a-uniform-changing-sheets',
    'Горничная в форме меняет постельное бельё', '50% 30%', 0.667),
  housekeeperPillow: photo('housekeeperPillow', 9462622, 'Liliana Drew', 'housekeeper-holding-a-pillow',
    'Горничная заправляет подушку в номере', '45% 30%', 0.667),
  housekeeperBed: photo('housekeeperBed', 9462616, 'Liliana Drew', 'woman-fixing-the-bedsheet-of-a-bed',
    'Горничная поправляет простыню', '50% 40%', 0.667),
  housekeeperRoom: photo('housekeeperRoom', 9462626, 'Liliana Drew', 'a-woman-putting-a-pillow-on-a-pillowcase',
    'Горничная надевает наволочку на подушку', '40% 40%', 1.5),
  cookPortrait: photo('cookPortrait', 8092346, 'Mikhail Nilov', 'woman-in-black-long-sleeve-wearing-apron',
    'Повар в фартуке у плиты на кухне', '52% 26%', 0.667),
  cookSteamer: photo('cookSteamer', 8092356, 'Mikhail Nilov', 'woman-holding-cover-of-steamer-in-kitchen',
    'Повар открывает пароварку на кухне', '50% 35%', 0.667),
  cookWorking: photo('cookWorking', 8092345, 'Mikhail Nilov', 'a-woman-in-an-apron-cooking',
    'Повар готовит на кухне ресторана', '50% 40%', 1.5),
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

export function srcSet(p: Photo, widths: readonly number[] = [480, 800, 1200, 1600]) {
  return widths.map((w) => `${p.build(w)} ${w}w`).join(', ');
}

/** Unique authors for the credits line in the footer. */
export function photoCredits() {
  const byAuthor = new Map<string, string>();
  Object.values(photos).forEach((p) => {
    if (!byAuthor.has(p.author)) byAuthor.set(p.author, p.page);
  });
  return [...byAuthor.entries()].map(([author, page]) => ({ author, page }));
}
