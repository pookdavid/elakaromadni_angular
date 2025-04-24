//userController.js
const { User, SavedAd, Review, Ad } = require('../models');

// Add explicit module.exports at the end
module.exports = {
  getProfile: async (req, res) => {
    try {
      // 1. Get user with saved ads using direct junction table query
      const user = await User.findByPk(req.params.id, {
        attributes: ['id', 'username', 'email', 'created_at'],
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // 2. Get reviews separately to avoid complex includes
      const reviews = await Review.findAll({
        where: { user_id: req.params.id },
        attributes: ['id', 'rating', 'comment', 'created_at'],
        raw: true
      });

      // 3. Format response
      const response = {
        ...user.get({ plain: true }),
        reviews
      };

      res.json(response);

    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch user',
        details: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },

  saveAd: async (req, res) => {
    try {
      if (!req.body.ad_id || isNaN(req.body.ad_id)) {
        return res.status(400).json({ error: 'Valid ad_id is required' });
      }
  
      const savedAd = await SavedAd.create({
        user_id: req.user.userId,
        ad_id: req.body.ad_id
      });
  
      res.status(201).json(savedAd);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'Ad already saved' });
      }
      console.error('Save ad error:', error);
      res.status(500).json({
        error: 'Failed to save ad',
        details: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },

  getMe: async (req, res) => {
    try {
      // 1. Check if authentication middleware has attached a user object
      console.log('[DEBUG] Auth check - req.user:', req.user);
      
      if (!req.user) {
        console.log('[DEBUG] No user object found in request');
        return res.status(401).json({ error: "Authentication required" });
      }
      
      if (!req.user.userId) {
        console.log('[DEBUG] User object exists but no userId found:', req.user);
        return res.status(401).json({ error: "Invalid authentication token" });
      }
      
      console.log(`[DEBUG] Looking up user with ID: ${req.user.userId}`);
      
      // 2. Look up the user in the database
      const user = await User.findByPk(req.user.userId, {
        attributes: ['id', 'username', 'email', 'created_at'],
        raw: true
      });
      
      console.log('[DEBUG] Database query result:', user);
      
      // 3. Handle case where user doesn't exist
      if (!user) {
        console.error(`[ERROR] User ${req.user.userId} not found in database`);
        return res.status(404).json({ error: "User not found" });
      }
      
      // 4. Return user data with success message
      return res.status(200).json({
        message: "User found",
        user
      });
      
    } catch (error) {
      console.error('[ERROR] Get me error:', error);
      
      // 5. Better error handling with specific error types
      if (error.name === 'SequelizeDatabaseError') {
        return res.status(500).json({ 
          error: "Database error",
          details: process.env.NODE_ENV === 'development' ? error.message : null
        });
      }
      
      if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: "Authentication token invalid" });
      }
      
      return res.status(500).json({ 
        error: "Internal server error",
        details: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  }};