const { User, SavedAd, Review, Ad } = require('../models');

module.exports = {
  getProfile: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: ['id', 'username', 'email', 'created_at'],
        include: [
          { 
            model: Ad,
            as: 'savedAds',
            through: { attributes: [] }
          },
          { 
            model: Review,
            as: 'reviews'
          }
        ]
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  saveAd: async (req, res) => {
    try {
      const savedAd = await SavedAd.create({
        user_id: req.user.userId,
        ad_id: req.body.ad_id
      });
      res.status(201).json(savedAd);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getMe: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.userId, {
        attributes: ['id', 'username', 'email', 'created_at'],
        include: [
          {
            model: Ad,
            as: 'savedAds',
            through: { attributes: [] }
          },
          {
            model: Review,
            as: 'reviews'
          }
        ]
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        savedAds: user.savedAds,
        reviews: user.reviews
      });

    } catch (error) {
      console.error('Get me error:', error);
      res.status(500).json({
        error: error.message.includes('alias') 
          ? "Server configuration error" 
          : "Internal server error"
      });
    }
  }
};