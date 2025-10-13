// src/frontend/pages/MoviesPage.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Play } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { mockMovies } from '../data/mockData';

export default function MoviesPage({ favorites, onFavoriteToggle, onMovieClick }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0C0C0F', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <Container>
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-white fw-bold display-4 mb-2">Movies</h1>
          <p style={{ color: '#A0A3A8' }}>Browse our collection of films</p>
        </div>

        {/* Popular Movies */}
        <div className="mb-5">
          <h2 className="text-white fw-bold mb-4">Popular Movies</h2>
          <Row xs={2} md={3} lg={6} className="g-3">
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
          <h2 className="text-white fw-bold mb-4 d-flex align-items-center gap-2">
            <Play size={24} style={{ color: '#FFB400' }} />
            Now Playing in Theaters
          </h2>
          <Row xs={2} md={3} lg={6} className="g-3">
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