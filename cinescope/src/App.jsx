import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import MoviesPage from './pages/MoviesPage';
import TVShowsPage from './pages/TVShowsPage';
import DetailPage from './pages/DetailPage';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';
import { mockMovies, mockTVShows } from './data/mockData';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const allContent = [...mockMovies, ...mockTVShows];

  // Handle favorite toggle
  const handleFavoriteToggle = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  // Handle movie click
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setCurrentPage('detail');
  };

  // Handle login
  const handleLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  // Handle navigation
  const handleNavigation = (page, data = null) => {
    setCurrentPage(page);
    if (data) setSelectedMovie(data);
  };

  return (
    <div style={{ background: '#0C0C0F', minHeight: '100vh' }}>
      {/* Navbar (hidden on login page) */}
      {currentPage !== 'login' && (
        <Navbar 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          username={username}
        />
      )}
      
      {/* Page Routing */}
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
          allContent={allContent}
          onFavoriteToggle={handleFavoriteToggle}
          onMovieClick={handleMovieClick}
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