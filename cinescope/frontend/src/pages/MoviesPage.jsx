import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Play } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { moviesAPI } from '../services/api';

export default function MoviesPage({ favorites, onFavoriteToggle, onMovieClick }) {
  const [popularMovies, setPopularMovies] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        
        // Fetch popular movies and now playing in parallel
        const [popularResponse, nowPlayingResponse] = await Promise.all([
          moviesAPI.getPopularMovies(),
          moviesAPI.getNowPlaying()
        ]);

        setPopularMovies(popularResponse.data.results || []);
        setNowPlaying(nowPlayingResponse.data.results || []);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0C0C0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-white mt-3">Loading movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#0C0C0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <p className="text-danger">{error}</p>
          <button className="btn btn-gradient" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
            {popularMovies.map((movie) => (
              <Col key={movie.id}>
                <MovieCard 
                  movie={{
                    ...movie,
                    title: movie.title,
                    poster: movie.poster_path 
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : 'https://via.placeholder.com/500x750?text=No+Image',
                    rating: movie.vote_average
                  }}
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
            {nowPlaying.map((movie) => (
              <Col key={movie.id}>
                <MovieCard 
                  movie={{
                    ...movie,
                    title: movie.title,
                    poster: movie.poster_path 
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : 'https://via.placeholder.com/500x750?text=No+Image',
                    rating: movie.vote_average
                  }}
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