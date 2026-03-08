import { useState, useEffect } from 'react';

/**
 * Loads word data from JSON files.
 * Currently loads the sample file; extend to load multiple files as needed.
 */
export function useWordLoader() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const modules = await Promise.all([
          import('../data/words-001.json'),
          import('../data/words-002.json'),
          import('../data/words-003.json'),
          import('../data/words-004.json'),
          import('../data/words-005.json'),
          import('../data/words-006.json'),
          import('../data/words-007.json'),
          import('../data/words-008.json'),
          import('../data/words-009.json'),
          import('../data/words-010.json'),
        ]);
        setWords(modules.flatMap(m => m.default));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { words, loading, error };
}
