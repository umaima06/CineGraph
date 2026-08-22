import { useEffect, useState } from "react";
import { api } from "../api.js";
import { MovieCard } from "./MovieCard.jsx";
import { PosterRow } from "./PosterRow.jsx";
import { LoadingState, ErrorState, EmptyState } from "./StateBlock.jsx";

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash);
}
const BACKDROPS = [
  "linear-gradient(135deg, #5a0f1f 0%, #12040a 100%)",
  "linear-gradient(135deg, #63200a 0%, #150602 100%)",
  "linear-gradient(135deg, #451f52 0%, #0f0714 100%)",
  "linear-gradient(135deg, #144a38 0%, #041712 100%)",
];

function SimilarSection({ title, hint, movies, onSelectMovie }) {
  return (
    <>
      <div className="section-heading" style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: "1.05rem" }}><span className="live-dot" /> {title}</h2>
        <span className="hint">{hint}</span>
      </div>
      {movies.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          body={`No other seeded movie is connected this way.`}
        />
      ) : (
        <PosterRow>
          {movies.map((m) => (
            <MovieCard key={m.id} movie={m} onClick={() => onSelectMovie(m.id)} />
          ))}
        </PosterRow>
      )}
    </>
  );
}

export function MovieDetail({ movieId, onBack, onSelectMovie, onSelectActor }) {
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState({ byActor: [], byDirector: [], byGenre: [] });
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, [movieId]);

  async function load() {
    setStatus("loading");
    try {
      const [movieData, similarData] = await Promise.all([
        api.getMovie(movieId),
        api.getSimilarMovies(movieId),
      ]);
      setMovie(movieData);
      setSimilar(similarData);
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  if (status === "loading") return <LoadingState label="Loading movie" />;
  if (status === "error") return <ErrorState message={error} onRetry={load} />;
  if (!movie) return null;

  const backdrop = BACKDROPS[hashString(movie.id) % BACKDROPS.length];

  return (
    <section>
      <button className="back-link" onClick={onBack}>‹ Back to all movies</button>

      <div className="detail-hero" style={{ background: backdrop }}>
        <h2 className="detail-title">{movie.title}</h2>
        <div className="movie-meta">
          <span>{movie.year}</span>
          <span>· directed by {movie.director}</span>
        </div>
        {movie.genres?.length > 0 && (
          <div className="movie-meta" style={{ marginTop: 10 }}>
            {movie.genres.map((g) => (
              <span key={g} className="genre-tag">{g}</span>
            ))}
          </div>
        )}
      </div>

      <div className="section-heading" style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: "1.1rem" }}><span className="live-dot" /> Cast</h2>
        <span className="hint">Click anyone to explore their network</span>
      </div>
      <div className="cast-row">
        {movie.cast?.map((name) => (
          <button key={name} className="cast-chip" onClick={() => onSelectActor(name)}>
            {name}
          </button>
        ))}
      </div>

      <div className="sprocket-rule"><span>Connected movies</span></div>

      <SimilarSection
        title="Same cast"
        hint="Movie → Actor → Movie"
        movies={similar.byActor}
        onSelectMovie={onSelectMovie}
      />

      <SimilarSection
        title="Same director"
        hint="Movie → Director → Movie"
        movies={similar.byDirector}
        onSelectMovie={onSelectMovie}
      />

      <SimilarSection
        title="Same genre"
        hint="Movie → Genre → Movie"
        movies={similar.byGenre}
        onSelectMovie={onSelectMovie}
      />
    </section>
  );
}