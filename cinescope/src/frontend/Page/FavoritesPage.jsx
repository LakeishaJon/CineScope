import React from 'react';
import { Heart } from 'lucide-react';
import MovieCard from '../components/MovieCard';

export default function FavoritesPage({ favorites, allContent, onFavoriteToggle, onMovieClick }) {
  const favoriteItems = allContent.filter(item => favorites.includes(item.id));

  return (
    <div className="min-h-screen px-8 py-8" style={{ background: '#0C0C0F' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Heart size={36} style={{ color: '#D72638' }} fill="#D72638" />
            Your Favorites
          </h1>
          <p style={{ color: '#A0A3A8' }}>
            {favoriteItems.length} {favoriteItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {/* Content */}
        {favoriteItems.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={64} style={{ color: '#A0A3A8' }} className="mx-auto mb-4 opacity-30" />
            <h2 className="text-2xl font-bold text-white mb-2">No favorites yet</h2>
            <p style={{ color: '#A0A3A8' }} className="mb-6">
              Click the heart icon on any movie or show to save it here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-4">
            {favoriteItems.map((item) => (
              <MovieCard 
                key={item.id}
                movie={item}
                isFavorite={true}
                onFavoriteToggle={onFavoriteToggle}
                onClick={() => onMovieClick(item)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}