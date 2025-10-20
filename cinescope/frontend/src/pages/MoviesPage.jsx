import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Play } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';
import { moviesAPI } from '../services/api';

export default function MoviesPage({ favorites, onFavoriteToggle, onMovieClick, onContentLoaded }) {
  const [popularMovies, setPopularMovies] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popularPage, setPopularPage] = useState(1);
  const [nowPlayingPage, setNowPlayingPage] = useState(1);
  const [popularHasMore, setPopularHasMore] = useState(true);
  const [nowPlayingHasMore, setNowPlayingHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState({ popular: false, nowPlaying: false });
  
  // Prevent multiple fetches
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (isFetchingRef.current) return;

    const fetchMovies = async () => {
      try {
        isFetchingRef.current = true;
        setLoading(true);
        console.log('🔍 Fetching movies...');
        
        // Fetch popular movies and now playing in parallel
        const [popularResponse, nowPlayingResponse] = await Promise.all([
          moviesAPI.getPopularMovies(1),
          moviesAPI.getNowPlaying(1)
        ]);

        console.log('✅ Popular response:', popularResponse);
        console.log('✅ Now playing response:', nowPlayingResponse);

        const popularData = popularResponse?.data?.data;
        const nowPlayingData = nowPlayingResponse?.data?.data;

        if (popularData && Array.isArray(popularData)) {
          setPopularMovies(popularData);
          setPopularHasMore(popularResponse?.data?.page < popularResponse?.data?.totalPages);
          
          // Add to global content state
          if (onContentLoaded) {
            onContentLoaded(popularData);
          }
          
          console.log('✅ Popular movies loaded:', popularData.length);
        }

        if (nowPlayingData && Array.isArray(nowPlayingData)) {
          setNowPlaying(nowPlayingData);
          setNowPlayingHasMore(nowPlayingResponse?.data?.page < nowPlayingResponse?.data?.totalPages);
          
          // Add to global content state
          if (onContentLoaded) {
            onContentLoaded(nowPlayingData);
          }
          
          console.log('✅ Now playing loaded:', nowPlayingData.length);
        }
      } catch (err) {
        console.error('❌ Error fetching movies:', err);
        setError('Failed to load movies');
      } finally {
        setTimeout(() => {
          setLoading(false);
          isFetchingRef.current = false;
        }, 300);
      }
    };

    fetchMovies();
  }, []); // Empty array - only fetch once!

  const loadMorePopular = async () => {
    if (loadingMore.popular || !popularHasMore) return;

    try {
      setLoadingMore(prev => ({ ...prev, popular: true }));
      const nextPage = popularPage + 1;
      console.log('🔍 Loading more popular movies... Page:', nextPage);

      const response = await moviesAPI.getPopularMovies(nextPage);
      const moviesData = response?.data?.data;

      if (moviesData && Array.isArray(moviesData)) {
        setPopularMovies(prev => [...prev, ...moviesData]);
        setPopularPage(nextPage);
        setPopularHasMore(response?.data?.page < response?.data?.totalPages);
        
        // Add to global content state
        if (onContentLoaded) {
          onContentLoaded(moviesData);
        }
        
        console.log('✅ Loaded more popular movies:', moviesData.length);
      }
    } catch (err) {
      console.error('❌ Error loading more popular movies:', err);
    } finally {
      setLoadingMore(prev => ({ ...prev, popular: false }));
    }
  };

  const loadMoreNowPlaying = async () => {
    if (loadingMore.nowPlaying || !nowPlayingHasMore) return;

    try {
      setLoadingMore(prev => ({ ...prev, nowPlaying: true }));
      const nextPage = nowPlayingPage + 1;
      console.log('🔍 Loading more now playing... Page:', nextPage);

      const response = await moviesAPI.getNowPlaying(nextPage);
      const moviesData = response?.data?.data;

      if (moviesData && Array.isArray(moviesData)) {
        setNowPlaying(prev => [...prev, ...moviesData]);
        setNowPlayingPage(nextPage);
        setNowPlayingHasMore(response?.data?.page < response?.data?.totalPages);
        
        // Add to global content state
        if (onContentLoaded) {
          onContentLoaded(moviesData);
        }
        
        console.log('✅ Loaded more now playing:', moviesData.length);
      }
    } catch (err) {
      console.error('❌ Error loading more now playing:', err);
    } finally {
      setLoadingMore(prev => ({ ...prev, nowPlaying: false }));
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
          <h1 className="text-white fw-bold display-5 display-md-4 mb-2">Movies</h1>
          <p style={{ color: '#A0A3A8', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
            Browse our collection of films
          </p>
        </div>

        {/* Popular Movies */}
        <div className="mb-5">
          <h2 className="text-white fw-bold mb-3 mb-md-4 px-2 fs-4 fs-md-3">Popular Movies</h2>
          
          {loading ? (
            <Row xs={2} sm={3} md={4} lg={6} className="g-2 g-md-3">
              {[...Array(12)].map((_, index) => (
                <Col key={`skeleton-popular-${index}`}>
                  <MovieCardSkeleton />
                </Col>
              ))}
            </Row>
          ) : (
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
          )}

          {/* Load More Popular */}
          {!loading && popularHasMore && (
            <div className="text-center mt-4">
              <Button 
                onClick={loadMorePopular}
                disabled={loadingMore.popular}
                className="btn-gradient px-4 px-md-5 py-2 py-md-3"
                size="lg"
              >
                {loadingMore.popular ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Loading...
                  </>
                ) : (
                  'Load More Popular Movies'
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Now Playing */}
        <div>
          <h2 className="text-white fw-bold mb-3 mb-md-4 d-flex align-items-center gap-2 px-2 fs-4 fs-md-3">
            <Play size={20} style={{ color: '#FFB400' }} />
            Now Playing
          </h2>
          
          {loading ? (
            <Row xs={2} sm={3} md={4} lg={6} className="g-2 g-md-3">
              {[...Array(12)].map((_, index) => (
                <Col key={`skeleton-now-${index}`}>
                  <MovieCardSkeleton />
                </Col>
              ))}
            </Row>
          ) : (
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
          )}

          {/* Load More Now Playing */}
          {!loading && nowPlayingHasMore && (
            <div className="text-center mt-4">
              <Button 
                onClick={loadMoreNowPlaying}
                disabled={loadingMore.nowPlaying}
                className="btn-gradient px-4 px-md-5 py-2 py-md-3"
                size="lg"
              >
                {loadingMore.nowPlaying ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Loading...
                  </>
                ) : (
                  'Load More Now Playing'
                )}
              </Button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}