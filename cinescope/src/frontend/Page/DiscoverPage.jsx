
function DiscoverPage({ favorites, onFavoriteToggle, onMovieClick }) {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const allContent = [...mockMovies, ...mockTVShows];

  const filteredContent = allContent.filter(item => {
    const matchesGenre = selectedGenre === 'All' || item.genre === selectedGenre;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="min-h-screen px-8 py-8" style={{ background: '#0C0C0F' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Discover</h1>
          <p style={{ color: '#A0A3A8' }}>Explore our entire collection of movies and TV shows</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{ color: '#A0A3A8' }} size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies, TV shows..."
              className="w-full pl-12 pr-4 py-4 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition"
              style={{ 
                background: '#1A1A1D',
                border: '1px solid rgba(160, 163, 168, 0.25)',
              }}
            />
          </div>
        </div>

        {/* Genre Filter */}
        <div className="mb-8 flex items-center gap-3 flex-wrap">
          <Filter size={20} style={{ color: '#A0A3A8' }} />
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className="px-4 py-2 rounded-lg font-medium transition-all"
              style={{
                background: selectedGenre === genre ? 'linear-gradient(135deg, #D72638, #FFB400)' : '#1A1A1D',
                color: selectedGenre === genre ? '#0C0C0F' : '#A0A3A8',
                border: selectedGenre === genre ? 'none' : '1px solid rgba(160, 163, 168, 0.25)'
              }}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="mb-4">
          <p style={{ color: '#A0A3A8' }}>
            {filteredContent.length} results found
          </p>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-6 gap-4">
          {filteredContent.map((item) => (
            <MovieCard 
              key={item.id}
              movie={item}
              isFavorite={favorites.includes(item.id)}
              onFavoriteToggle={onFavoriteToggle}
              onClick={() => onMovieClick(item)}
            />
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl" style={{ color: '#A0A3A8' }}>No results found</p>
            <p style={{ color: '#A0A3A8' }} className="mt-2">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}