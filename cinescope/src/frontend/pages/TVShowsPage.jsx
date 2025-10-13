import React from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { Tv } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { mockTVShows } from '../data/mockData';

export default function TVShowsPage({ favorites, onFavoriteToggle, onMovieClick }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0C0C0F', paddingTop: '1.5rem', paddingBottom: '2rem' }}>
      <Container>
        {/* Header */}
        <div className="mb-4 mb-md-5 px-2">
          <h1 className="text-white fw-bold display-5 display-md-4 mb-2 d-flex align-items-center gap-2 gap-md-3">
            <Tv size={36} style={{ color: '#1E90FF' }} />
            TV Shows
          </h1>
          <p style={{ color: '#A0A3A8', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
            Explore popular series and programs
          </p>
        </div>

        {/* Trending TV Shows */}
        <div className="mb-4 mb-md-5">
          <h2 className="text-white fw-bold mb-3 mb-md-4 px-2 fs-4 fs-md-3">Trending TV Shows</h2>
          <Row xs={2} sm={3} md={4} lg={6} className="g-2 g-md-3">
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
          <h2 className="text-white fw-bold mb-3 mb-md-4 d-flex align-items-center gap-2 px-2 fs-4 fs-md-3">
            <Badge bg="danger" className="px-2 px-md-3 py-1 py-md-2" style={{ fontSize: 'clamp(0.7rem, 2vw, 0.875rem)' }}>
              LIVE
            </Badge>
            Currently Airing
          </h2>
          <Row xs={2} sm={3} md={4} lg={6} className="g-2 g-md-3">
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