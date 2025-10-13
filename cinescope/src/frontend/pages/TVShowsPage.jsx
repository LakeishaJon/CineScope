// src/frontend/pages/TVShowsPage.jsx
import React from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { Tv } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { mockTVShows } from '../data/mockData';

export default function TVShowsPage({ favorites, onFavoriteToggle, onMovieClick }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0C0C0F', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <Container>
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-white fw-bold display-4 mb-2 d-flex align-items-center gap-3">
            <Tv size={48} style={{ color: '#1E90FF' }} />
            TV Shows
          </h1>
          <p style={{ color: '#A0A3A8' }}>Explore popular series and programs</p>
        </div>

        {/* Trending TV Shows */}
        <div className="mb-5">
          <h2 className="text-white fw-bold mb-4">Trending TV Shows</h2>
          <Row xs={2} md={3} lg={6} className="g-3">
            {mockTVShows.map((show) => (
              <Col key={show.id}>
                <MovieCard 
                  movie={show}
                  isFavorite={favorites.includes(show.id)}
                  onFavoriteToggle={onFavoriteToggle}
                  onClick={() => onMovieClick(show)}
                />
              </Col>
            ))}
          </Row>
        </div>

        {/* Currently Airing */}
        <div>
          <h2 className="text-white fw-bold mb-4 d-flex align-items-center gap-2">
            <Badge bg="danger" className="px-3 py-2">LIVE</Badge>
            Currently Airing
          </h2>
          <Row xs={2} md={3} lg={6} className="g-3">
            {mockTVShows.slice(0, 6).map((show) => (
              <Col key={show.id}>
                <MovieCard 
                  movie={show}
                  isFavorite={favorites.includes(show.id)}
                  onFavoriteToggle={onFavoriteToggle}
                  onClick={() => onMovieClick(show)}
                />
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
}