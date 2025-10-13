import React, { useState } from 'react';
import { Heart, Star } from 'lucide-react';
import { genreColors } from '../data/mockData';

export default function MovieCard({ movie, onFavoriteToggle, isFavorite, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3 transition-transform group-hover:scale-105"
        style={{ background: `linear-gradient(135deg, ${genreColors[movie.genre] || '#D72638'}, #1A1A1D)` }}
        onClick={onClick}
      >
        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-60">
          {movie.poster}
        </div>
        
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between mb-2">
              <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#FFB400', color: '#0C0C0F' }}>
                <Star size={12} fill="currentColor" className="inline mr-1" />
                {movie.rating}
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                {movie.year}
              </div>
            </div>
            <p className="text-white text-xs line-clamp-2">{movie.overview}</p>
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(movie.id);
          }}
          className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all backdrop-blur-md"
          style={{ background: isFavorite ? '#D72638' : 'rgba(0, 0, 0, 0.5)' }}
        >
          <Heart size={18} fill={isFavorite ? 'white' : 'none'} color="white" />
        </button>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-white font-semibold text-sm group-hover:text-opacity-80">{movie.title}</h3>
        <p className="text-xs" style={{ color: '#A0A3A8' }}>{movie.genre}</p>
      </div>
    </div>
  );
}