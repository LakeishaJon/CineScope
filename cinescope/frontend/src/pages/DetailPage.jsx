import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Star, Heart, Play, Calendar, Clock, Tv, Globe } from 'lucide-react';
import { moviesAPI } from '../services/api';

export default function DetailPage({ movie, onBack, favorites, onFavoriteToggle }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isFavorite = favorites.includes(movie.id);
  const movieType = movie.type || (movie.name ? 'tv' : 'movie');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await moviesAPI.getDetails(movie.id, movieType);
        setDetails(response.data);
      } catch (err) {
        console.error('Error fetching details:', err);
        setError('Failed to load details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movie.id, movieType]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0C0C0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-white mt-3">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div style={{ minHeight: '100vh', background: '#0C0C0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <p className="text-danger">{error || 'Movie not found'}</p>
          <button className="btn btn-gradient" onClick={onBack}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const title = details.title || details.name;
  const releaseDate = details.release_date || details.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const posterUrl = details.poster_path 
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';
  const backdropUrl = details.backdrop_path
    ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
    : null;

  return (
    <div style={{ minHeight: '100vh', background: '#0C0C0F' }}>
      {/* Hero Banner */}
      <div 
        className="detail-hero" 
        style={{
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'linear-gradient(135deg, #D72638, #1A1A1D)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          height: '400px'
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, #0C0C0F 0%, rgba(12, 12, 15, 0.7) 100%)'
        }}></div>
        
        <Button 
          variant="dark"
          onClick={onBack}
          style={{ 
            position: 'absolute', 
            top: '2rem', 
            left: '2rem',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            zIndex: 10
          }}
        >
          ← Back
        </Button>
      </div>

      {/* Content */}
      <Container style={{ marginTop: '-10rem', position: 'relative', zIndex: 10 }} className="px-3">
        <Row>
          {/* Poster */}
          <Col xs={12} md={4} lg={3} className="mb-4 mb-md-0">
            <img 
              src={posterUrl}
              alt={title}
              className="detail-poster mx-auto"
              style={{ 
                width: '100%',
                maxWidth: '300px',
                borderRadius: '1rem',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                display: 'block'
              }}
            />
          </Col>

          {/* Details */}
          <Col xs={12} md={8} lg={9} className="pt-4">
            <h1 className="display-5 display-md-3 fw-bold text-white mb-3 mb-md-4">{title}</h1>
            
            {/* Meta Info */}
            <div className="d-flex flex-wrap gap-2 gap-md-3 mb-3 mb-md-4">
              <div className="rating-badge">
                <Star size={18} fill="currentColor" />
                {details.vote_average ? details.vote_average.toFixed(1) : 'N/A'}
              </div>
              
              <Badge bg="secondary" style={{ background: '#1A1A1D', padding: '0.5rem 1rem' }}>
                <Calendar size={14} className="me-1" />
                {year}
              </Badge>
              
              {details.genres && details.genres.length > 0 && (
                <Badge bg="secondary" style={{ background: '#1A1A1D', padding: '0.5rem 1rem' }}>
                  {details.genres[0].name}
                </Badge>
              )}
              
              {movieType === 'tv' && (
                <Badge style={{ background: '#1E90FF', padding: '0.5rem 1rem' }}>
                  <Tv size={14} className="me-1" />
                  TV Series
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="d-flex flex-column flex-sm-row gap-2 gap-md-3 mb-4 mb-md-5">
              <Button size="lg" className="btn-gradient px-4 px-md-5 py-2 py-md-3">
                <Play size={18} className="me-2" />
                Watch Trailer
              </Button>
              
              <Button 
                size="lg"
                onClick={() => onFavoriteToggle(movie.id)}
                className="px-4 px-md-5 py-2 py-md-3"
                style={{ 
                  background: isFavorite ? '#D72638' : '#1A1A1D',
                  border: isFavorite ? 'none' : '1px solid rgba(160, 163, 168, 0.25)',
                  color: 'white'
                }}
              >
                <Heart size={18} fill={isFavorite ? 'white' : 'none'} className="me-2" />
                <span className="d-none d-sm-inline">
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </span>
                <span className="d-sm-none">
                  {isFavorite ? 'Remove' : 'Add'}
                </span>
              </Button>
            </div>

            {/* Overview */}
            <div className="mb-3 mb-md-4">
              <h2 className="text-white fw-bold mb-2 mb-md-3 fs-4 fs-md-3">Overview</h2>
              <p className="lead" style={{ color: '#A0A3A8', lineHeight: 1.8, fontSize: 'clamp(0.9rem, 2vw, 1.25rem)' }}>
                {details.overview || 'No overview available.'}
              </p>
            </div>

            {/* Additional Info */}
            <div 
              className="p-3 p-md-4 rounded-3"
              style={{ background: '#1A1A1D' }}
            >
              <Row className="g-3">
                {details.runtime && (
                  <Col xs={12} sm={4}>
                    <p className="text-muted small mb-1">Runtime</p>
                    <p className="text-white fw-semibold d-flex align-items-center gap-2 mb-0">
                      <Clock size={16} />
                      {details.runtime} min
                    </p>
                  </Col>
                )}
                
                {details.number_of_seasons && (
                  <Col xs={12} sm={4}>
                    <p className="text-muted small mb-1">Seasons</p>
                    <p className="text-white fw-semibold d-flex align-items-center gap-2 mb-0">
                      <Tv size={16} />
                      {details.number_of_seasons}
                    </p>
                  </Col>
                )}
                
                {details.original_language && (
                  <Col xs={6} sm={4}>
                    <p className="text-muted small mb-1">Language</p>
                    <p className="text-white fw-semibold d-flex align-items-center gap-2 mb-0">
                      <Globe size={16} />
                      {details.original_language.toUpperCase()}
                    </p>
                  </Col>
                )}
                
                {details.status && (
                  <Col xs={6} sm={4}>
                    <p className="text-muted small mb-1">Status</p>
                    <p className="text-white fw-semibold mb-0">{details.status}</p>
                  </Col>
                )}
                
                {details.budget && details.budget > 0 && (
                  <Col xs={6} sm={4}>
                    <p className="text-muted small mb-1">Budget</p>
                    <p className="text-white fw-semibold mb-0">
                      ${(details.budget / 1000000).toFixed(1)}M
                    </p>
                  </Col>
                )}
                
                {details.revenue && details.revenue > 0 && (
                  <Col xs={6} sm={4}>
                    <p className="text-muted small mb-1">Revenue</p>
                    <p className="text-white fw-semibold mb-0">
                      ${(details.revenue / 1000000).toFixed(1)}M
                    </p>
                  </Col>
                )}
              </Row>
            </div>

            {/* Genres List */}
            {details.genres && details.genres.length > 0 && (
              <div className="mt-4">
                <h3 className="text-white fw-bold mb-3 fs-5">Genres</h3>
                <div className="d-flex flex-wrap gap-2">
                  {details.genres.map(genre => (
                    <Badge 
                      key={genre.id} 
                      style={{ 
                        background: 'linear-gradient(135deg, #D72638, #FFB400)',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}