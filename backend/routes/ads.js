const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');

router.get('/', adController.getAllAds);
router.get('/search', adController.searchAds);
router.get('/:id', adController.getAdById);

router.post('/', auth, adController.createAd);
router.put('/:id', auth, adController.updateAd);
router.delete('/:id', auth, adController.deleteAd);

module.exports = router;