import React, { useState, useEffect, useCallback } from 'react';
import CineScopeNavbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import MoviesPage from './pages/MoviesPage';
import TVShowsPage from './pages/TVShowsPage';
import DetailPage from './pages/DetailPage';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';
import { authAPI, favoritesAPI } from './services/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [allContent, setAllContent] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setIsLoggedIn(true);
      setUsername(JSON.parse(savedUser).username);
      loadFavorites();
    }
    setLoading(false);
  }, []);

  // Load favorites from backend
  const loadFavorites = async () => {
    try {
      const response = await favoritesAPI.getFavorites();
      const favoriteIds = response.data.data.map(fav => fav.tmdb_id);
      setFavorites(favoriteIds);
      console.log('✅ Favorites loaded:', favoriteIds);
    } catch (error) {
      console.error('❌ Error loading favorites:', error);
    }
  };

  // Memoize addToAllContent - prevents re-renders!
  const addToAllContent = useCallback((newContent) => {
    setAllContent(prev => {
      const existingIds = new Set(prev.map(item => item.id));
      const uniqueNewContent = newContent.filter(item => !existingIds.has(item.id));
      if (uniqueNewContent.length === 0) return prev; // No changes needed
      return [...prev, ...uniqueNewContent];
    });
  }, []);

  // Memoize handleFavoriteToggle - prevents re-renders!
  const handleFavoriteToggle = useCallback(async (tmdbId, movieData = null) => {
    if (!isLoggedIn) {
      alert('Please login to add favorites');
      setCurrentPage('login');
      return;
    }

    try {
      console.log('🔍 Toggle favorite for:', tmdbId);
      
      const isFavorite = favorites.includes(tmdbId);

      if (isFavorite) {
        // Remove from favorites
        const response = await favoritesAPI.getFavorites();
        const favorite = response.data.data.find(fav => fav.tmdb_id === tmdbId);
        
        if (favorite) {
          await favoritesAPI.removeFavorite(favorite.id);
          setFavorites(prev => prev.filter(id => id !== tmdbId));
          console.log('✅ Removed from favorites');
        }
      } else {
        // Add to favorites
        // If movieData not provided, find it in allContent
        if (!movieData) {
          movieData = allContent.find(item => item.id === tmdbId);
        }

        if (!movieData) {
          console.error('❌ Movie data not found for:', tmdbId);
          alert('Unable to add to favorites. Please try again.');
          return;
        }

        const favoriteData = {
          tmdb_id: tmdbId,
          title: movieData.title || movieData.name,
          poster_path: movieData.poster_path,
          media_type: movieData.media_type || movieData.type || (movieData.name ? 'tv' : 'movie'),
          vote_average: movieData.vote_average,
          release_date: movieData.release_date || movieData.first_air_date
        };

        await favoritesAPI.addFavorite(favoriteData);
        setFavorites(prev => [...prev, tmdbId]);
        console.log('✅ Added to favorites');
      }
    } catch (error) {
      console.error('❌ Error toggling favorite:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert('Error updating favorites. Please try again.');
    }
  }, [isLoggedIn, favorites, allContent]);

  // Memoize handleMovieClick - prevents re-renders!
  const handleMovieClick = useCallback((movie) => {
    // Add movie to allContent when viewing details
    addToAllContent([movie]);
    setSelectedMovie(movie);
    setCurrentPage('detail');
  }, [addToAllContent]);

  // Memoize handleLogin - prevents re-renders!
  const handleLogin = useCallback(async (user, token) => {
    setUsername(user.username);
    setIsLoggedIn(true);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Load favorites
    try {
      const response = await favoritesAPI.getFavorites();
      const favoriteIds = response.data.data.map(fav => fav.tmdb_id);
      setFavorites(favoriteIds);
      console.log('✅ Favorites loaded:', favoriteIds);
    } catch (error) {
      console.error('❌ Error loading favorites:', error);
    }
    
    setCurrentPage('home');
  }, []);

  // Memoize handleLogout - prevents re-renders!
  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUsername('');
    setFavorites([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentPage('home');
  }, []);

  // Memoize handleNavigation - prevents re-renders!
  const handleNavigation = useCallback((page, data = null) => {
    setCurrentPage(page);
    if (data) setSelectedMovie(data);
  }, []);

  // Loading screen
  if (loading) {
    return (
      <div style={{ 
        background: '#0C0C0F', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div className="text-center">
          <div className="spinner-border text-danger mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h2>Loading CineScope...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#0C0C0F', minHeight: '100vh' }}>
      {currentPage !== 'login' && (
        <CineScopeNavbar 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={handleLogout}
          username={username}
        />
      )}
      
      {currentPage === 'home' && (
        <HomePage 
          onNavigate={handleNavigation}
          favorites={favorites}
          onFavoriteToggle={handleFavoriteToggle}
          onContentLoaded={addToAllContent}
        />
      )}
      
      {currentPage === 'discover' && (
        <DiscoverPage 
          favorites={favorites}
          onFavoriteToggle={handleFavoriteToggle}
          onMovieClick={handleMovieClick}
          onContentLoaded={addToAllContent}
        />
      )}
      
      {currentPage === 'movies' && (
        <MoviesPage 
          favorites={favorites}
          onFavoriteToggle={handleFavoriteToggle}
          onMovieClick={handleMovieClick}
          onContentLoaded={addToAllContent}
        />
      )}
      
      {currentPage === 'tvshows' && (
        <TVShowsPage 
          favorites={favorites}
          onFavoriteToggle={handleFavoriteToggle}
          onMovieClick={handleMovieClick}
          onContentLoaded={addToAllContent}
        />
      )}
      
      {currentPage === 'detail' && selectedMovie && (
        <DetailPage 
          movie={selectedMovie}
          onBack={() => setCurrentPage('discover')}
          favorites={favorites}
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}
      
      {currentPage === 'favorites' && (
        <FavoritesPage 
          favorites={favorites}
          allContent={allContent}
          onFavoriteToggle={handleFavoriteToggle}
          onMovieClick={handleMovieClick}
          isLoggedIn={isLoggedIn}
        />
      )}
      
      {currentPage === 'login' && (
        <LoginPage 
          onLogin={handleLogin}
          onBack={() => setCurrentPage('home')}
        />
      )}
    </div>
  );
}