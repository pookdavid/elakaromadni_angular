const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const auth = require('../middlewares/auth');
const { verifyToken } = require('../controllers/authController');


router.get('/', adController.getAllAds);
router.get('/:id', adController.getAdById);
router.get('/search', adController.searchAds);

router.post('/', auth, adController.createAd);
router.put('/:id', auth, adController.updateAd);
router.delete('/:id', auth, adController.deleteAd);

module.exports = router;