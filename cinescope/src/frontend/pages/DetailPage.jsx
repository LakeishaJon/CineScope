import React from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Star, Heart, Play, Calendar, Clock, Tv } from 'lucide-react';
import { genreColors } from '../data/mockData';

export default function DetailPage({ movie, onBack, favorites, onFavoriteToggle }) {
  const isFavorite = favorites.includes(movie.id);

  return (
    <div style={{ minHeight: '100vh', background: '#0C0C0F' }}>
      {/* Hero Banner */}
      <div className="detail-hero" style={{
        background: `linear-gradient(135deg, ${genreColors[movie.genre]}, #1A1A1D)`,
        opacity: 0.3,
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, #0C0C0F, transparent)'
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
            border: 'none'
          }}
        >
          ← Back
        </Button>
      </div>

      {/* Content */}
      <Container style={{ marginTop: '-12rem', position: 'relative', zIndex: 10 }}>
        <Row>
          {/* Poster */}
          <Col md={4} lg={3}>
            <div 
              className="detail-poster"
              style={{ 
                background: `linear-gradient(135deg, ${genreColors[movie.genre]}, #1A1A1D)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '8rem',
                opacity: 0.6
              }}
            >
              {movie.poster}
            </div>
          </Col>

          {/* Details */}
          <Col md={8} lg={9} className="pt-4">
            <h1 className="display-3 fw-bold text-white mb-4">{movie.title}</h1>
            
            {/* Meta Info */}
            <div className="d-flex flex-wrap gap-3 mb-4">
              <div className="rating-badge">
                <Star size={20} fill="currentColor" />
                {movie.rating}
              </div>
              
              <Badge bg="secondary" style={{ background: '#1A1A1D', padding: '0.75rem 1.5rem' }}>
                <Calendar size={16} className="me-2" />
                {movie.year}
              </Badge>
              
              <Badge bg="secondary" style={{ background: '#1A1A1D', padding: '0.75rem 1.5rem' }}>
                {movie.genre}
              </Badge>
              
              {movie.type === 'tv' && (
                <Badge style={{ background: '#1E90FF', padding: '0.75rem 1.5rem' }}>
                  <Tv size={16} className="me-2" />
                  TV Series
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-3 mb-5">
              <Button size="lg" className="btn-gradient px-5 py-3">
                <Play size={20} className="me-2" />
                Watch Trailer
              </Button>
              
              <Button 
                size="lg"
                onClick={() => onFavoriteToggle(movie.id)}
                className="px-5 py-3"
                style={{ 
                  background: isFavorite ? '#D72638' : '#1A1A1D',
                  border: isFavorite ? 'none' : '1px solid rgba(160, 163, 168, 0.25)',
                  color: 'white'
                }}
              >
                <Heart size={20} fill={isFavorite ? 'white' : 'none'} className="me-2" />
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
            </div>

            {/* Overview */}
            <div className="mb-4">
              <h2 className="text-white fw-bold mb-3">Overview</h2>
              <p className="lead" style={{ color: '#A0A3A8', lineHeight: 1.8 }}>
                {movie.overview}
              </p>
            </div>

            {/* Additional Info */}
            <div 
              className="p-4 rounded-3"
              style={{ background: '#1A1A1D' }}
            >
              <Row>
                <Col md={4}>
                  <p className="text-muted small mb-1">Runtime</p>
                  <p className="text-white fw-semibold d-flex align-items-center gap-2 mb-0">
                    <Clock size={16} />
                    {Math.floor(Math.random() * 60) + 90} min
                  </p>
                </Col>
                <Col md={4}>
                  <p className="text-muted small mb-1">Language</p>
                  <p className="text-white fw-semibold mb-0">English</p>
                </Col>
                <Col md={4}>
                  <p className="text-muted small mb-1">Status</p>
                  <p className="text-white fw-semibold mb-0">Released</p>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}