const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const upload = require('../middlewares/upload');
const auth = require('../middlewares/auth');

router.get('/', adController.getAllAds);
router.get('/search', adController.searchAds);
router.get('/:id', adController.getAdById);

router.post('/', auth, adController.createAd);
router.put('/:id', auth, adController.updateAd);
router.delete('/:id', auth, adController.deleteAd);

router.post('/',
  upload.array('images', 5),
  adController.createAd
);

router.get('/', async (req, res) => {
    try {
      const ads = await Ad.findAll({
        include: [{
          model: CarSpec,
          as: 'CarSpec',
          attributes: ['brand', 'model', 'year', 'mileage']
        }]
      });
  
      const response = ads.map(ad => ({
        id: ad.id,
        title: ad.title,
        brand: ad.CarSpec?.brand,
        model: ad.CarSpec?.model,
        price: ad.price,
        specs: {
          year: ad.CarSpec?.year,
          mileage: ad.CarSpec?.mileage
        }
      }));
  
      res.json(response);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

module.exports = router;