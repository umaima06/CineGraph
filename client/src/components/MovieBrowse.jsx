import { useEffect, useMemo, useState } from "react";
import { api } from "../api.js";
import { MovieCard } from "./MovieCard.jsx";
import { PosterRow } from "./PosterRow.jsx";
import { LoadingState, ErrorState, EmptyState } from "./StateBlock.jsx";

export function MovieBrowse({ onSelectMovie }) {
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | done | error
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setStatus("loading");
    try {
      const data = await api.getMovies();
      setMovies(data);
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  const genres = useMemo(() => {
    const set = new Set();
    movies.forEach((m) => m.genres?.forEach((g) => set.add(g)));
    return ["All", ...Array.from(set).sort()];
  }, [movies]);

  const filtered = useMemo(() => {
    let list = movies;
    if (activeGenre !== "All") {
      list = list.filter((m) => m.genres?.includes(activeGenre));
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.director?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [movies, query, activeGenre]);

  const spotlight = movies[0];

  if (status === "loading") return <LoadingState label="Loading movies" />;
  if (status === "error") return <ErrorState message={error} onRetry={load} />;

  return (
    <section>
      {spotlight && (
        <div className="spotlight">
          <p className="spotlight-eyebrow">Editor's pick</p>
          <h2 className="spotlight-title">{spotlight.title}</h2>
          <p className="spotlight-desc">
            A {spotlight.genres?.join(" / ")} film directed by {spotlight.director}.
            Open it to see everything connected to it through cast, direction, and genre.
          </p>
          <button className="pill-button" onClick={() => onSelectMovie(spotlight.id)}>
            Explore this movie
          </button>
        </div>
      )}

      <div className="costar-search" style={{ marginTop: 32, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by title or director…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="genre-pill-row">
        {genres.map((g) => (
          <button
            key={g}
            className={`genre-pill ${activeGenre === g ? "active" : ""}`}
            onClick={() => setActiveGenre(g)}
          >
            {g.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="section-heading" style={{ marginTop: 20 }}>
        <h2 style={{ fontSize: "1.1rem" }}>
          <span className="live-dot" /> {activeGenre === "All" ? "All movies" : activeGenre}
        </h2>
        <span className="hint">{filtered.length} title{filtered.length === 1 ? "" : "s"}</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No movies match that search"
          body="Try a different title, director, or genre."
        />
      ) : (
        <PosterRow>
          {filtered.map((m) => (
            <MovieCard key={m.id} movie={m} onClick={() => onSelectMovie(m.id)} />
          ))}
        </PosterRow>
      )}
    </section>
  );
}