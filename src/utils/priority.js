/**
 * Priority words appear more frequently in SRS sessions and have a
 * capped maximum interval of 30 days (instead of the normal 90+ for mastery).
 *
 * Priority categories:
 *  - All pronouns
 *  - All articles
 *  - Irregular verbs from the core list
 */

const PRIORITY_VERBS = new Set([
  'essere', 'avere', 'andare', 'fare', 'stare',
  'dare', 'dire', 'venire', 'volere', 'potere',
  'dovere', 'sapere', 'uscire', 'bere', 'porre', 'tenere',
]);

export function isPriorityWord(word) {
  if (!word) return false;
  const pos = word.partOfSpeech;
  if (pos === 'pronoun') return true;
  if (pos === 'article') return true;
  if (pos === 'verb' && word.irregular && PRIORITY_VERBS.has(word.italian)) return true;
  return false;
}
