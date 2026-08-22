const BASE = import.meta.env.VITE_API_URL || "";

async function request(path) {
  const res = await fetch(`${BASE}/api${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  getMovies: () => request("/movies"),
  getMovie: (id) => request(`/movies/${id}`),
  getSimilarMovies: (id) => request(`/movies/${id}/similar`),
  getCoStars: (actorName) => request(`/recommend/co-stars/${encodeURIComponent(actorName)}`),
};