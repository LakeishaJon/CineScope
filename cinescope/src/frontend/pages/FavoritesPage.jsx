// src/frontend/pages/FavoritesPage.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Heart } from 'lucide-react';
import MovieCard from '../components/MovieCard';

export default function FavoritesPage({ favorites, allContent, onFavoriteToggle, onMovieClick }) {
  const favoriteItems = allContent.filter(item => favorites.includes(item.id));

  return (
    <div style={{ minHeight: '100vh', background: '#0C0C0F', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <Container>
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-white fw-bold display-4 mb-2 d-flex align-items-center gap-3">
            <Heart size={48} style={{ color: '#D72638' }} fill="#D72638" />
            Your Favorites
          </h1>
          <p style={{ color: '#A0A3A8' }}>
            {favoriteItems.length} {favoriteItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {/* Content */}
        {favoriteItems.length === 0 ? (
          <div className="empty-state">
            <Heart size={64} style={{ color: '#A0A3A8' }} className="mb-3 opacity-25" />
            <h2 className="text-white fw-bold mb-2">No favorites yet</h2>
            <p style={{ color: '#A0A3A8' }}>
              Click the heart icon on any movie or show to save it here
            </p>
          </div>
        ) : (
          <Row xs={2} md={3} lg={6} className="g-3">
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