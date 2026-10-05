/**
 * Russian typesetting: short prepositions and conjunctions stay with the next word
 * («в отелях», «с условиями»), so headings never end with a hanging «в» or «с».
 */
const SHORT_WORDS = /(?<=^|[\s («])(в|во|с|со|и|к|ко|о|об|у|а|до|по|на|не|за|из|от|для|без|что|как|или|при)\s+/giu;

export function typo(text: string) {
  // a dash never starts a line: it stays with the previous word
  return text.replace(SHORT_WORDS, '$1 ').replace(/\s+—\s/g, ' — ');
}
