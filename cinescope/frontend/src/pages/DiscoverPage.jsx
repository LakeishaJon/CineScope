import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Search, Filter } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';
import { moviesAPI } from '../services/api';

export default function DiscoverPage({ favorites, onFavoriteToggle, onMovieClick, onContentLoaded }) {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([{ id: 'all', name: 'All' }]);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contentType, setContentType] = useState('movie');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Use ref to prevent multiple simultaneous fetches
  const isFetchingRef = useRef(false);
  const hasLoadedGenresRef = useRef(false);

  // Fetch genres on mount - ONLY ONCE
  useEffect(() => {
    if (hasLoadedGenresRef.current) return;

    const fetchGenres = async () => {
      try {
        console.log('🔍 Fetching genres from API...');
        const response = await moviesAPI.getGenres();
        console.log('✅ Genres response:', response);
        
        const movieGenres = response?.data?.data?.movies;
        
        if (movieGenres && Array.isArray(movieGenres)) {
          const allGenres = [{ id: 'all', name: 'All' }, ...movieGenres];
          setGenres(allGenres);
          hasLoadedGenresRef.current = true;
          console.log('✅ Genres loaded:', movieGenres.map(g => g.name));
        } else {
          console.warn('⚠️ Invalid genres response structure, using fallback');
          setGenres([
            { id: 'all', name: 'All' },
            { id: 28, name: 'Action' },
            { id: 35, name: 'Comedy' },
            { id: 18, name: 'Drama' },
            { id: 27, name: 'Horror' },
            { id: 878, name: 'Sci-Fi' },
            { id: 53, name: 'Thriller' }
          ]);
          hasLoadedGenresRef.current = true;
        }
      } catch (err) {
        console.error('❌ Error fetching genres:', err);
        setGenres([
          { id: 'all', name: 'All' },
          { id: 28, name: 'Action' },
          { id: 35, name: 'Comedy' },
          { id: 18, name: 'Drama' },
          { id: 27, name: 'Horror' }
        ]);
        hasLoadedGenresRef.current = true;
      }
    };

    fetchGenres();
  }, []); // Empty array - only run once!

  // Fetch movies/TV shows based on search or discovery
  useEffect(() => {
    const fetchContent = async () => {
      // Prevent multiple simultaneous fetches
      if (isFetchingRef.current) {
        console.log('⏸️ Already fetching, skipping...');
        return;
      }

      try {
        isFetchingRef.current = true;
        setLoading(true);
        setError(null);

        let response;
        
        console.log('🔍 Fetching content...', { searchQuery, selectedGenre, contentType, page: 1 });
        
        if (searchQuery.trim()) {
          console.log('🔍 Searching for:', searchQuery);
          response = await moviesAPI.search(searchQuery, 1);
        } else if (selectedGenre && selectedGenre !== 'all') {
          console.log('🔍 Discovering by genre:', selectedGenre);
          response = await moviesAPI.discover(contentType, selectedGenre, 1);
        } else {
          console.log('🔍 Fetching popular content');
          response = contentType === 'movie' 
            ? await moviesAPI.getPopularMovies(1)
            : await moviesAPI.getPopularTV(1);
        }

        console.log('✅ Content response:', response);
        
        const contentData = response?.data?.data;
        const pageInfo = response?.data?.page || 1;
        const totalPagesInfo = response?.data?.totalPages || 1;
        
        if (contentData && Array.isArray(contentData)) {
          setMovies(contentData);
          setCurrentPage(1);
          setTotalPages(totalPagesInfo);
          setHasMore(pageInfo < totalPagesInfo);
          
          // Add to global content state
          if (onContentLoaded) {
            onContentLoaded(contentData);
          }
          
          console.log('✅ Movies loaded:', contentData.length, `(Page 1 of ${totalPagesInfo})`);
        } else {
          console.warn('⚠️ Invalid content response structure');
          setMovies([]);
          setHasMore(false);
        }
      } catch (err) {
        console.error('❌ Error fetching content:', err);
        setError('Failed to load content. Please try again.');
        setMovies([]);
        setHasMore(false);
      } finally {
        setTimeout(() => {
          setLoading(false);
          isFetchingRef.current = false;
        }, 300);
      }
    };

    setCurrentPage(1);
    const debounceTimer = setTimeout(fetchContent, 300);
    return () => {
      clearTimeout(debounceTimer);
      isFetchingRef.current = false;
    };
  }, [searchQuery, selectedGenre, contentType]); // Removed onContentLoaded!

  // Load more movies (pagination)
  const loadMore = async () => {
    if (loading || !hasMore || isFetchingRef.current) return;
    
    try {
      isFetchingRef.current = true;
      setLoading(true);
      const nextPage = currentPage + 1;
      
      console.log('🔍 Loading more content... Page:', nextPage);
      
      let response;
      
      if (searchQuery.trim()) {
        response = await moviesAPI.search(searchQuery, nextPage);
      } else if (selectedGenre && selectedGenre !== 'all') {
        response = await moviesAPI.discover(contentType, selectedGenre, nextPage);
      } else {
        response = contentType === 'movie' 
          ? await moviesAPI.getPopularMovies(nextPage)
          : await moviesAPI.getPopularTV(nextPage);
      }
      
      const contentData = response?.data?.data;
      const pageInfo = response?.data?.page || nextPage;
      const totalPagesInfo = response?.data?.totalPages || totalPages;
      
      if (contentData && Array.isArray(contentData)) {
        setMovies(prev => [...prev, ...contentData]);
        setCurrentPage(nextPage);
        setTotalPages(totalPagesInfo);
        setHasMore(pageInfo < totalPagesInfo);
        
        // Add to global content state
        if (onContentLoaded) {
          onContentLoaded(contentData);
        }
        
        console.log('✅ Loaded more movies:', contentData.length, `(Page ${nextPage} of ${totalPagesInfo})`);
      }
    } catch (err) {
      console.error('❌ Error loading more content:', err);
      setError('Failed to load more content.');
    } finally {
      setTimeout(() => {
        setLoading(false);
        isFetchingRef.current = false;
      }, 300);
    }
  };

  const filteredContent = movies.filter(item => {
    const title = item.title || item.name || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="page-fade-in" style={{ minHeight: '100vh', background: '#0C0C0F', paddingTop: '1.5rem', paddingBottom: '2rem' }}>
      <Container>
        {/* Header */}
        <div className="mb-3 mb-md-4 px-2">
          <h1 className="text-white fw-bold display-5 display-md-4 mb-2">Discover</h1>
          <p style={{ color: '#A0A3A8', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
            Explore our entire collection of movies and TV shows
          </p>
        </div>

        {/* Content Type Toggle */}
        <div className="mb-3 px-2">
          <div className="btn-group" role="group">
            <Button
              onClick={() => setContentType('movie')}
              className={contentType === 'movie' ? 'btn-gradient' : 'btn-outline-secondary'}
              size="sm"
            >
              Movies
            </Button>
            <Button
              onClick={() => setContentType('tv')}
              className={contentType === 'tv' ? 'btn-gradient' : 'btn-outline-secondary'}
              size="sm"
            >
              TV Shows
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-3 mb-md-4 px-2">
          <div style={{ position: 'relative', maxWidth: '600px' }}>
            <Search 
              style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#A0A3A8',
                zIndex: 10
              }} 
              size={20} 
            />
            <Form.Control
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${contentType === 'movie' ? 'movies' : 'TV shows'}...`}
              className="search-input"
              style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
            />
          </div>
        </div>

        {/* Genre Filter */}
        <div className="mb-3 mb-md-4 d-flex align-items-center gap-2 flex-wrap px-2">
          <Filter size={20} style={{ color: '#A0A3A8' }} className="d-none d-md-block" />
          {genres.map(genre => (
            <Button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
              className={`genre-btn ${selectedGenre === genre.id ? 'active' : ''}`}
              size="sm"
              style={{
                background: selectedGenre === genre.id ? 'linear-gradient(135deg, #D72638, #FFB400)' : '#1A1A1D',
                color: selectedGenre === genre.id ? '#0C0C0F' : '#A0A3A8',
                border: selectedGenre === genre.id ? 'none' : '1px solid rgba(160, 163, 168, 0.25)',
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                transition: 'all 0.3s ease'
              }}
            >
              {genre.name}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-3 px-2">
            <p style={{ color: '#A0A3A8', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
              {filteredContent.length} results found
              {currentPage > 1 && ` (Page ${currentPage} of ${totalPages})`}
            </p>
          </div>
        )}

        {/* Movie Grid */}
        {loading && movies.length === 0 ? (
          // Show skeleton loaders instead of spinner
          <Row xs={2} sm={3} md={4} lg={6} className="g-2 g-md-3">
            {[...Array(18)].map((_, index) => (
              <Col key={`skeleton-${index}`} className="page-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <MovieCardSkeleton />
              </Col>
            ))}
          </Row>
        ) : error ? (
          <div className="text-center py-5 page-fade-in">
            <p className="text-danger">{error}</p>
            <Button onClick={() => window.location.reload()} className="btn-gradient">
              Try Again
            </Button>
          </div>
        ) : filteredContent.length > 0 ? (
          <>
            <Row xs={2} sm={3} md={4} lg={6} className="g-2 g-md-3">
              {filteredContent.map((item, index) => (
                <Col key={item.id} className="page-fade-in" style={{ animationDelay: `${index * 0.02}s` }}>
                  <MovieCard 
                    movie={{
                      ...item,
                      title: item.title || item.name,
                      poster: item.poster_path 
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : 'https://via.placeholder.com/500x750?text=No+Image',
                      rating: item.vote_average
                    }}
                    isFavorite={favorites.includes(item.id)}
                    onFavoriteToggle={onFavoriteToggle}
                    onClick={() => onMovieClick(item)}
                  />
                </Col>
              ))}
            </Row>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-4 mt-md-5">
                <Button 
                  onClick={loadMore}
                  disabled={loading}
                  className="btn-gradient px-4 px-md-5 py-2 py-md-3"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Loading...
                    </>
                  ) : (
                    <>Load More (Page {currentPage} of {totalPages})</>
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state text-center py-5 page-fade-in">
            <p className="fs-3 fs-md-2 text-white">No results found</p>
            <p style={{ color: '#A0A3A8' }}>Try adjusting your filters or search query</p>
          </div>
        )}
      </Container>
    </div>
  );
}