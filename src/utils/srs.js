/**
 * SRS Algorithm — SM-2 variant with Again/Hard/Good/Easy ratings.
 *
 * Card shape:
 *   lastSeen:       ISO date string | null
 *   nextDue:        ISO date string | null
 *   interval:       days (0 = new/learning)
 *   easeFactor:     float (min 1.3)
 *   streak:         consecutive correct answers
 *   timesCorrect:   total correct answers
 *   timesIncorrect: total incorrect answers
 *   status:         'new' | 'learning' | 'reviewing' | 'mastered'
 */

export const DEFAULT_CARD = {
  lastSeen: null,
  nextDue: null,
  interval: 0,
  easeFactor: 2.5,
  streak: 0,
  timesCorrect: 0,
  timesIncorrect: 0,
  status: 'new',
};

function today() {
  return new Date().toISOString().split('T')[0];
}

function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/**
 * Process a rating and return the updated card.
 *
 * 'again' — interval=1, ease-=0.2, streak resets
 * 'hard'  — interval stays (min 1), ease-=0.15, streak resets
 * 'good'  — interval = (first: 1, else round(interval*ease)), ease unchanged, streak++
 * 'easy'  — interval = (first: 3, else round(interval*ease*1.3)), ease+=0.15, streak++
 *
 * Status thresholds: interval>=90 → mastered, interval>0 → reviewing, else → learning
 */
export function processRating(card, rating) {
  let { interval, easeFactor, streak, timesCorrect, timesIncorrect } = card;

  switch (rating) {
    case 'again':
      interval = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      streak = 0;
      timesIncorrect += 1;
      break;
    case 'hard':
      interval = Math.max(1, interval);
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      streak = 0;
      timesCorrect += 1;
      break;
    case 'good':
      interval = interval === 0 ? 1 : Math.round(interval * easeFactor);
      streak += 1;
      timesCorrect += 1;
      break;
    case 'easy':
      interval = interval === 0 ? 3 : Math.round(interval * easeFactor * 1.3);
      easeFactor = Math.min(4.0, easeFactor + 0.15);
      streak += 1;
      timesCorrect += 1;
      break;
    default:
      break;
  }

  const status =
    interval >= 90 ? 'mastered' :
    interval > 0   ? 'reviewing' :
                     'learning';

  return {
    ...card,
    interval,
    easeFactor: Math.round(easeFactor * 1000) / 1000,
    streak,
    timesCorrect,
    timesIncorrect,
    status,
    lastSeen: today(),
    nextDue: addDays(interval),
  };
}

/**
 * Returns true if the card is due for review today.
 */
export function isDue(card) {
  if (!card.nextDue) return true;
  return card.nextDue <= today();
}
