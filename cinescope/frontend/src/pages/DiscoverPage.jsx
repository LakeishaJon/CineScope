import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Search, Filter } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { moviesAPI } from '../services/api';

export default function DiscoverPage({ favorites, onFavoriteToggle, onMovieClick }) {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contentType, setContentType] = useState('movie'); // 'movie' or 'tv'

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await moviesAPI.getGenres();
        setGenres(['All', ...response.data.genres.map(g => g.name)]);
      } catch (err) {
        console.error('Error fetching genres:', err);
        setGenres(['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller']);
      }
    };

    fetchGenres();
  }, []);

  // Fetch movies/TV shows based on search or discovery
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);

        let response;
        
        if (searchQuery.trim()) {
          // Search mode
          response = await moviesAPI.search(searchQuery);
        } else if (selectedGenre && selectedGenre !== 'All') {
          // Filter by genre
          const genreId = genres.find(g => g.name === selectedGenre)?.id;
          response = await moviesAPI.discover(contentType, genreId);
        } else {
          // Default: get popular content
          response = contentType === 'movie' 
            ? await moviesAPI.getPopularMovies()
            : await moviesAPI.getPopularTV();
        }

        setMovies(response.data.results || []);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to load content. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const debounceTimer = setTimeout(fetchContent, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedGenre, contentType]);

  const filteredContent = movies.filter(item => {
    const title = item.title || item.name || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0C0C0F', paddingTop: '1.5rem', paddingBottom: '2rem' }}>
      <Container>
        {/* Header */}
        <div className="mb-3 mb-md-4 px-2">
          <h1 className="text-white fw-bold display-5 display-md-4 mb-2">Discover</h1>
          <p style={{ color: '#A0A3A8', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
            Explore our entire collection of movies and TV shows
          </p>
        </div>

        {/* Content Type Toggle */}
        <div className="mb-3 px-2">
          <div className="btn-group" role="group">
            <Button
              onClick={() => setContentType('movie')}
              className={contentType === 'movie' ? 'btn-gradient' : 'btn-outline-secondary'}
              size="sm"
            >
              Movies
            </Button>
            <Button
              onClick={() => setContentType('tv')}
              className={contentType === 'tv' ? 'btn-gradient' : 'btn-outline-secondary'}
              size="sm"
            >
              TV Shows
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-3 mb-md-4 px-2">
          <div style={{ position: 'relative', maxWidth: '600px' }}>
            <Search 
              style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#A0A3A8',
                zIndex: 10
              }} 
              size={20} 
            />
            <Form.Control
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${contentType === 'movie' ? 'movies' : 'TV shows'}...`}
              className="search-input"
              style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
            />
          </div>
        </div>

        {/* Genre Filter */}
        <div className="mb-3 mb-md-4 d-flex align-items-center gap-2 flex-wrap px-2">
          <Filter size={20} style={{ color: '#A0A3A8' }} className="d-none d-md-block" />
          {genres.map(genre => (
            <Button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`genre-btn ${selectedGenre === genre ? 'active' : ''}`}
              size="sm"
              style={{
                background: selectedGenre === genre ? 'linear-gradient(135deg, #D72638, #FFB400)' : '#1A1A1D',
                color: selectedGenre === genre ? '#0C0C0F' : '#A0A3A8',
                border: selectedGenre === genre ? 'none' : '1px solid rgba(160, 163, 168, 0.25)',
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
              }}
            >
              {genre}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-3 px-2">
            <p style={{ color: '#A0A3A8', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
              {filteredContent.length} results found
            </p>
          </div>
        )}

        {/* Movie Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-white mt-3">Loading content...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5">
            <p className="text-danger">{error}</p>
            <Button onClick={() => window.location.reload()} className="btn-gradient">
              Try Again
            </Button>
          </div>
        ) : filteredContent.length > 0 ? (
          <Row xs={2} sm={3} md={4} lg={6} className="g-2 g-md-3">
            {filteredContent.map((item) => (
              <Col key={item.id}>
                <MovieCard 
                  movie={{
                    ...item,
                    title: item.title || item.name,
                    poster: item.poster_path 
                      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                      : 'https://via.placeholder.com/500x750?text=No+Image',
                    rating: item.vote_average
                  }}
                  isFavorite={favorites.includes(item.id)}
                  onFavoriteToggle={onFavoriteToggle}
                  onClick={() => onMovieClick(item)}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="empty-state text-center py-5">
            <p className="fs-3 fs-md-2 text-white">No results found</p>
            <p style={{ color: '#A0A3A8' }}>Try adjusting your filters or search query</p>
          </div>
        )}
      </Container>
    </div>
  );
}