import React, { useState } from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Heart, Star } from 'lucide-react';
import { genreColors } from '../data/mockData';

export default function MovieCard({ movie, onFavoriteToggle, isFavorite, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="movie-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="movie-card-poster"
        style={{ background: `linear-gradient(135deg, ${genreColors[movie.genre] || '#D72638'}, #1A1A1D)` }}
        onClick={onClick}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '4rem',
          opacity: 0.6
        }}>
          {movie.poster}
        </div>
        
        <div className="movie-card-overlay">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <Badge bg="warning" text="dark" className="rating-badge">
              <Star size={12} fill="currentColor" />
              {movie.rating}
            </Badge>
            <Badge bg="secondary" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
              {movie.year}
            </Badge>
          </div>
          <p className="text-white small mb-0" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {movie.overview}
          </p>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(movie.id);
          }}
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
        >
          <Heart size={18} fill={isFavorite ? 'white' : 'none'} color="white" />
        </button>
      </div>
      
      <div className="mt-2">
        <h6 className="text-white mb-1">{movie.title}</h6>
        <small style={{ color: '#A0A3A8' }}>{movie.genre}</small>
      </div>
    </div>
  );
}