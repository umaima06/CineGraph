import { useEffect, useState } from "react";
import { api } from "../api.js";
import { LoadingState, EmptyState, ErrorState } from "./StateBlock.jsx";

export function CoStarExplorer({ initialActor, onBack }) {
  const [actorName, setActorName] = useState(initialActor || "");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [searchedFor, setSearchedFor] = useState(null);

  useEffect(() => {
    if (initialActor) {
      runSearch(initialActor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialActor]);

  async function runSearch(name) {
    if (!name.trim()) return;
    setStatus("loading");
    setError(null);
    try {
      const data = await api.getCoStars(name.trim());
      setResults(data);
      setSearchedFor(name.trim());
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    runSearch(actorName);
  }

  return (
    <section>
      {onBack && (
        <button className="back-link" onClick={onBack}>← Back to movie</button>
      )}

      <div className="section-heading">
        <h2>Second-degree co-stars</h2>
        <span className="hint">2-hop traversal, no direct link required</span>
      </div>

      <p style={{ color: "var(--paper-dim)", fontSize: 14, marginBottom: 16, maxWidth: "60ch" }}>
        These are actors <strong>{searchedFor || actorName || "this person"}</strong> has never
        directly shared a screen credit with in our dataset, but who share two or more co-stars
        with them — a "friend of a friend" network for actors.
      </p>

      <form className="costar-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search another actor…"
          value={actorName}
          onChange={(e) => setActorName(e.target.value)}
        />
        <button type="submit">Find connections</button>
      </form>

      {status === "loading" && <LoadingState label="Searching the co-star network" />}
      {status === "error" && <ErrorState message={error} onRetry={() => runSearch(actorName)} />}
      {status === "done" && results.length === 0 && (
        <EmptyState
          title="No second-degree connections found"
          body={`We couldn't find anyone who shares 2+ co-stars with "${searchedFor}" without having worked with them directly. Try another actor from the cast lists.`}
        />
      )}
      {status === "done" && results.length > 0 && (
        <div className="costar-list">
          {results.map((r) => (
            <div className="costar-row" key={r.name}>
              <div>
                <div className="name">{r.name}</div>
                <div className="via">via {r.via.join(", ")}</div>
              </div>
              <span className="match-count">{r.sharedCoStars} shared co-stars</span>
            </div>
          ))}
        </div>
      )}
      {status === "idle" && (
        <EmptyState
          title="Search for an actor"
          body="Type a name above, or click any actor from a movie's cast list to jump straight here."
        />
      )}
    </section>
  );
}
