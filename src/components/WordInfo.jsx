const POS_LABELS = {
  noun: 'Noun',
  verb: 'Verb',
  adjective: 'Adj',
  adverb: 'Adv',
  preposition: 'Prep',
  article: 'Article',
  pronoun: 'Pronoun',
  conjunction: 'Conj',
  interjection: 'Interj',
};

export default function WordInfo({ word }) {
  const { partOfSpeech, gender, plural, irregular } = word;

  return (
    <div className="word-info">
      {partOfSpeech && (
        <span className="badge badge-pos">{POS_LABELS[partOfSpeech] ?? partOfSpeech}</span>
      )}
      {gender && (
        <span className={`badge badge-gender badge-${gender}`}>
          {gender === 'masculine' ? 'masc.' : 'fem.'}
        </span>
      )}
      {plural && (
        <span className="badge badge-plural">pl: {plural}</span>
      )}
      {irregular && (
        <span className="badge badge-irregular">irregular</span>
      )}
    </div>
  );
}
