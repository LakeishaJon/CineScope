import React from 'react';
import { Star, Heart, Play, Calendar, Clock, Tv } from 'lucide-react';
import { genreColors } from '../data/mockData';

export default function DetailPage({ movie, onBack, favorites, onFavoriteToggle }) {
  const isFavorite = favorites.includes(movie.id);

  return (
    <div className="min-h-screen" style={{ background: '#0C0C0F' }}>
      {/* Hero Banner */}
      <div className="relative h-96 overflow-hidden">
        <div 
          className="absolute inset-0" 
          style={{ 
            background: `linear-gradient(135deg, ${genreColors[movie.genre]}, #1A1A1D)`,
            opacity: 0.3 
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 px-4 py-2 rounded-lg backdrop-blur-md text-white hover:bg-white hover:bg-opacity-20 transition flex items-center gap-2"
          style={{ background: 'rgba(0, 0, 0, 0.5)' }}
        >
          ← Back
        </button>
      </div>

      {/* Content */}
      <div className="px-8 -mt-48 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div 
                className="w-80 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl"
                style={{ background: `linear-gradient(135deg, ${genreColors[movie.genre]}, #1A1A1D)` }}
              >
                <div className="w-full h-full flex items-center justify-center text-9xl opacity-60">
                  {movie.poster}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 pt-8">
              <h1 className="text-5xl font-bold text-white mb-4">{movie.title}</h1>
              
              {/* Meta Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: '#FFB400' }}>
                  <Star size={20} fill="#0C0C0F" color="#0C0C0F" />
                  <span className="font-bold" style={{ color: '#0C0C0F' }}>{movie.rating}</span>
                </div>
                
                <div className="px-4 py-2 rounded-lg" style={{ background: '#1A1A1D', color: '#A0A3A8' }}>
                  <Calendar size={16} className="inline mr-2" />
                  {movie.year}
                </div>
                
                <div className="px-4 py-2 rounded-lg" style={{ background: '#1A1A1D', color: '#A0A3A8' }}>
                  {movie.genre}
                </div>
                
                {movie.type === 'tv' && (
                  <div className="px-4 py-2 rounded-lg" style={{ background: '#1E90FF', color: 'white' }}>
                    <Tv size={16} className="inline mr-2" />
                    TV Series
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <button 
                  className="px-8 py-4 rounded-lg font-semibold flex items-center gap-2 transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #FFB400, #D72638)', color: '#0C0C0F' }}
                >
                  <Play size={20} />
                  Watch Trailer
                </button>
                
                <button 
                  onClick={() => onFavoriteToggle(movie.id)}
                  className="px-8 py-4 rounded-lg font-semibold flex items-center gap-2 transition-all"
                  style={{ 
                    background: isFavorite ? '#D72638' : '#1A1A1D',
                    color: 'white',
                    border: isFavorite ? 'none' : '1px solid rgba(160, 163, 168, 0.25)'
                  }}
                >
                  <Heart size={20} fill={isFavorite ? 'white' : 'none'} />
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>

              {/* Overview */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-3">Overview</h2>
                <p className="text-lg leading-relaxed" style={{ color: '#A0A3A8' }}>
                  {movie.overview}
                </p>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-3 gap-6 p-6 rounded-xl" style={{ background: '#1A1A1D' }}>
                <div>
                  <p className="text-sm mb-1" style={{ color: '#A0A3A8' }}>Runtime</p>
                  <p className="text-white font-semibold flex items-center gap-2">
                    <Clock size={16} />
                    {Math.floor(Math.random() * 60) + 90} min
                  </p>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: '#A0A3A8' }}>Language</p>
                  <p className="text-white font-semibold">English</p>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: '#A0A3A8' }}>Status</p>
                  <p className="text-white font-semibold">Released</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}