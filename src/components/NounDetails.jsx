import { useState } from 'react';

/**
 * Computes the Italian definite article for a noun.
 * Rules (singular):
 *   Masculine: lo before s+cons, z, ps, gn, x, y; il otherwise; l' before vowel
 *   Feminine:  la; l' before vowel
 * Plural:
 *   Masculine: gli (before vowel, s+cons, z, ps, gn, x, y); i otherwise
 *   Feminine:  le
 */
function getArticle(form, gender, plural = false) {
  if (!form) return '';
  const first = form.trim().toLowerCase();

  const startsWithVowel = /^[aeiouàèéìíòóùú]/.test(first);
  const startsWithSCons = /^s[bcdfghlmnpqrstvz]/.test(first);
  const startsWithSpecial = /^(z|ps|gn|x|y)/.test(first);
  const needsLo = startsWithSCons || startsWithSpecial;

  if (gender === 'feminine') {
    if (plural) return 'le';
    return startsWithVowel ? "l'" : 'la';
  }

  // masculine
  if (plural) {
    return (startsWithVowel || needsLo) ? 'gli' : 'i';
  }
  if (startsWithVowel) return "l'";
  if (needsLo) return 'lo';
  return 'il';
}

function stopProp(e) { e.stopPropagation(); }

export default function NounDetails({ word }) {
  const [open, setOpen] = useState(false);
  const { italian, plural, gender, irregular } = word;

  const singularArticle = getArticle(italian, gender, false);
  const pluralArticle   = plural ? getArticle(plural, gender, true) : null;

  return (
    <div className="noun-details-wrap" onClick={stopProp} onTouchStart={stopProp} onTouchEnd={stopProp}>
      <button
        className="expand-toggle"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? 'Hide Details' : 'Show Details'}
      </button>

      {open && (
        <div className="noun-details-panel">
          <div className="noun-detail-row">
            <span className="noun-detail-label">Gender</span>
            <span className={`badge badge-gender badge-${gender}`}>
              {gender === 'masculine' ? 'masculine' : 'feminine'}
            </span>
          </div>

          <div className="noun-detail-row">
            <span className="noun-detail-label">Singular</span>
            <span className="noun-detail-value">
              <span className="noun-article">{singularArticle}</span>
              {' '}{italian}
            </span>
          </div>

          {plural && (
            <div className="noun-detail-row">
              <span className="noun-detail-label">Plural</span>
              <span className="noun-detail-value">
                <span className="noun-article">{pluralArticle}</span>
                {' '}{plural}
                {irregular && <span className="badge badge-irregular noun-irreg-badge">irregular</span>}
              </span>
            </div>
          )}

          {!plural && (
            <div className="noun-detail-row">
              <span className="noun-detail-label">Plural</span>
              <span className="noun-detail-value noun-detail-muted">—</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
