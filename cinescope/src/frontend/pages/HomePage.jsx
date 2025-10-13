import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { TrendingUp, Star, Heart, Play } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { mockMovies } from '../data/mockData';

export default function HomePage({ onNavigate, favorites, onFavoriteToggle }) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0C0C0F 0%, #1A1A1D 50%, #2D1A1F 100%)' }}>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-animated-bg">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="animated-blob"
              style={{
                background: i % 2 === 0 ? '#D72638' : '#FFB400',
                width: Math.random() * 100 + 50 + 'px',
                height: Math.random() * 100 + 50 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 2 + 's',
                animationDuration: (Math.random() * 3 + 2) + 's'
              }}
            ></div>
          ))}
        </div>

        <Container style={{ position: 'relative', zIndex: 1 }}>
          <div className="text-center">
            <h1 className="display-3 display-md-1 fw-bold text-white mb-3 mb-md-4">
              Discover Movies
              <br />
              <span className="gradient-text">Beyond the Screen</span>
            </h1>

            <p className="lead mx-auto mb-4 mb-md-5 px-3" style={{ maxWidth: '600px', color: '#A0A3A8', fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
              Explore trending films, rare gems, and recommendations tailored to your mood.
            </p>

            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mb-5 px-3">
              <Button 
                size="lg"
                className="btn-gradient px-4 px-md-5 py-3"
                onClick={() => onNavigate('discover')}
              >
                <TrendingUp size={20} className="me-2" />
                Start Exploring
              </Button>

              <Button 
                size="lg"
                className="btn-outline-crimson px-4 px-md-5 py-3"
              >
                <Play size={20} className="me-2" />
                Watch Trailer
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Feature Cards */}
      <Container className="py-4 py-md-5">
        <Row className="g-3 g-md-4">
          <Col xs={12} md={4}>
            <div className="feature-card" style={{ 
              background: 'linear-gradient(135deg, rgba(215, 38, 56, 0.1), rgba(26, 26, 29, 0.8))'
            }}>
              <TrendingUp size={32} style={{ color: '#D72638' }} className="mb-3" />
              <h4 className="text-white mb-2">Trending Now</h4>
              <p style={{ color: '#A0A3A8' }}>
                Stay updated with the latest blockbusters and viral hits everyone's watching.
              </p>
            </div>
          </Col>

          <Col xs={12} md={4}>
            <div className="feature-card" style={{ 
              background: 'linear-gradient(135deg, rgba(255, 180, 0, 0.1), rgba(26, 26, 29, 0.8))'
            }}>
              <Star size={32} style={{ color: '#FFB400' }} className="mb-3" />
              <h4 className="text-white mb-2">Rated Classics</h4>
              <p style={{ color: '#A0A3A8' }}>
                Discover timeless masterpieces with top ratings from critics and audiences.
              </p>
            </div>
          </Col>

          <Col xs={12} md={4}>
            <div className="feature-card" style={{ 
              background: 'linear-gradient(135deg, rgba(30, 144, 255, 0.1), rgba(26, 26, 29, 0.8))'
            }}>
              <Heart size={32} style={{ color: '#1E90FF' }} className="mb-3" />
              <h4 className="text-white mb-2">Your Favorites</h4>
              <p style={{ color: '#A0A3A8' }}>
                Curate your personal collection and never lose track of what you love.
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Trending Preview */}
      <Container className="py-4 py-md-5">
        <div className="d-flex justify-content-between align-items-center mb-4 px-2">
          <h2 className="text-white fw-bold fs-3 fs-md-2">
            <span style={{ color: '#D72638' }}>🔥</span> Trending Now
          </h2>
          <Button 
            variant="link" 
            className="text-white text-decoration-none p-0"
            onClick={() => onNavigate('discover')}
          >
            View All →
          </Button>
        </div>
        
        <Row xs={2} sm={3} md={4} lg={6} className="g-2 g-md-3">
          {mockMovies.slice(0, 6).map((movie) => (
            <Col key={movie.id}>
              <MovieCard 
                movie={movie}
                isFavorite={favorites.includes(movie.id)}
                onFavoriteToggle={onFavoriteToggle}
                onClick={() => onNavigate('detail', movie)}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}