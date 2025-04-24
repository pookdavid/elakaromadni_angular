//search.js
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const searchController = require('../controllers/searchController');
const { Ad, CarSpec, User } = require('../models');
const { success, error } = require('../utils/apiResponse');

router.get('/ads', searchController.searchAds, async (req, res) => {
  try {
    const { 
      brand, 
      minPrice, 
      maxPrice, 
      year, 
      mileage,
      fuelType,
      page = 1,
      limit = 20
    } = req.query;

    // Build where clauses
    const adWhere = {};
    const carSpecWhere = {};
    
    // Price filtering
    if (minPrice || maxPrice) {
      adWhere.price = {};
      if (minPrice) adWhere.price[Op.gte] = Number(minPrice);
      if (maxPrice) adWhere.price[Op.lte] = Number(maxPrice);
    }

    // Car specifications filtering
    if (brand) carSpecWhere.brand = brand;
    if (year) carSpecWhere.year = Number(year);
    if (mileage) carSpecWhere.mileage = { [Op.lte]: Number(mileage) };
    if (fuelType) carSpecWhere.fuel_type = fuelType;

    // Pagination
    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: ads } = await Ad.findAndCountAll({
      where: adWhere,
      include: [
        {
          model: CarSpec,
          where: carSpecWhere
        },
        {
          model: User,
          attributes: ['id', 'username'],
          as: 'seller'
        }
      ],
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    success(res, 200, {
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / limit),
      results: ads
    });

  } catch (err) {
    console.error('Search error:', err);
    error(res, 500, 'Search failed', err);
  }
});

module.exports = router;