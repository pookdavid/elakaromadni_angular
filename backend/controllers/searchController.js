//searchController.js
const { Ad, CarSpec } = require('../models');
const { Op } = require('sequelize');
const { success, error } = require('../utils/apiResponse');

exports.searchAds = async (req, res) => {
  try {
    const { query, minPrice, maxPrice, brand, year, fuelType } = req.query;
    
    const where = {};
    if (query) where.title = { [Op.like]: `%${query}%` };
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    const include = [{
      model: CarSpec,
      where: {
        ...(brand && { brand }),
        ...(year && { year: parseInt(year) }),
        ...(fuelType && { fuel_type: fuelType })
      }
    }];

    const ads = await Ad.findAll({ 
      where,
      include,
      order: [['created_at', 'DESC']]
    });

    success(res, 200, ads);
  } catch (err) {
    error(res, 500, 'Search failed', err);
  }
};