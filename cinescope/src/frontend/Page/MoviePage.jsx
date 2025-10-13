function MoviesPage({ favorites, onFavoriteToggle, onMovieClick }) {
  return (
    <div className="min-h-screen px-8 py-8" style={{ background: '#0C0C0F' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Movies</h1>
          <p style={{ color: '#A0A3A8' }}>Browse our collection of films</p>
        </div>

        {/* Popular Movies */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Popular Movies</h2>
          <div className="grid grid-cols-6 gap-4">
            {mockMovies.map((movie) => (
              <MovieCard 
                key={movie.id}
                movie={movie}
                isFavorite={favorites.includes(movie.id)}
                onFavoriteToggle={onFavoriteToggle}
                onClick={() => onMovieClick(movie)}
              />
            ))}
          </div>
        </div>

        {/* Now Playing */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Play size={24} style={{ color: '#FFB400' }} />
            Now Playing in Theaters
          </h2>
          <div className="grid grid-cols-6 gap-4">
            {mockMovies.slice(0, 6).map((movie) => (
              <MovieCard 
                key={movie.id}
                movie={movie}
                isFavorite={favorites.includes(movie.id)}
                onFavoriteToggle={onFavoriteToggle}
                onClick={() => onMovieClick(movie)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}