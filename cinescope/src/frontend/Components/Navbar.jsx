function Navbar({ currentPage, setCurrentPage, isLoggedIn, setIsLoggedIn, username }) {
  return (
    <nav className="flex items-center justify-between px-8 py-6 border-b sticky top-0 z-50 backdrop-blur-md" 
      style={{ borderColor: '#A0A3A8' + '20', background: 'rgba(12, 12, 15, 0.95)' }}>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(135deg, #D72638, #FFB400)' }}></div>
            <Film className="absolute inset-0 m-auto text-white" size={24} />
          </div>
          <span className="text-2xl font-bold" style={{ 
            background: 'linear-gradient(135deg, #D72638, #FFB400)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            CineScope
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <button onClick={() => setCurrentPage('home')} className={`flex items-center gap-2 transition ${currentPage === 'home' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
            <Home size={18} />
            Home
          </button>
          <button onClick={() => setCurrentPage('discover')} className={`transition ${currentPage === 'discover' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
            Discover
          </button>
          <button onClick={() => setCurrentPage('movies')} className={`transition ${currentPage === 'movies' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
            Movies
          </button>
          <button onClick={() => setCurrentPage('tvshows')} className={`flex items-center gap-2 transition ${currentPage === 'tvshows' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
            <Tv size={18} />
            TV Shows
          </button>
          <button onClick={() => setCurrentPage('favorites')} className={`flex items-center gap-2 transition ${currentPage === 'favorites' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
            <Heart size={18} />
            Favorites
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <span className="text-white flex items-center gap-2">
              <User size={18} style={{ color: '#FFB400' }} />
              {username}
            </span>
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="px-4 py-2 rounded-lg font-medium transition flex items-center gap-2" 
              style={{ border: '2px solid #D72638', color: '#D72638' }}
            >
              <LogOut size={18} />
              Logout
            </button>
          </>
        ) : (
          <button 
            onClick={() => setCurrentPage('login')}
            className="px-4 py-2 rounded-lg font-medium transition" 
            style={{ border: '2px solid #D72638', color: '#D72638' }}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}