import React, { useState } from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { Search, Filter } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { mockMovies, mockTVShows, genres } from '../data/mockData';

export default function DiscoverPage({ favorites, onFavoriteToggle, onMovieClick }) {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const allContent = [...mockMovies, ...mockTVShows];

  const filteredContent = allContent.filter(item => {
    const matchesGenre = selectedGenre === 'All' || item.genre === selectedGenre;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
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
              placeholder="Search movies, TV shows..."
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
        <div className="mb-3 px-2">
          <p style={{ color: '#A0A3A8', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
            {filteredContent.length} results found
          </p>
        </div>

        {/* Movie Grid */}
        {filteredContent.length > 0 ? (
          <Row xs={2} sm={3} md={4} lg={6} className="g-2 g-md-3">
            {filteredContent.map((item) => (
              <Col key={item.id}>
                <MovieCard 
                  movie={item}
                  isFavorite={favorites.includes(item.id)}
                  onFavoriteToggle={onFavoriteToggle}
                  onClick={() => onMovieClick(item)}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="empty-state">
            <p className="fs-3 fs-md-2">No results found</p>
            <p>Try adjusting your filters or search query</p>
          </div>
        )}
      </Container>
    </div>
  );
}