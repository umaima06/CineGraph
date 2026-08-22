export function LoadingState({ label = "Loading" }) {
  return (
    <div className="state-block" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <h3>{label}…</h3>
      <p>Walking the graph for you.</p>
    </div>
  );
}

export function EmptyState({ title, body }) {
  return (
    <div className="state-block">
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state-block error-block">
      <h3>Couldn't load that</h3>
      <p>{message || "The database didn't respond. Check your connection and try again."}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: 16,
            background: "transparent",
            border: "1px solid var(--line)",
            color: "var(--paper)",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      )}
    </div>
  );
}
