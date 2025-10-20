import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { TrendingUp, Star, Heart, Play } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';
import TrailerModal from '../components/TrailerModal';
import { moviesAPI } from '../services/api';

export default function HomePage({ onNavigate, favorites, onFavoriteToggle, onContentLoaded }) {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching trending movies...');
        
        const response = await moviesAPI.getTrending();
        console.log('✅ Trending response:', response);
        
        const moviesData = response?.data?.data?.movies || response?.data?.data;
        
        if (moviesData && Array.isArray(moviesData)) {
          setTrendingMovies(moviesData);
          console.log('✅ Trending movies loaded:', moviesData.length);
          
          // Notify parent component if callback provided
          if (onContentLoaded) {
            onContentLoaded(moviesData);
          }
          
          // Get featured movie with trailer
          const firstMovie = moviesData[0];
          if (firstMovie) {
            try {
              const detailsRes = await moviesAPI.getDetails(firstMovie.id, 'movie');
              if (detailsRes.data?.success) {
                setFeaturedMovie(detailsRes.data.data);
                console.log('✅ Featured movie loaded with trailer:', detailsRes.data.data.trailerKey);
              }
            } catch (detailsErr) {
              console.warn('⚠️ Could not load featured movie details:', detailsErr);
              // Fallback to basic movie data
              setFeaturedMovie(firstMovie);
            }
          }
        } else {
          console.warn('⚠️ Invalid trending response structure');
          setTrendingMovies([]);
        }
      } catch (err) {
        console.error('❌ Error fetching trending movies:', err);
        setError('Failed to load movies');
      } finally {
        // Small delay for smooth transition
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchData();
  }, [onContentLoaded]);

  // Error State
  if (error) {
    return (
      <div className="content-wrapper page-fade-in" style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0C0C0F 0%, #1A1A1D 50%, #2D1A1F 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="text-center">
          <p className="text-danger fs-5 mb-3">{error}</p>
          <Button className="btn-gradient" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0C0C0F 0%, #1A1A1D 50%, #2D1A1F 100%)' 
    }}>
      {/* Hero Section */}
      <div className="hero-section page-fade-in">
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

            <p className="lead mx-auto mb-4 mb-md-5 px-3" style={{ 
              maxWidth: '600px', 
              color: '#A0A3A8', 
              fontSize: 'clamp(1rem, 2vw, 1.25rem)' 
            }}>
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
                onClick={() => setShowTrailer(true)}
                disabled={!featuredMovie?.trailerKey}
              >
                <Play size={20} className="me-2" />
                Watch Trailer
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Feature Cards */}
      <Container className="py-4 py-md-5 page-fade-in" style={{ animationDelay: '0.2s' }}>
        <Row className="g-3 g-md-4">
          <Col xs={12} md={4}>
            <div className="feature-card" style={{ 
              background: 'linear-gradient(135deg, rgba(215, 38, 56, 0.1), rgba(26, 26, 29, 0.8))',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(215, 38, 56, 0.2)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <TrendingUp size={32} style={{ color: '#D72638' }} className="mb-3" />
              <h4 className="text-white mb-2">Trending Now</h4>
              <p style={{ color: '#A0A3A8', marginBottom: 0 }}>
                Stay updated with the latest blockbusters and viral hits everyone's watching.
              </p>
            </div>
          </Col>

          <Col xs={12} md={4}>
            <div className="feature-card" style={{ 
              background: 'linear-gradient(135deg, rgba(255, 180, 0, 0.1), rgba(26, 26, 29, 0.8))',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 180, 0, 0.2)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <Star size={32} style={{ color: '#FFB400' }} className="mb-3" />
              <h4 className="text-white mb-2">Rated Classics</h4>
              <p style={{ color: '#A0A3A8', marginBottom: 0 }}>
                Discover timeless masterpieces with top ratings from critics and audiences.
              </p>
            </div>
          </Col>

          <Col xs={12} md={4}>
            <div className="feature-card" style={{ 
              background: 'linear-gradient(135deg, rgba(30, 144, 255, 0.1), rgba(26, 26, 29, 0.8))',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(30, 144, 255, 0.2)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <Heart size={32} style={{ color: '#1E90FF' }} className="mb-3" />
              <h4 className="text-white mb-2">Your Favorites</h4>
              <p style={{ color: '#A0A3A8', marginBottom: 0 }}>
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
            style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
          >
            View All →
          </Button>
        </div>
        
        {loading ? (
          // Skeleton Loaders with staggered animation
          <Row xs={2} sm={3} md={4} lg={6} className="g-2 g-md-3">
            {[...Array(6)].map((_, index) => (
              <Col 
                key={index}
                className="page-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MovieCardSkeleton />
              </Col>
            ))}
          </Row>
        ) : (
          // Movie Cards with staggered animation
          <Row xs={2} sm={3} md={4} lg={6} className="g-2 g-md-3">
            {trendingMovies.slice(0, 6).map((movie, index) => (
              <Col 
                key={movie.id}
                className="page-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MovieCard 
                  movie={{
                    ...movie,
                    title: movie.title || movie.name,
                    poster: movie.poster_path 
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : 'https://via.placeholder.com/500x750?text=No+Image',
                    rating: movie.vote_average
                  }}
                  isFavorite={favorites.includes(movie.id)}
                  onFavoriteToggle={onFavoriteToggle}
                  onClick={() => onNavigate('detail', movie)}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Trailer Modal */}
      <TrailerModal 
        show={showTrailer}
        onHide={() => setShowTrailer(false)}
        trailerKey={featuredMovie?.trailerKey}
        title={featuredMovie?.title || featuredMovie?.name}
      />
    </div>
  );
}