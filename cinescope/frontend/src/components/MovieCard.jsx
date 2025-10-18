import React, { useState } from 'react';
import { Badge } from 'react-bootstrap';
import { Heart, Star } from 'lucide-react';

export default function MovieCard({ movie, onFavoriteToggle, isFavorite, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Extract year from release_date or first_air_date
  const year = movie.release_date 
    ? new Date(movie.release_date).getFullYear()
    : movie.first_air_date
    ? new Date(movie.first_air_date).getFullYear()
    : movie.year || 'N/A';

  // Get the poster URL or fallback
  const posterUrl = movie.poster || (movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image');

  // Get rating - round to 1 decimal
  const rating = movie.rating 
    ? movie.rating.toFixed(1) 
    : movie.vote_average 
    ? movie.vote_average.toFixed(1) 
    : 'N/A';

  // Get title - handle both movie.title and tv show.name
  const title = movie.title || movie.name;

  // Get genre name if available
  const genre = movie.genre || (movie.genres && movie.genres[0]?.name) || '';

  return (
    <div 
      className="movie-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="movie-card-poster"
        onClick={onClick}
        style={{
          position: 'relative',
          cursor: 'pointer',
          overflow: 'hidden',
          borderRadius: '0.75rem',
          aspectRatio: '2/3',
          background: '#1A1A1D'
        }}
      >
        {/* Poster Image */}
        {!imageError ? (
          <img 
            src={posterUrl}
            alt={title}
            onError={() => setImageError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        ) : (
          // Fallback if image fails to load
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #D72638, #1A1A1D)',
            color: 'rgba(255, 255, 255, 0.3)',
            fontSize: '3rem',
            fontWeight: 'bold'
          }}>
            🎬
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="movie-card-overlay">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <Badge bg="warning" text="dark" className="rating-badge">
              <Star size={12} fill="currentColor" />
              {rating}
            </Badge>
            {year && (
              <Badge bg="secondary" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                {year}
              </Badge>
            )}
          </div>
          {movie.overview && (
            <p className="text-white small mb-0" style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4
            }}>
              {movie.overview}
            </p>
          )}
        </div>
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(movie.id);
          }}
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            background: 'rgba(0, 0, 0, 0.6)',
            border: 'none',
            borderRadius: '50%',
            width: '2.5rem',
            height: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            zIndex: 10
          }}
        >
          <Heart size={18} fill={isFavorite ? 'white' : 'none'} color="white" />
        </button>
      </div>
      
      {/* Movie Title and Genre */}
      <div className="mt-2">
        <h6 
          className="text-white mb-1" 
          style={{
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.3
          }}
        >
          {title}
        </h6>
        {genre && (
          <small style={{ color: '#A0A3A8', fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)' }}>
            {genre}
          </small>
        )}
      </div>
    </div>
  );
}