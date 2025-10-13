const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// All routes are public (no auth required for browsing)
router.get('/trending', movieController.getTrending);
router.get('/popular/movies', movieController.getPopularMovies);
router.get('/popular/tv', movieController.getPopularTV);
router.get('/now-playing', movieController.getNowPlaying);
router.get('/search', movieController.search);
router.get('/discover', movieController.discover);
router.get('/genres', movieController.getGenres);
router.get('/:id', movieController.getDetails);

module.exports = router;