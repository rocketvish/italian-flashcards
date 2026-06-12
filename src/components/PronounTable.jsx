import { useState } from 'react';

/**
 * Full Italian pronoun paradigm table.
 * Highlights whichever cell(s) match the current word's Italian form.
 */

const ROWS = [
  { label: '1st sg',      subject: 'io',       direct: 'mi',    indirect: 'mi',    reflexive: 'mi', stressed: 'me' },
  { label: '2nd sg',      subject: 'tu',       direct: 'ti',    indirect: 'ti',    reflexive: 'ti', stressed: 'te' },
  { label: '3rd sg',      subject: 'lui / lei', direct: 'lo / la', indirect: 'gli / le', reflexive: 'si', stressed: 'lui / lei' },
  { label: '3rd sg (Lei)', subject: 'Lei',      direct: 'La',    indirect: 'Le',    reflexive: 'si', stressed: 'Lei' },
  { label: '1st pl',      subject: 'noi',      direct: 'ci',    indirect: 'ci',    reflexive: 'ci', stressed: 'noi' },
  { label: '2nd pl',      subject: 'voi',      direct: 'vi',    indirect: 'vi',    reflexive: 'vi', stressed: 'voi' },
  { label: '3rd pl',      subject: 'loro',     direct: 'li / le', indirect: 'gli', reflexive: 'si', stressed: 'loro' },
];

const COLUMNS = [
  { key: 'subject',  label: 'Subject' },
  { key: 'direct',   label: 'Direct' },
  { key: 'indirect', label: 'Indirect' },
  { key: 'reflexive',label: 'Refl.' },
  { key: 'stressed', label: 'Stressed' },
];

function cellMatches(cellValue, wordItalian) {
  if (!wordItalian) return false;
  const needle = wordItalian.trim().toLowerCase();
  return cellValue
    .split('/')
    .map((s) => s.trim().toLowerCase())
    .some((v) => v === needle);
}

function stopProp(e) { e.stopPropagation(); }

export default function PronounTable({ word }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="pronoun-table-wrap" onClick={stopProp} onTouchStart={stopProp} onTouchEnd={stopProp}>
      <button
        className="expand-toggle"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? 'Hide Forms' : 'Show Forms'}
      </button>

      {open && (
        <div className="pronoun-table-scroll">
          <table className="pronoun-table">
            <thead>
              <tr>
                <th className="pronoun-th pronoun-th-label" />
                {COLUMNS.map((col) => (
                  <th key={col.key} className="pronoun-th">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label}>
                  <td className="pronoun-row-label">{row.label}</td>
                  {COLUMNS.map((col) => {
                    const val = row[col.key];
                    const highlight = cellMatches(val, word.italian);
                    return (
                      <td
                        key={col.key}
                        className={`pronoun-cell ${highlight ? 'pronoun-cell--highlight' : ''}`}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
