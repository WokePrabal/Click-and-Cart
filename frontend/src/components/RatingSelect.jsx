
import React from 'react';

// Simple accessible rating select styled as buttons.
export default function RatingSelect({ value = 0, onChange }) {
  const stars = [1,2,3,4,5];
  return (
    <div className="rating-select" role="radiogroup" aria-label="Rating">
      {stars.map(s => (
        <button
          key={s}
          type="button"
          role="radio"
          aria-checked={value === s}
          className={`rating-btn ${value >= s ? 'on' : 'off'}`}
          onClick={() => onChange(s)}
          title={`${s} star${s>1? 's':''}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.168L12 18.896 4.664 23.165l1.402-8.168L.132 9.211l8.2-1.192z" />
          </svg>
        </button>
      ))}

      <style jsx>{`
        .rating-select{ display:flex; gap:6px; align-items:center }
        .rating-btn{ background:transparent; border:2px solid transparent; padding:6px; border-radius:8px; cursor:pointer; transition:transform .08s ease, background .12s ease }
        .rating-btn:focus{ outline:3px solid rgba(59,130,246,0.35) }
        .rating-btn.off svg path{ fill:#d1d5db }
        .rating-btn.on{ background:linear-gradient(180deg,#ffe29f,#ffbc2f); transform:translateY(-3px) }
        .rating-btn.on svg path{ fill:#083344 }
      `}</style>
    </div>
  )
}
