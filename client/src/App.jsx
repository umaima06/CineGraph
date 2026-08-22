import { useState } from "react";
import { MovieBrowse } from "./components/MovieBrowse.jsx";
import { MovieDetail } from "./components/MovieDetail.jsx";
import { CoStarExplorer } from "./components/CoStarExplorer.jsx";

// Simple state-based router, single flow: list -> movie detail -> actor network.
export default function App() {
  const [view, setView] = useState({ name: "list" });

  function openMovie(movieId) {
    setView({ name: "movie", movieId });
  }

  function openActor(actorName, fromMovieId) {
    setView({ name: "actor", actorName, cameFromMovieId: fromMovieId });
  }

  function backToList() {
    setView({ name: "list" });
  }

  function backToMovie() {
    if (view.cameFromMovieId) {
      setView({ name: "movie", movieId: view.cameFromMovieId });
    } else {
      setView({ name: "list" });
    }
  }

  return (
    <div className="app">
      <nav className="topnav">
        <div className="topnav-logo">CINE<span>GRAPH</span></div>
        <div className="topnav-links">
          <button className="topnav-link active" onClick={backToList}>Browse</button>
        </div>
        <span className="topnav-badge">CognoDB</span>
      </nav>

      {view.name === "list" && <MovieBrowse onSelectMovie={openMovie} />}

      {view.name === "movie" && (
        <MovieDetail
          movieId={view.movieId}
          onBack={backToList}
          onSelectMovie={openMovie}
          onSelectActor={(actorName) => openActor(actorName, view.movieId)}
        />
      )}

      {view.name === "actor" && (
        <CoStarExplorer initialActor={view.actorName} onBack={backToMovie} />
      )}

      <footer className="credits">CineGraph — a CognoDB graph database demo</footer>
    </div>
  );
}