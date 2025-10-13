function HomePage({ onNavigate, favorites, onFavoriteToggle }) {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0C0C0F 0%, #1A1A1D 50%, #2D1A1F 100%)' }}>
      {/* Hero Section */}
      <div className="relative px-8 pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full blur-xl animate-pulse"
              style={{
                background: i % 2 === 0 ? '#D72638' : '#FFB400',
                width: Math.random() * 100 + 50 + 'px',
                height: Math.random() * 100 + 50 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 2 + 's',
                animationDuration: (Math.random() * 3 + 2) + 's'
              }}
            ></div>
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl font-bold text-white leading-tight">
            Discover Movies
            <br />
            <span style={{ 
              background: 'linear-gradient(135deg, #D72638, #FFB400)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Beyond the Screen
            </span>
          </h1>

          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#A0A3A8' }}>
            Explore trending films, rare gems, and recommendations tailored to your mood.
          </p>

          <div className="flex items-center justify-center gap-4 pt-6">
            <button
              onClick={() => onNavigate('discover')}
              className="px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-2 transition-all transform hover:scale-105"
              style={{ 
                background: 'linear-gradient(135deg, #FFB400, #D72638)',
                color: '#0C0C0F',
                boxShadow: '0 5px 20px rgba(255, 180, 0, 0.2)'
              }}
            >
              <TrendingUp size={20} />
              Start Exploring
            </button>

            <button className="px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-2 transition-all hover:bg-opacity-10"
              style={{ 
                border: '2px solid #D72638',
                color: '#D72638',
                background: 'rgba(215, 38, 56, 0.05)'
              }}
            >
              <Play size={20} />
              Watch Trailer
            </button>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="px-8 py-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 rounded-xl backdrop-blur-sm transition-all hover:scale-105 cursor-pointer"
            style={{ 
              background: 'linear-gradient(135deg, rgba(215, 38, 56, 0.1), rgba(26, 26, 29, 0.8))',
              border: '1px solid rgba(215, 38, 56, 0.2)'
            }}
          >
            <TrendingUp size={32} style={{ color: '#D72638' }} className="mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Trending Now</h3>
            <p style={{ color: '#A0A3A8' }}>
              Stay updated with the latest blockbusters and viral hits everyone's watching.
            </p>
          </div>

          <div className="p-6 rounded-xl backdrop-blur-sm transition-all hover:scale-105 cursor-pointer"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255, 180, 0, 0.1), rgba(26, 26, 29, 0.8))',
              border: '1px solid rgba(255, 180, 0, 0.2)'
            }}
          >
            <Star size={32} style={{ color: '#FFB400' }} className="mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Rated Classics</h3>
            <p style={{ color: '#A0A3A8' }}>
              Discover timeless masterpieces with top ratings from critics and audiences.
            </p>
          </div>

          <div className="p-6 rounded-xl backdrop-blur-sm transition-all hover:scale-105 cursor-pointer"
            style={{ 
              background: 'linear-gradient(135deg, rgba(30, 144, 255, 0.1), rgba(26, 26, 29, 0.8))',
              border: '1px solid rgba(30, 144, 255, 0.2)'
            }}
          >
            <Heart size={32} style={{ color: '#1E90FF' }} className="mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Your Favorites</h3>
            <p style={{ color: '#A0A3A8' }}>
              Curate your personal collection and never lose track of what you love.
            </p>
          </div>
        </div>
      </div>

      {/* Trending Preview */}
      <div className="px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <span style={{ color: '#D72638' }}>🔥</span>
              Trending Now
            </h2>
            <button 
              onClick={() => onNavigate('discover')}
              className="text-white hover:opacity-80 transition"
            >
              View All →
            </button>
          </div>
          
          <div className="grid grid-cols-6 gap-4">
            {mockMovies.slice(0, 6).map((movie) => (
              <MovieCard 
                key={movie.id}
                movie={movie}
                isFavorite={favorites.includes(movie.id)}
                onFavoriteToggle={onFavoriteToggle}
                onClick={() => onNavigate('detail', movie)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}