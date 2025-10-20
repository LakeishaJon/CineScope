import React from 'react';

export default function MovieCardSkeleton() {
  return (
    <div 
      className="movie-card-skeleton"
      style={{
        background: '#1A1A1D',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        animation: 'fadeIn 0.3s ease-in',
        height: '100%'
      }}
    >
      {/* Poster Skeleton */}
      <div 
        className="skeleton"
        style={{
          position: 'relative',
          aspectRatio: '2/3',
          width: '100%'
        }}
      >
        {/* Play icon placeholder */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)'
        }}></div>

        {/* Heart icon placeholder */}
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)'
        }}></div>
      </div>

      {/* Title and Rating Skeleton */}
      <div style={{ padding: '0.75rem' }}>
        {/* Title line 1 */}
        <div 
          className="skeleton"
          style={{
            height: '1rem',
            borderRadius: '0.25rem',
            marginBottom: '0.5rem',
            width: '100%'
          }}
        ></div>
        
        {/* Title line 2 */}
        <div 
          className="skeleton"
          style={{
            height: '1rem',
            width: '70%',
            borderRadius: '0.25rem',
            marginBottom: '0.5rem'
          }}
        ></div>

        {/* Rating */}
        <div 
          className="skeleton"
          style={{
            height: '0.75rem',
            width: '40%',
            borderRadius: '0.25rem'
          }}
        ></div>
      </div>
    </div>
  );
}