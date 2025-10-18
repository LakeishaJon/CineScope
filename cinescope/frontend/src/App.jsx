import React, { useState, useEffect } from 'react';
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
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleFavoriteToggle = async (tmdbId, movieData) => {
    if (!isLoggedIn) {
      alert('Please login to add favorites');
      setCurrentPage('login');
      return;
    }

    try {
      if (favorites.includes(tmdbId)) {
        // Find the favorite ID and remove it
        const response = await favoritesAPI.getFavorites();
        const favorite = response.data.data.find(fav => fav.tmdb_id === tmdbId);
        if (favorite) {
          await favoritesAPI.removeFavorite(favorite.id);
          setFavorites(prev => prev.filter(id => id !== tmdbId));
        }
      } else {
        // Add to favorites
        await favoritesAPI.addFavorite({
          tmdb_id: tmdbId,
          title: movieData.title || movieData.name,
          poster_path: movieData.poster_path,
          media_type: movieData.media_type || 'movie',
          vote_average: movieData.vote_average,
          release_date: movieData.release_date || movieData.first_air_date
        });
        setFavorites(prev => [...prev, tmdbId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Error updating favorites');
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setCurrentPage('detail');
  };

  const handleLogin = async (user, token) => {
    setUsername(user.username);
    setIsLoggedIn(true);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    await loadFavorites();
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setFavorites([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentPage('home');
  };

  const handleNavigation = (page, data = null) => {
    setCurrentPage(page);
    if (data) setSelectedMovie(data);
  };

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
        <h2>Loading...</h2>
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
        />
      )}
      
      {currentPage === 'discover' && (
        <DiscoverPage 
          favorites={favorites}
          onFavoriteToggle={handleFavoriteToggle}
          onMovieClick={handleMovieClick}
        />
      )}
      
      {currentPage === 'movies' && (
        <MoviesPage 
          favorites={favorites}
          onFavoriteToggle={handleFavoriteToggle}
          onMovieClick={handleMovieClick}
        />
      )}
      
      {currentPage === 'tvshows' && (
        <TVShowsPage 
          favorites={favorites}
          onFavoriteToggle={handleFavoriteToggle}
          onMovieClick={handleMovieClick}
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