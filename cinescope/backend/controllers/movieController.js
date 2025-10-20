const tmdbService = require('../services/tmdbService');

// Get trending content (movies + TV)
exports.getTrending = async (req, res) => {
  try {
    const [movies, tvShows] = await Promise.all([
      tmdbService.getTrendingMovies(),
      tmdbService.getTrendingTV()
    ]);

    res.json({
      success: true,
      data: {
        movies: movies.results,
        tvShows: tvShows.results
      }
    });
  } catch (error) {
    console.error('Get trending error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching trending content' 
    });
  }
};

// Get popular movies
exports.getPopularMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbService.getPopularMovies(page);

    res.json({
      success: true,
      data: data.results,
      page: data.page,
      totalPages: data.total_pages
    });
  } catch (error) {
    console.error('Get popular movies error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching popular movies' 
    });
  }
};

// Get popular TV shows
exports.getPopularTV = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbService.getPopularTV(page);

    res.json({
      success: true,
      data: data.results,
      page: data.page,
      totalPages: data.total_pages
    });
  } catch (error) {
    console.error('Get popular TV error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching popular TV shows' 
    });
  }
};

// Get now playing movies
exports.getNowPlaying = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbService.getNowPlaying(page);

    res.json({
      success: true,
      data: data.results,
      page: data.page,
      totalPages: data.total_pages
    });
  } catch (error) {
    console.error('Get now playing error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching now playing movies' 
    });
  }
};

// Get movie/TV details
exports.getDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query; // 'movie' or 'tv'

    // Get basic details
    const details = type === 'tv'
      ? await tmdbService.getTVDetails(id)
      : await tmdbService.getMovieDetails(id);

    // Get videos/trailers
    const videos = type === 'tv'
      ? await tmdbService.getTVVideos(id)
      : await tmdbService.getMovieVideos(id);

    // Find official trailer (YouTube)
    const trailer = videos.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    ) || videos.results[0]; // Fallback to first video

    res.json({
      success: true,
      data: {
        ...details,
        trailerKey: trailer?.key || null
      }
    });
  } catch (error) {
    console.error('Get details error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching details' 
    });
  }
};

// Search movies and TV shows
exports.search = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;

    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query is required' 
      });
    }

    const data = await tmdbService.searchMulti(query, page);

    res.json({
      success: true,
      data: data.results,
      page: data.page,
      totalPages: data.total_pages
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error searching content' 
    });
  }
};

// Discover content with filters
exports.discover = async (req, res) => {
  try {
    const { type = 'movie', genre, page = 1 } = req.query;
    const params = { page };
    
    if (genre) {
      params.with_genres = genre;
    }

    const data = type === 'tv'
      ? await tmdbService.discoverTV(params)
      : await tmdbService.discoverMovies(params);

    res.json({
      success: true,
      data: data.results,
      page: data.page,
      totalPages: data.total_pages
    });
  } catch (error) {
    console.error('Discover error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error discovering content' 
    });
  }
};

// Get genres
exports.getGenres = async (req, res) => {
  try {
    const [movieGenres, tvGenres] = await Promise.all([
      tmdbService.getMovieGenres(),
      tmdbService.getTVGenres()
    ]);

    res.json({
      success: true,
      data: {
        movies: movieGenres.genres,
        tv: tvGenres.genres
      }
    });
  } catch (error) {
    console.error('Get genres error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching genres' 
    });
  }
};