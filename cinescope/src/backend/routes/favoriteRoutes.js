const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const protect = require('../middleware/auth');

// All routes protected (must be logged in)
router.use(protect);

router.get('/', favoriteController.getFavorites);
router.post('/', favoriteController.addFavorite);
router.delete('/:id', favoriteController.removeFavorite);
router.get('/check/:tmdb_id', favoriteController.checkFavorite);

module.exports = router;