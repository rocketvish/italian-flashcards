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
 * Status thresholds: interval>=90 → mastered (30 for priority), interval>0 → reviewing, else → learning
 * isPriority: caps interval at 30 days and lowers mastered threshold to 30
 *
 * Quick Sort special ratings (bypass normal SRS logic):
 *   'know'  — immediately mastered, 30-day interval
 *   'learn' — starts learning, 1-day interval
 */
export function processRating(card, rating, isPriority = false) {
  let { interval, easeFactor, streak, timesCorrect, timesIncorrect } = card;

  if (rating === 'know') {
    return {
      ...card,
      interval: 30,
      easeFactor,
      streak: streak + 1,
      timesCorrect: timesCorrect + 1,
      timesIncorrect,
      status: 'mastered',
      lastSeen: today(),
      nextDue: addDays(30),
    };
  }

  if (rating === 'learn') {
    return {
      ...card,
      interval: 1,
      easeFactor,
      streak: 0,
      timesCorrect,
      timesIncorrect,
      status: 'learning',
      lastSeen: today(),
      nextDue: addDays(1),
    };
  }

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

  const masteredThreshold = isPriority ? 30 : 90;
  if (isPriority) interval = Math.min(interval, 30);

  const status =
    interval >= masteredThreshold ? 'mastered' :
    interval > 0                  ? 'reviewing' :
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
