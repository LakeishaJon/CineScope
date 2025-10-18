import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Heart } from 'lucide-react';
import MovieCard from '../components/MovieCard';

export default function FavoritesPage({ favorites, allContent, onFavoriteToggle, onMovieClick }) {
  const favoriteItems = allContent.filter(item => favorites.includes(item.id));

  return (
    <div style={{ minHeight: '100vh', background: '#0C0C0F', paddingTop: '1.5rem', paddingBottom: '2rem' }}>
      <Container>
        {/* Header */}
        <div className="mb-4 mb-md-5 px-2">
          <h1 className="text-white fw-bold display-5 display-md-4 mb-2 d-flex align-items-center gap-2 gap-md-3">
            <Heart size={36} style={{ color: '#D72638' }} fill="#D72638" />
            Your Favorites
          </h1>
          <p style={{ color: '#A0A3A8', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
            {favoriteItems.length} {favoriteItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {/* Content */}
        {favoriteItems.length === 0 ? (
          <div className="empty-state py-5">
            <Heart size={48} style={{ color: '#A0A3A8' }} className="mb-3 opacity-25" />
            <h2 className="text-white fw-bold mb-2 fs-4 fs-md-3">No favorites yet</h2>
            <p style={{ color: '#A0A3A8', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
              Click the heart icon on any movie or show to save it here
            </p>
          </div>
        ) : (
          <Row xs={2} sm={3} md={4} lg={6} className="g-2 g-md-3">
            {favoriteItems.map((item) => (
              <Col key={item.id}>
                <MovieCard 
                  movie={item}
                  isFavorite={true}
                  onFavoriteToggle={onFavoriteToggle}
                  onClick={() => onMovieClick(item)}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}