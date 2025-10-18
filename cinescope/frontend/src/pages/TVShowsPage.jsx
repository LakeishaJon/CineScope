import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { Tv } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { moviesAPI } from '../services/api';

export default function TVShowsPage({ favorites, onFavoriteToggle, onMovieClick }) {
  const [popularShows, setPopularShows] = useState([]);
  const [trendingShows, setTrendingShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        setLoading(true);
        
        // Fetch popular TV shows
        const popularResponse = await moviesAPI.getPopularTV();
        setPopularShows(popularResponse.data.results || []);

        // Fetch trending and filter for TV shows
        const trendingResponse = await moviesAPI.getTrending();
        const tvShows = (trendingResponse.data.results || []).filter(
          item => item.media_type === 'tv' || item.name
        );
        setTrendingShows(tvShows.slice(0, 12));
      } catch (err) {
        console.error('Error fetching TV shows:', err);
        setError('Failed to load TV shows');
      } finally {
        setLoading(false);
      }
    };

    fetchTVShows();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0C0C0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-white mt-3">Loading TV shows...</p>
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
            {trendingShows.map((show) => (
              <Col key={show.id}>
                <MovieCard 
                  movie={{
                    ...show,
                    title: show.name || show.title,
                    poster: show.poster_path 
                      ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                      : 'https://via.placeholder.com/500x750?text=No+Image',
                    rating: show.vote_average
                  }}
                  isFavorite={favorites.includes(show.id)}
                  onFavoriteToggle={onFavoriteToggle}
                  onClick={() => onMovieClick({ ...show, type: 'tv' })}
                />
              </Col>
            ))}
          </Row>
        </div>

        {/* Popular TV Shows */}
        <div>
          <h2 className="text-white fw-bold mb-3 mb-md-4 d-flex align-items-center gap-2 px-2 fs-4 fs-md-3">
            <Badge bg="danger" className="px-2 px-md-3 py-1 py-md-2" style={{ fontSize: 'clamp(0.7rem, 2vw, 0.875rem)' }}>
              LIVE
            </Badge>
            Popular Series
          </h2>
          <Row xs={2} sm={3} md={4} lg={6} className="g-2 g-md-3">
            {popularShows.map((show) => (
              <Col key={show.id}>
                <MovieCard 
                  movie={{
                    ...show,
                    title: show.name || show.title,
                    poster: show.poster_path 
                      ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                      : 'https://via.placeholder.com/500x750?text=No+Image',
                    rating: show.vote_average
                  }}
                  isFavorite={favorites.includes(show.id)}
                  onFavoriteToggle={onFavoriteToggle}
                  onClick={() => onMovieClick({ ...show, type: 'tv' })}
                />
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
}