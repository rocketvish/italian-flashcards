import { useState } from 'react';

export default function ReportErrorButton({ word }) {
  const [reported, setReported] = useState(false);

  function handleReport() {
    // Placeholder: in production this would send a report to a backend or store locally
    const report = {
      wordId: word.id,
      italian: word.italian,
      timestamp: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('error-reports') ?? '[]');
    existing.push(report);
    localStorage.setItem('error-reports', JSON.stringify(existing));
    setReported(true);
    setTimeout(() => setReported(false), 3000);
  }

  return (
    <button
      className="btn btn-ghost btn-sm"
      onClick={handleReport}
      title="Report an error in this card"
      aria-label="Report an error"
    >
      {reported ? '✓ Reported' : '⚑ Report error'}
    </button>
  );
}
