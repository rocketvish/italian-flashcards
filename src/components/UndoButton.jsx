export default function UndoButton({ onUndo, disabled }) {
  return (
    <button
      className="btn btn-icon"
      onClick={onUndo}
      disabled={disabled}
      title="Undo last answer"
      aria-label="Undo last answer"
    >
      ↩ Undo
    </button>
  );
}
