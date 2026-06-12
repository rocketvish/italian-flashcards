import { useState } from 'react';

const TENSE_LABELS = {
  presente:            'Presente',
  passatoProssimo:     'Passato Prossimo',
  imperfetto:          'Imperfetto',
  futuroSemplice:      'Futuro',
  condizionale:        'Condizionale',
  congiuntivoPresente: 'Congiuntivo',
};

const PRONOUNS = ['io', 'tu', 'lui', 'noi', 'voi', 'loro'];

export default function ConjugationTable({ conjugations, irregularForms }) {
  const tenses = Object.keys(conjugations ?? {});
  const [activeTense, setActiveTense] = useState(tenses[0] ?? '');

  if (!conjugations || tenses.length === 0) return null;

  function stopProp(e) { e.stopPropagation(); }

  return (
    <div className="conjugation-table" onClick={stopProp} onTouchStart={stopProp} onTouchEnd={stopProp}>

      {/* Mobile: tab bar to switch tenses */}
      <div className="conj-tabs">
        {tenses.map((t) => (
          <button
            key={t}
            className={`conj-tab ${t === activeTense ? 'conj-tab--active' : ''}`}
            onClick={() => setActiveTense(t)}
          >
            {TENSE_LABELS[t] ?? t}
          </button>
        ))}
      </div>

      {/* All tense blocks: CSS shows active-only on mobile, all on desktop */}
      <div className="conj-all-tenses">
        {tenses.map((t) => {
          const data     = conjugations[t] ?? {};
          const irreguls = irregularForms?.[t] ?? [];
          return (
            <div key={t} className={`conj-tense-block ${t === activeTense ? 'conj-tense-block--active' : ''}`}>
              <div className="conj-tense-name">{TENSE_LABELS[t] ?? t}</div>
              {t === 'passatoProssimo' && data.auxiliary && (
                <div className="conj-aux">
                  aux: <strong>{data.auxiliary}</strong> &nbsp;|&nbsp; pp:{' '}
                  <strong className={irreguls.includes('pastParticiple') ? 'irregular' : ''}>
                    {data.pastParticiple}
                  </strong>
                </div>
              )}
              <table className="conj-grid">
                <tbody>
                  {PRONOUNS.map((pronoun) => (
                    <tr key={pronoun}>
                      <td className="conj-pronoun">{pronoun}</td>
                      <td className={`conj-form ${irreguls.includes(pronoun) ? 'irregular' : ''}`}>
                        {data[pronoun] ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
