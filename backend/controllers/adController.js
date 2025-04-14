const { Ad, CarSpec, Tag, Category, User, Review, Message } = require('../models');
const { Op } = require('sequelize');

exports.getAllAds = async (req, res) => {
  try {
    const ads = await Ad.findAll({
      include: [
        { model: User, as: 'seller', attributes: ['id', 'username'] },
        { model: CarSpec, as: 'specs' },
        { model: Category, as: 'category' },
        { model: Tag, as: 'tags', through: { attributes: [] } },
        { model: Review, as: 'reviews' }
      ]
    });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ads', details: error.message });
  }
};

exports.getAdById = async (req, res) => {
  try {
    const ad = await Ad.findByPk(req.params.id, {
      include: [
        { model: User, as: 'seller', attributes: ['id', 'username'] },
        { model: CarSpec, as: 'specs' },
        { model: Category, as: 'category' },
        { model: Tag, as: 'tags', through: { attributes: [] } },
        { model: Review, as: 'reviews' },
        { model: Message, as: 'messages' }
      ]
    });

    if (!ad) return res.status(404).json({ error: 'Ad not found' });
    res.json(ad);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ad', details: error.message });
  }
};

exports.searchAds = async (req, res) => {
  try {
    const { minPrice, maxPrice, brand, year, fuelType, category } = req.query;
    const where = {};
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    const include = [{
      model: CarSpec,
      as: 'specs',
      where: {
        ...(brand && { brand }),
        ...(year && { year: parseInt(year) }),
        ...(fuelType && { fuel_type: fuelType })
      }
    }];

    if (category) {
      include.push({
        model: Category,
        as: 'category',
        where: { name: category }
      });
    }

    const ads = await Ad.findAll({ where, include });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
};

exports.createAd = async (req, res) => {
  const transaction = await Ad.sequelize.transaction();

  try {
    const errors = [];
    if (!req.body.title?.trim()) errors.push('Title is required');
    if (!req.body.price || isNaN(req.body.price)) errors.push('Valid price is required');
    if (req.body.price <= 0) errors.push('Price must be positive');
    if (!req.body.specs?.brand?.trim()) errors.push('Brand is required');
    if (!req.body.specs?.model?.trim()) errors.push('Model is required');

    if (errors.length > 0) {
      await transaction.rollback();
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors 
      });
    }

    const categoryId = req.body.categoryId || 1;
    const categoryExists = await Category.count({
      where: { id: categoryId },
      transaction
    });

    if (!categoryExists) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Category does not exist' });
    }

    const ad = await Ad.create({
      title: req.body.title.trim(),
      description: req.body.description?.trim() || null,
      price: parseFloat(req.body.price),
      seller_id: req.user.userId,
      category_id: categoryId,
      id: undefined
    }, { transaction });

    await CarSpec.create({
      brand: req.body.specs.brand.trim(),
      model: req.body.specs.model.trim(),
      year: req.body.specs.year ? parseInt(req.body.specs.year) : null,
      mileage: req.body.specs.mileage ? parseInt(req.body.specs.mileage) : null,
      fuel_type: req.body.specs.fuelType?.trim() || null,
      transmission: req.body.specs.transmission?.trim() || null,
      color: req.body.specs.color?.trim() || null,
      doors: req.body.specs.doors ? parseInt(req.body.specs.doors) : null,
      ad_id: ad.id
    }, { transaction });

    if (req.body.tags?.length) {
      const existingTags = await Tag.findAll({
        where: { id: req.body.tags },
        transaction,
        attributes: ['id']
      });

      if (existingTags.length !== req.body.tags.length) {
        await transaction.rollback();
        return res.status(400).json({ 
          error: 'Invalid tags',
          details: 'One or more tags do not exist'
        });
      }

      await ad.addTags(req.body.tags, { transaction });
    }

    await transaction.commit();

    const createdAd = await Ad.findByPk(ad.id, {
      include: [
        { 
          model: User, 
          as: 'seller', 
          attributes: ['id', 'username'] 
        },
        { 
          model: CarSpec, 
          as: 'specs' 
        },
        { 
          model: Category, 
          as: 'category',
          attributes: ['id', 'name']
        },
        { 
          model: Tag, 
          as: 'tags',
          through: { attributes: [] },
          attributes: ['id', 'name']
        }
      ],
      attributes: { exclude: ['seller_id', 'category_id'] }
    });

    return res.status(201).json(createdAd);

  } catch (error) {
    await transaction.rollback();
    
    console.error('Full error details:', {
      message: error.message,
      sql: error.sql,
      parameters: error.parameters,
      stack: error.stack
    });

    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      return res.status(400).json({ 
        error: 'Data validation failed',
        details: validationErrors 
      });
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        error: 'Reference error',
        details: 'Invalid user, category, or tag reference'
      });
    }

    return res.status(500).json({
      error: 'Failed to create ad',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

exports.updateAd = async (req, res) => {
  try {
    const ad = await Ad.findByPk(req.params.id);
    if (!ad) return res.status(404).json({ error: 'Ad not found' });
    
    if (ad.sellerId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { specs, tags, ...adData } = req.body;
    await ad.update(adData);

    if (specs) {
      await CarSpec.update(specs, { 
        where: { ad_id: ad.id }
      });
    }

    if (tags) {
      await ad.setTags(tags);
    }

    const updatedAd = await Ad.findByPk(ad.id, {
      include: [
        { model: CarSpec, as: 'specs' },
        { model: Tag, as: 'tags' }
      ]
    });

    res.json(updatedAd);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update ad', details: error.message });
  }
};

exports.deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findByPk(req.params.id);
    if (!ad) return res.status(404).json({ error: 'Ad not found' });

    if (ad.sellerId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await ad.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete ad', details: error.message });
  }
};