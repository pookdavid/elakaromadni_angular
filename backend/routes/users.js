const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.get('/me', auth, userController.getMe);
// Public route
router.get('/:id', userController.getProfile);

// Protected routes (require authentication)

router.post('/save-ad', auth, userController.saveAd);

module.exports = router;