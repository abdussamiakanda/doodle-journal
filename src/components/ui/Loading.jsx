export default function Loading({ message = "Loading..." }) {
  return (
    <div className="loading-wrap" role="status" aria-live="polite" aria-label="Loading">
      <div className="loading-spinner" aria-hidden="true" />
      <p className="loading-text">{message}</p>
    </div>
  );
}
