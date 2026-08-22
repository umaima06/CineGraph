function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

const GRADIENTS = [
  "linear-gradient(160deg, #4a0f1c 0%, #150406 75%)",
  "linear-gradient(160deg, #5a1206 0%, #170502 75%)",
  "linear-gradient(160deg, #3d1a45 0%, #120714 75%)",
  "linear-gradient(160deg, #123f30 0%, #04140e 75%)",
  "linear-gradient(160deg, #4a3308 0%, #150e02 75%)",
  "linear-gradient(160deg, #1c2350 0%, #05071a 75%)",
  "linear-gradient(160deg, #601a2e 0%, #180509 75%)",
];

function posterGradient(id) {
  return GRADIENTS[hashString(id) % GRADIENTS.length];
}

export function MovieCard({ movie, onClick }) {
  const clickable = typeof onClick === "function";

  return (
    <article
      className={`poster-card${clickable ? " clickable" : ""}`}
      onClick={onClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick();
            }
          : undefined
      }
    >
      <div className="poster-art" style={{ background: posterGradient(movie.id || movie.title) }}>
        <span className="poster-monogram">{movie.title?.[0]}</span>
        {movie.matchingTastes != null && (
          <span className="poster-badge">{movie.matchingTastes} match{movie.matchingTastes === 1 ? "" : "es"}</span>
        )}
        {movie.score != null && (
          <span className="poster-badge">{movie.score} link{movie.score === 1 ? "" : "s"}</span>
        )}
      </div>
      <div className="poster-info">
        <h3 className="poster-title">{movie.title}</h3>
        <div className="poster-meta">
          <span>{movie.year}</span>
          {movie.director && <span>· {movie.director}</span>}
        </div>
        {movie.genres?.length > 0 && (
          <div className="poster-meta">
            {movie.genres.slice(0, 2).map((g) => (
              <span key={g} className="genre-tag">{g}</span>
            ))}
          </div>
        )}
        {movie.reasons?.length > 0 && (
          <p className="reason">Linked via {movie.reasons.map((r) => r.via).join(", ")}</p>
        )}
      </div>
    </article>
  );
}