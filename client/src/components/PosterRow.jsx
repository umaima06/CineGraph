import { useRef } from "react";

export function PosterRow({ children }) {
  const trackRef = useRef(null);

  function scrollBy(amount) {
    trackRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <div className="poster-row-wrap">
      <button className="poster-arrow left" onClick={() => scrollBy(-320)} aria-label="Scroll left">
        ‹
      </button>
      <div className="poster-row" ref={trackRef}>
        {children}
      </div>
      <button className="poster-arrow right" onClick={() => scrollBy(320)} aria-label="Scroll right">
        ›
      </button>
    </div>
  );
}