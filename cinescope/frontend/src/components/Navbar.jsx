import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Offcanvas } from 'react-bootstrap';
import { Home, Tv, Heart, User, LogOut, Menu } from 'lucide-react';


export default function CineScopeNavbar({ currentPage, setCurrentPage, isLoggedIn, setIsLoggedIn, username }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleNavigation = (page) => {
    setCurrentPage(page);
    handleClose();
  };

  return (
    <Navbar className="cinescope-navbar py-3">
      <Container fluid className="px-3 px-md-4">
        <Navbar.Brand 
          onClick={() => handleNavigation('home')} 
          style={{ cursor: 'pointer' }}
          className="d-flex align-items-center gap-2 gap-md-3"
        >
          <img 
            src="/CineScope-logo.png" 
            alt="CineScope Logo" 
            className="navbar-logo"
            style={{ 
              height: '100px',
              width: 'auto',
              maxWidth: '300px',
              transition: 'transform 0.3s ease'
            }} 
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </Navbar.Brand>

        {/* Desktop Navigation */}
        <Nav className="me-auto ms-5 d-none d-lg-flex">
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
        
        {/* Desktop Auth */}
        <div className="d-none d-lg-flex align-items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="text-white d-flex align-items-center gap-2">
                <User size={18} style={{ color: '#FFB400' }} />
                <span className="d-none d-xl-inline">{username}</span>
              </span>
              <Button 
                variant="outline-danger"
                onClick={() => setIsLoggedIn(false)}
                className="btn-outline-crimson"
                size="sm"
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
              size="sm"
            >
              Login
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="link" 
          onClick={handleShow}
          className="d-lg-none text-white p-0"
          style={{ border: 'none', background: 'none' }}
        >
          <Menu size={28} />
        </Button>

        {/* Mobile Offcanvas Menu */}
        <Offcanvas 
          show={show} 
          onHide={handleClose} 
          placement="end"
          style={{ background: '#1A1A1D', color: 'white' }}
        >
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title className="gradient-text fw-bold">CineScope</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column gap-3">
              <Nav.Link 
                onClick={() => handleNavigation('home')}
                className={`text-white ${currentPage === 'home' ? 'active' : ''}`}
              >
                <Home size={20} className="me-3" />
                Home
              </Nav.Link>
              <Nav.Link 
                onClick={() => handleNavigation('discover')}
                className={`text-white ${currentPage === 'discover' ? 'active' : ''}`}
              >
                Discover
              </Nav.Link>
              <Nav.Link 
                onClick={() => handleNavigation('movies')}
                className={`text-white ${currentPage === 'movies' ? 'active' : ''}`}
              >
                Movies
              </Nav.Link>
              <Nav.Link 
                onClick={() => handleNavigation('tvshows')}
                className={`text-white ${currentPage === 'tvshows' ? 'active' : ''}`}
              >
                <Tv size={20} className="me-3" />
                TV Shows
              </Nav.Link>
              <Nav.Link 
                onClick={() => handleNavigation('favorites')}
                className={`text-white ${currentPage === 'favorites' ? 'active' : ''}`}
              >
                <Heart size={20} className="me-3" />
                Favorites
              </Nav.Link>
              
              <hr style={{ borderColor: 'rgba(160, 163, 168, 0.3)' }} />
              
              {isLoggedIn ? (
                <>
                  <div className="text-white d-flex align-items-center gap-2 px-3">
                    <User size={20} style={{ color: '#FFB400' }} />
                    {username}
                  </div>
                  <Button 
                    variant="outline-danger"
                    onClick={() => {
                      setIsLoggedIn(false);
                      handleClose();
                    }}
                    className="btn-outline-crimson w-100"
                  >
                    <LogOut size={18} className="me-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline-danger"
                  onClick={() => handleNavigation('login')}
                  className="btn-outline-crimson w-100"
                >
                  Login
                </Button>
              )}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </Navbar>
  );
}