import { useState } from 'react';

const TENSE_LABELS = {
  presente: 'Presente',
  passatoProssimo: 'Passato Prossimo',
  imperfetto: 'Imperfetto',
  futuroSemplice: 'Futuro',
  condizionale: 'Condizionale',
  congiuntivoPresente: 'Congiuntivo',
};

const PRONOUNS = ['io', 'tu', 'lui', 'noi', 'voi', 'loro'];

export default function ConjugationTable({ conjugations, irregularForms }) {
  const tenses = Object.keys(conjugations ?? {});
  const [activeTense, setActiveTense] = useState(tenses[0] ?? '');

  if (!conjugations || tenses.length === 0) return null;

  const tenseData = conjugations[activeTense] ?? {};
  const irregulars = irregularForms?.[activeTense] ?? [];

  return (
    <div className="conjugation-table">
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

      <div className="conj-body">
        {activeTense === 'passatoProssimo' && tenseData.auxiliary && (
          <div className="conj-aux">
            aux: <strong>{tenseData.auxiliary}</strong> &nbsp;|&nbsp; pp:{' '}
            <strong className={irregulars.includes('pastParticiple') ? 'irregular' : ''}>
              {tenseData.pastParticiple}
            </strong>
          </div>
        )}
        <table className="conj-grid">
          <tbody>
            {PRONOUNS.map((pronoun) => (
              <tr key={pronoun}>
                <td className="conj-pronoun">{pronoun}</td>
                <td className={`conj-form ${irregulars.includes(pronoun) ? 'irregular' : ''}`}>
                  {tenseData[pronoun] ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
