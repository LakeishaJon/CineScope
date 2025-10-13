function TVShowsPage({ favorites, onFavoriteToggle, onMovieClick }) {
  return (
    <div className="min-h-screen px-8 py-8" style={{ background: '#0C0C0F' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Tv size={36} style={{ color: '#1E90FF' }} />
            TV Shows
          </h1>
          <p style={{ color: '#A0A3A8' }}>Explore popular series and programs</p>
        </div>

        {/* Trending TV Shows */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Trending TV Shows</h2>
          <div className="grid grid-cols-6 gap-4">
            {mockTVShows.map((show) => (
              <MovieCard 
                key={show.id}
                movie={show}
                isFavorite={favorites.includes(show.id)}
                onFavoriteToggle={onFavoriteToggle}
                onClick={() => onMovieClick(show)}
              />
            ))}
          </div>
        </div>

        {/* Currently Airing */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-sm" style={{ background: '#D72638' }}>LIVE</span>
            Currently Airing
          </h2>
          <div className="grid grid-cols-6 gap-4">
            {mockTVShows.slice(0, 6).map((show) => (
              <MovieCard 
                key={show.id}
                movie={show}
                isFavorite={favorites.includes(show.id)}
                onFavoriteToggle={onFavoriteToggle}
                onClick={() => onMovieClick(show)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}