import React from 'react';

function Star({ filled }) {
  return <span style={{ color: filled ? '#F59E0B' : '#D1D5DB', fontSize: 14 }}>★</span>;
}

/**
 * Renders 1-5 stars based on a numeric rating.
 * @param {number} rating  e.g. 4.7
 */
export default function StarRating({ rating = 0 }) {
  const rounded = Math.round(rating);
  return (
    <span aria-label={`Rating: ${rating} bintang`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} filled={i <= rounded} />
      ))}
    </span>
  );
}
