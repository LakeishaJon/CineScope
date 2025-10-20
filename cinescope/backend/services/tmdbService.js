const tmdbApi = require('../config/tmdb');

class TMDbService {
  // Get trending movies
  async getTrendingMovies(timeWindow = 'week') {
    const response = await tmdbApi.get(`/trending/movie/${timeWindow}`);
    return response.data;
  }

  // Get trending TV shows
  async getTrendingTV(timeWindow = 'week') {
    const response = await tmdbApi.get(`/trending/tv/${timeWindow}`);
    return response.data;
  }

  // Get popular movies
  async getPopularMovies(page = 1) {
    const response = await tmdbApi.get('/movie/popular', { params: { page } });
    return response.data;
  }

  // Get popular TV shows
  async getPopularTV(page = 1) {
    const response = await tmdbApi.get('/tv/popular', { params: { page } });
    return response.data;
  }

  // Get now playing movies
  async getNowPlaying(page = 1) {
    const response = await tmdbApi.get('/movie/now_playing', { params: { page } });
    return response.data;
  }

  // Get movie details
  async getMovieDetails(movieId) {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  }

  // Get TV show details
  async getTVDetails(tvId) {
    const response = await tmdbApi.get(`/tv/${tvId}`);
    return response.data;
  }

  // Search movies and TV shows
  async searchMulti(query, page = 1) {
    const response = await tmdbApi.get('/search/multi', { 
      params: { query, page } 
    });
    return response.data;
  }

  // Discover movies by genre
  async discoverMovies(params = {}) {
    const response = await tmdbApi.get('/discover/movie', { params });
    return response.data;
  }

  // Discover TV shows by genre
  async discoverTV(params = {}) {
    const response = await tmdbApi.get('/discover/tv', { params });
    return response.data;
  }

  // Get movie genres
  async getMovieGenres() {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.data;
  }

  // Get TV genres
  async getTVGenres() {
    const response = await tmdbApi.get('/genre/tv/list');
    return response.data;
  }


// Get movie videos/trailers
async getMovieVideos(movieId) {
  const response = await tmdbApi.get(`/movie/${movieId}/videos`);
  return response.data;
}

// Get TV show videos/trailers
async getTVVideos(tvId) {
  const response = await tmdbApi.get(`/tv/${tvId}/videos`);
  return response.data;
}
}

module.exports = new TMDbService();