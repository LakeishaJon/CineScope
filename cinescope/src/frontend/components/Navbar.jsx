// src/frontend/components/Navbar.jsx
import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Home, Tv, Heart, User, LogOut } from 'lucide-react';

export default function CineScopeNavbar({ currentPage, setCurrentPage, isLoggedIn, setIsLoggedIn, username }) {
  return (
    <Navbar className="cinescope-navbar py-3">
      <Container fluid className="px-4">
        <Navbar.Brand 
  onClick={() => setCurrentPage('home')} 
  style={{ cursor: 'pointer' }}
>
  <img 
    src="/CineScope logo.png" 
    alt="CineScope Logo" 
    style={{ height: '100px', width: 'auto',  maxWidth: '300px',  transition: 'transform 0.3s ease' }} 
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
  />
</Navbar.Brand>
        
        <Nav className="me-auto ms-5">
          <Nav.Link 
            onClick={() => setCurrentPage('home')}
            className={currentPage === 'home' ? 'active' : ''}
          >
            <Home size={18} className="me-2" />
            Home
          </Nav.Link>
          <Nav.Link 
            onClick={() => setCurrentPage('discover')}
            className={currentPage === 'discover' ? 'active' : ''}
          >
            Discover
          </Nav.Link>
          <Nav.Link 
            onClick={() => setCurrentPage('movies')}
            className={currentPage === 'movies' ? 'active' : ''}
          >
            Movies
          </Nav.Link>
          <Nav.Link 
            onClick={() => setCurrentPage('tvshows')}
            className={currentPage === 'tvshows' ? 'active' : ''}
          >
            <Tv size={18} className="me-2" />
            TV Shows
          </Nav.Link>
          <Nav.Link 
            onClick={() => setCurrentPage('favorites')}
            className={currentPage === 'favorites' ? 'active' : ''}
          >
            <Heart size={18} className="me-2" />
            Favorites
          </Nav.Link>
        </Nav>
        
        <div className="d-flex align-items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="text-white d-flex align-items-center gap-2">
                <User size={18} style={{ color: '#FFB400' }} />
                {username}
              </span>
              <Button 
                variant="outline-danger"
                onClick={() => setIsLoggedIn(false)}
                className="btn-outline-crimson"
              >
                <LogOut size={18} className="me-2" />
                Logout
              </Button>
            </>
          ) : (
            <Button 
              variant="outline-danger"
              onClick={() => setCurrentPage('login')}
              className="btn-outline-crimson"
            >
              Login
            </Button>
          )}
        </div>
      </Container>
    </Navbar>
  );
}