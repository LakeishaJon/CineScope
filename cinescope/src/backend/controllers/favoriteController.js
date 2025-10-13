const supabase = require('../config/database');

// Get all favorites for user
exports.getFavorites = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching favorites' 
    });
  }
};

// Add favorite
exports.addFavorite = async (req, res) => {
  try {
    const { tmdb_id, title, poster_path, media_type, vote_average, release_date } = req.body;

    if (!tmdb_id || !title || !media_type) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('tmdb_id', tmdb_id)
      .single();

    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: 'Already in favorites' 
      });
    }

    // Add to favorites
    const { data, error } = await supabase
      .from('favorites')
      .insert([{
        user_id: req.user.id,
        tmdb_id,
        title,
        poster_path,
        media_type,
        vote_average,
        release_date
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding favorite' 
    });
  }
};

// Remove favorite
exports.removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Favorite removed'
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error removing favorite' 
    });
  }
};

// Check if item is favorited
exports.checkFavorite = async (req, res) => {
  try {
    const { tmdb_id } = req.params;

    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('tmdb_id', tmdb_id)
      .single();

    res.json({
      success: true,
      isFavorite: !!data
    });
  } catch (error) {
    res.json({
      success: true,
      isFavorite: false
    });
  }
};