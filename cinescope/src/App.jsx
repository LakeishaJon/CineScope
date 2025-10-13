import React, { useState } from 'react';
import CineScopeNavbar from './frontend/components/Navbar';
import HomePage from './frontend/pages/HomePage';
import DiscoverPage from './frontend/pages/DiscoverPage';
import MoviesPage from './frontend/pages/MoviesPage';
import TVShowsPage from './frontend/pages/TVShowsPage';
import DetailPage from './frontend/pages/DetailPage';
import FavoritesPage from './frontend/pages/FavoritesPage';
import LoginPage from './frontend/pages/LoginPage';
import { mockMovies, mockTVShows } from './frontend/data/mockData';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const allContent = [...mockMovies, ...mockTVShows];

  const handleFavoriteToggle = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setCurrentPage('detail');
  };

  const handleLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleNavigation = (page, data = null) => {
    setCurrentPage(page);
    if (data) setSelectedMovie(data);
  };

  return (
    <div style={{ background: '#0C0C0F', minHeight: '100vh' }}>
      {currentPage !== 'login' && (
        <CineScopeNavbar 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
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