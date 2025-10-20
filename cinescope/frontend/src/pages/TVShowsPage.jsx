import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Badge, Button } from 'react-bootstrap';
import { Tv } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';
import { moviesAPI } from '../services/api';

export default function TVShowsPage({ favorites, onFavoriteToggle, onMovieClick, onContentLoaded }) {
  const [popularShows, setPopularShows] = useState([]);
  const [trendingShows, setTrendingShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popularPage, setPopularPage] = useState(1);
  const [popularHasMore, setPopularHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Prevent multiple fetches
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (isFetchingRef.current) return;

    const fetchTVShows = async () => {
      try {
        isFetchingRef.current = true;
        setLoading(true);
        console.log('🔍 Fetching TV shows...');
        
        // Fetch popular TV shows and trending in parallel
        const [popularResponse, trendingResponse] = await Promise.all([
          moviesAPI.getPopularTV(1),
          moviesAPI.getTrending()
        ]);

        console.log('✅ Popular TV response:', popularResponse);
        console.log('✅ Trending response:', trendingResponse);

        const popularData = popularResponse?.data?.data;
        const trendingData = trendingResponse?.data?.data;

        if (popularData && Array.isArray(popularData)) {
          setPopularShows(popularData);
          setPopularHasMore(popularResponse?.data?.page < popularResponse?.data?.totalPages);
          
          // Add to global content state
          if (onContentLoaded) {
            onContentLoaded(popularData);
          }
          
          console.log('✅ Popular TV shows loaded:', popularData.length);
        }

        // Filter trending for TV shows
        if (trendingData) {
          const tvData = trendingData.tvShows || trendingData.movies || trendingData;
          if (Array.isArray(tvData)) {
            const tvShows = tvData.filter(
              item => item.media_type === 'tv' || item.name
            );
            setTrendingShows(tvShows.slice(0, 12));
            
            // Add to global content state
            if (onContentLoaded) {
              onContentLoaded(tvShows.slice(0, 12));
            }
            
            console.log('✅ Trending TV shows loaded:', tvShows.length);
          }
        }
      } catch (err) {
        console.error('❌ Error fetching TV shows:', err);
        setError('Failed to load TV shows');
      } finally {
        setTimeout(() => {
          setLoading(false);
          isFetchingRef.current = false;
        }, 300);
      }
    };

    fetchTVShows();
  }, []); // Empty array - only fetch once!

  const loadMorePopular = async () => {
    if (loadingMore || !popularHasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = popularPage + 1;
      console.log('🔍 Loading more popular TV shows... Page:', nextPage);

      const response = await moviesAPI.getPopularTV(nextPage);
      const showsData = response?.data?.data;

      if (showsData && Array.isArray(showsData)) {
        setPopularShows(prev => [...prev, ...showsData]);
        setPopularPage(nextPage);
        setPopularHasMore(response?.data?.page < response?.data?.totalPages);
        
        // Add to global content state
        if (onContentLoaded) {
          onContentLoaded(showsData);
        }
        
        console.log('✅ Loaded more popular TV shows:', showsData.length);
      }
    } catch (err) {
      console.error('❌ Error loading more TV shows:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (error) {
    return (
      <div className="page-fade-in" style={{ minHeight: '100vh', background: '#0C0C0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <p className="text-danger fs-5">{error}</p>
          <Button className="btn-gradient mt-3" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-fade-in" style={{ minHeight: '100vh', background: '#0C0C0F', paddingTop: '1.5rem', paddingBottom: '2rem' }}>
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
        {!loading && trendingShows.length > 0 && (
          <div className="mb-5">
            <h2 className="text-white fw-bold mb-3 mb-md-4 px-2 fs-4 fs-md-3">
              Trending TV Shows
            </h2>
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
        )}

        {/* Popular TV Shows */}
        <div>
          <h2 className="text-white fw-bold mb-3 mb-md-4 d-flex align-items-center gap-2 px-2 fs-4 fs-md-3">
            <Badge 
              bg="danger" 
              className="px-2 px-md-3 py-1 py-md-2" 
              style={{ 
                fontSize: 'clamp(0.7rem, 2vw, 0.875rem)',
                background: '#D72638'
              }}
            >
              POPULAR
            </Badge>
            Top Series
          </h2>
          
          {loading ? (
            <Row xs={2} sm={3} md={4} lg={6} className="g-2 g-md-3">
              {[...Array(18)].map((_, index) => (
                <Col key={`skeleton-${index}`}>
                  <MovieCardSkeleton />
                </Col>
              ))}
            </Row>
          ) : (
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
          )}

          {/* Load More Popular */}
          {!loading && popularHasMore && (
            <div className="text-center mt-4">
              <Button 
                onClick={loadMorePopular}
                disabled={loadingMore}
                className="btn-gradient px-4 px-md-5 py-2 py-md-3"
                size="lg"
              >
                {loadingMore ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Loading...
                  </>
                ) : (
                  'Load More TV Shows'
                )}
              </Button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}