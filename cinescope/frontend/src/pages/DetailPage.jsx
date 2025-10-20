import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Star, Heart, Play, Calendar, ArrowLeft, Tv } from 'lucide-react';
import { moviesAPI } from '../services/api';
import TrailerModal from '../components/TrailerModal';

export default function DetailPage({ movie, onBack, favorites, onFavoriteToggle }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  
  const isFavorite = favorites.includes(movie.id);
  const movieType = movie.type || (movie.name ? 'tv' : 'movie');
  
  // Prevent multiple fetches
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (isFetchingRef.current) return;

    const fetchDetails = async () => {
      try {
        isFetchingRef.current = true;
        setLoading(true);
        console.log('🔍 Fetching details for:', movie.id, 'Type:', movieType);
        
        const response = await moviesAPI.getDetails(movie.id, movieType);
        
        if (response.data?.success) {
          console.log('✅ Details loaded with trailer:', response.data.data.trailerKey);
          setDetails(response.data.data);
        } else {
          setError('Failed to load details');
        }
      } catch (err) {
        console.error('❌ Error fetching details:', err);
        setError(err.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
          isFetchingRef.current = false;
        }, 300);
      }
    };

    fetchDetails();
  }, [movie.id, movieType]); // Only depend on movie.id and movieType

  if (loading) {
    return (
      <div className="page-fade-in" style={{ minHeight: '100vh', background: '#0C0C0F' }}>
        <Container className="py-5">
          <Button onClick={onBack} className="btn-outline-crimson mb-4" size="sm">
            <ArrowLeft size={16} className="me-2" />
            Back
          </Button>
          
          {/* Skeleton Loading State */}
          <Row className="g-4">
            <Col xs={12} md={4}>
              <div className="skeleton" style={{ width: '100%', aspectRatio: '2/3', borderRadius: '0.5rem' }} />
            </Col>
            <Col xs={12} md={8}>
              <div className="skeleton mb-3" style={{ width: '60%', height: '3rem', borderRadius: '0.5rem' }} />
              <div className="skeleton mb-4" style={{ width: '40%', height: '2rem', borderRadius: '0.5rem' }} />
              <div className="skeleton mb-2" style={{ width: '100%', height: '1rem', borderRadius: '0.5rem' }} />
              <div className="skeleton mb-2" style={{ width: '100%', height: '1rem', borderRadius: '0.5rem' }} />
              <div className="skeleton mb-2" style={{ width: '80%', height: '1rem', borderRadius: '0.5rem' }} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-fade-in" style={{ minHeight: '100vh', background: '#0C0C0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container className="py-5">
          <div className="text-center">
            <p className="text-danger fs-5">Error: {error}</p>
            <Button onClick={onBack} className="btn-outline-crimson mt-3">Go Back</Button>
          </div>
        </Container>
      </div>
    );
  }

  if (!details) return null;

  const title = details.title || details.name;
  const year = details.release_date?.substring(0, 4) || details.first_air_date?.substring(0, 4) || 'N/A';
  const posterUrl = details.poster_path 
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';
  const backdropUrl = details.backdrop_path
    ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
    : null;

  return (
    <>
      <div className="page-fade-in" style={{ 
        background: '#0C0C0F',
        minHeight: '100vh',
        paddingBottom: '2rem'
      }}>
        {/* Backdrop Image */}
        {backdropUrl && (
          <div style={{
            position: 'relative',
            height: '60vh',
            backgroundImage: `url(${backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(12, 12, 15, 0.3) 0%, #0C0C0F 100%)'
            }}></div>
          </div>
        )}

        <Container style={{ 
          position: 'relative',
          marginTop: backdropUrl ? '-15rem' : '2rem'
        }}>
          {/* Back Button */}
          <Button 
            onClick={onBack}
            className="btn-outline-crimson mb-3 mb-md-4"
            size="sm"
          >
            <ArrowLeft size={16} className="me-2" />
            Back
          </Button>

          <Row className="g-3 g-md-4">
            {/* Poster */}
            <Col xs={12} md={4} lg={3}>
              <img 
                src={posterUrl}
                alt={title}
                className="img-fluid rounded"
                style={{
                  width: '100%',
                  boxShadow: '0 10px 40px rgba(215, 38, 56, 0.3)'
                }}
              />
            </Col>

            {/* Details */}
            <Col xs={12} md={8} lg={9}>
              <h1 className="text-white fw-bold mb-2 mb-md-3 fs-2 fs-md-1">
                {title}
              </h1>

              {/* Badges */}
              <div className="d-flex flex-wrap gap-2 mb-3 mb-md-4">
                <div style={{
                  background: 'linear-gradient(135deg, #D72638, #FFB400)',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Star size={16} fill="white" />
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
                {/* Watch Trailer Button */}
                {details.trailerKey ? (
                  <Button 
                    size="lg" 
                    className="btn-gradient px-4 px-md-5 py-2 py-md-3"
                    onClick={() => setShowTrailer(true)}
                  >
                    <Play size={18} className="me-2" />
                    Watch Trailer
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    className="btn-gradient px-4 px-md-5 py-2 py-md-3"
                    disabled
                    style={{ opacity: 0.5 }}
                  >
                    <Play size={18} className="me-2" />
                    No Trailer Available
                  </Button>
                )}
                
                <Button 
                  size="lg"
                  onClick={() => onFavoriteToggle(movie.id, movie)}
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
              <Row className="g-3 g-md-4">
                {details.runtime && (
                  <Col xs={6} md={4}>
                    <h6 style={{ color: '#A0A3A8' }}>Runtime</h6>
                    <p className="text-white fw-bold">{details.runtime} min</p>
                  </Col>
                )}
                
                {details.number_of_seasons && (
                  <Col xs={6} md={4}>
                    <h6 style={{ color: '#A0A3A8' }}>Seasons</h6>
                    <p className="text-white fw-bold">{details.number_of_seasons}</p>
                  </Col>
                )}

                {details.budget && details.budget > 0 && (
                  <Col xs={6} md={4}>
                    <h6 style={{ color: '#A0A3A8' }}>Budget</h6>
                    <p className="text-white fw-bold">
                      ${(details.budget / 1000000).toFixed(1)}M
                    </p>
                  </Col>
                )}

                {details.revenue && details.revenue > 0 && (
                  <Col xs={6} md={4}>
                    <h6 style={{ color: '#A0A3A8' }}>Revenue</h6>
                    <p className="text-white fw-bold">
                      ${(details.revenue / 1000000).toFixed(1)}M
                    </p>
                  </Col>
                )}

                {details.status && (
                  <Col xs={6} md={4}>
                    <h6 style={{ color: '#A0A3A8' }}>Status</h6>
                    <p className="text-white fw-bold">{details.status}</p>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Trailer Modal */}
      <TrailerModal 
        show={showTrailer}
        onHide={() => setShowTrailer(false)}
        trailerKey={details.trailerKey}
        title={title}
      />
    </>
  );
}