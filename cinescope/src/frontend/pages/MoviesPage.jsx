import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Play } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { mockMovies } from '../data/mockData';

export default function MoviesPage({ favorites, onFavoriteToggle, onMovieClick }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0C0C0F', paddingTop: '1.5rem', paddingBottom: '2rem' }}>
      <Container>
        {/* Header */}
        <div className="mb-4 mb-md-5 px-2">
          <h1 className="text-white fw-bold display-5 display-md-4 mb-2">Movies</h1>
          <p style={{ color: '#A0A3A8', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
            Browse our collection of films
          </p>
        </div>

        {/* Popular Movies */}
        <div className="mb-4 mb-md-5">
          <h2 className="text-white fw-bold mb-3 mb-md-4 px-2 fs-4 fs-md-3">Popular Movies</h2>
          <Row xs={2} sm={3} md={4} lg={6} className="g-2 g-md-3">
            {mockMovies.map((movie) => (
              <Col key={movie.id}>
                <MovieCard 
                  movie={movie}
                  isFavorite={favorites.includes(movie.id)}
                  onFavoriteToggle={onFavoriteToggle}
                  onClick={() => onMovieClick(movie)}
                />
              </Col>
            ))}
          </Row>
        </div>

        {/* Now Playing */}
        <div>
          <h2 className="text-white fw-bold mb-3 mb-md-4 d-flex align-items-center gap-2 px-2 fs-4 fs-md-3">
            <Play size={20} style={{ color: '#FFB400' }} />
            Now Playing
          </h2>
          <Row xs={2} sm={3} md={4} lg={6} className="g-2 g-md-3">
            {mockMovies.slice(0, 6).map((movie) => (
              <Col key={movie.id}>
                <MovieCard 
                  movie={movie}
                  isFavorite={favorites.includes(movie.id)}
                  onFavoriteToggle={onFavoriteToggle}
                  onClick={() => onMovieClick(movie)}
                />
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
}