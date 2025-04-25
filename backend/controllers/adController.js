const { Ad, CarSpec, Tag, Category, User, Review, Message } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../models');
const upload = require('../middlewares/upload');

exports.getAllAds = async (req, res) => {
  try {
    const ads = await Ad.findAll({
      attributes: ['id', 'brand', 'model', 'location', 'price', 'description', 'created_at'],
      include: [
        { 
          model: User, 
          as: 'seller', 
          attributes: ['id', 'username'] 
        },
        { 
          model: CarSpec, 
          as: 'specs',
          attributes: ['year', 'mileage', 'fuel_type', 'transmission', 'color', 'doors', 'engine_size', 'body_type'] 
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
        },
        {
          model: Review,
          as: 'reviews',
          attributes: { exclude: ['updated_at'] },
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'username']
          }]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(ads);
  } catch (error) {
    console.error('Failed to fetch ads:', error);
    res.status(500).json({ 
      error: 'Failed to fetch ads',
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : null
    });
  }
};

exports.getAdById = async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'messages' 
      AND COLUMN_NAME = 'is_read'
    `);

    const hasIsReadColumn = results.length > 0;

    const ad = await Ad.findByPk(req.params.id, {
      include: [
        { 
          model: User, 
          as: 'seller', 
          attributes: ['id', 'username', 'email'] 
        },
        { 
          model: CarSpec, 
          as: 'specs',
          attributes: ['id', 'brand', 'model', 'year', 'mileage', 'fuel_type', 'transmission', 'color', 'doors']
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
        },
        {
          model: Review,
          as: 'reviews',
          attributes: ['id', 'rating', 'comment', 'created_at'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'username']
          }]
        },
        {
          model: Message,
          as: 'messages',
          attributes: hasIsReadColumn 
            ? ['id', 'content', 'is_read', 'created_at', 'ad_id', 'sender_id', 'receiver_id']
            : ['id', 'content', 'created_at', 'ad_id', 'sender_id', 'receiver_id'],
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['id', 'username']
            },
            {
              model: User,
              as: 'receiver',
              attributes: ['id', 'username']
            }
          ]
        }
      ],
      order: [
        ['created_at', 'DESC'],
        [{model: Message, as: 'messages'}, 'created_at', 'ASC']
      ]
    });

    if (!ad) {
      return res.status(404).json({ 
        error: 'Ad not found',
        details: `No ad found with ID ${req.params.id}`
      });
    }

    if (!hasIsReadColumn && ad.messages) {
      ad.messages = ad.messages.map(message => {
        return {
          ...message.toJSON(),
          is_read: false
        };
      });
    }

    res.json(ad);
  } catch (error) {
    console.error('Error fetching ad:', error);
    res.status(500).json({
      error: 'Failed to fetch ad',
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : null
    });
  }
};

exports.searchAds = async (req, res) => {
  try {
    const adWhereConditions = {};
    
    if (req.query.minPrice) {
      adWhereConditions.price = adWhereConditions.price || {};
      adWhereConditions.price[Op.gte] = Number(req.query.minPrice);
    }
    
    if (req.query.maxPrice) {
      adWhereConditions.price = adWhereConditions.price || {};
      adWhereConditions.price[Op.lte] = Number(req.query.maxPrice);
    }
    
    const includeOptions = [];
    const carSpecsWhereConditions = {};
    
    if (req.query.brand || req.query.year) {
      if (req.query.brand) {
        carSpecsWhereConditions.brand = {
          [Op.like]: `%${req.query.brand.trim()}%`
        };
      }
      
      if (req.query.year) {
        carSpecsWhereConditions.year = Number(req.query.year);
      }
      
      includeOptions.push({
        model: CarSpec,
        as: 'specs',
        required: false, 
        where: Object.keys(carSpecsWhereConditions).length > 0 ? carSpecsWhereConditions : undefined
      });
    }
    
    includeOptions.push({
      model: User,
      as: 'seller',
      attributes: ['id', 'username'],
      required: false
    });
    
    console.log('Query conditions:', {
      ads: adWhereConditions,
      carSpecs: carSpecsWhereConditions
    });
    
    const results = await Ad.findAll({
      where: adWhereConditions,
      include: includeOptions,
      order: [['created_at', 'DESC']]
    });
    
    console.log('Results count:', results.length);
    
    const formattedResults = results.map(ad => {
      const plainAd = ad.get({ plain: true });
      
      return {
        id: plainAd.id,
        title: plainAd.title,
        price: plainAd.price,
        seller_id: plainAd.seller_id,
        created_at: plainAd.created_at,
        seller: plainAd.seller ? {
          id: plainAd.seller.id,
          username: plainAd.seller.username
        } : null,
        specs: plainAd.specs ? {
          brand: plainAd.specs.brand,
          model: plainAd.specs.model,
          year: plainAd.specs.year,
          fuel_type: plainAd.specs.fuel_type
        } : null
      };
    });
    
    res.json(formattedResults);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'Search failed',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

exports.createAd = [
  upload.array('images', 5),
  async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        console.log('Received body:', req.body);
      console.log('Received files:', req.files);
      const imagePaths = req.files?.map(file => `/uploads/${file.filename}`) || [];

      const validationErrors = [];
      
      if (!req.body.title?.trim()) {
        validationErrors.push({
          field: 'title',
          message: 'Title is required',
          value: req.body.title
        });
      }

      if (!req.body.price || isNaN(req.body.price)) {
        validationErrors.push({
          field: 'price',
          message: 'Valid price is required',
          value: req.body.price
        });
      }

      if (!req.body.specs?.brand?.trim()) {
        validationErrors.push({
          field: 'specs.brand',
          message: 'Brand is required',
          value: req.body.specs?.brand
        });
      }

      if (!req.body.specs?.model?.trim()) {
        validationErrors.push({
          field: 'specs.model',
          message: 'Model is required',
          value: req.body.specs?.model
        });
      }

      if (imagePaths.length === 0) {
        validationErrors.push({
          field: 'images',
          message: 'At least one image is required',
          value: null
        });
      }

      if (validationErrors.length > 0) {
        await transaction.rollback();
        return res.status(400).json({
          error: 'Validation failed',
          failedValidations: validationErrors
        });
      }

      const existingAd = await Ad.findOne({
        where: {
          title: req.body.title.trim(),
          price: parseFloat(req.body.price),
          description: req.body.description?.trim() || null,
          seller_id: req.user.userId
        },
        transaction
      });

      if (existingAd) {
        await transaction.rollback();
        return res.status(409).json({
          error: 'Duplicate ad content',
          message: 'You already have an ad with identical details',
          existingAdId: existingAd.id
        });
      }

      const adData = {
        title: req.body.title.trim(),
        price: parseFloat(req.body.price),
        description: req.body.description?.trim() || null,
        seller_id: req.user.userId,
        category_id: req.body.categoryId || 1,
        images: imagePaths
      };

      if (adData.id) delete adData.id;

      const ad = await Ad.create(adData, { transaction });

      await CarSpec.create({
        brand: req.body.specs.brand.trim(),
        model: req.body.specs.model.trim(),
        year: req.body.specs.year ? parseInt(req.body.specs.year) : null,
        mileage: req.body.specs.mileage ? parseInt(req.body.specs.mileage) : null,
        fuel_type: req.body.specs.fuel_type || null,
        transmission: req.body.specs.transmission || null,
        color: req.body.specs.color || null,
        doors: req.body.specs.doors ? parseInt(req.body.specs.doors) : null,
        ad_id: ad.id
      }, { transaction, ignoreDuplicates: true });

      if (req.body.tags && req.body.tags.length > 0) {
        const existingTags = await Tag.findAll({
          where: { id: req.body.tags },
          transaction
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
          { model: User, as: 'seller', attributes: ['id', 'username'] },
          { model: CarSpec, as: 'specs' },
          { model: Tag, as: 'tags', through: { attributes: [] } }
        ]
      });

      return res.status(201).json(createdAd);

    } catch (error) {
      if (transaction.finished !== 'commit') {
        await transaction.rollback();
      }

      if (error instanceof multer.MulterError) {
        return res.status(400).json({
          error: 'File upload error',
          details: error.message
        });
      }

      console.error('Ad creation error:', error);

      if (error.name === 'SequelizeUniqueConstraintError') {
        if (error.fields && error.fields.PRIMARY) {
          return res.status(500).json({
            error: 'Database error',
            details: 'Primary key conflict - please try again'
          });
        }
        return res.status(409).json({
          error: 'Duplicate content',
          details: 'An identical ad already exists'
        });
      }

      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(e => ({
            field: e.path,
            message: e.message,
            value: e.value
          }))
        });
      }

      return res.status(500).json({
        error: 'Failed to create ad',
        details: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  }
];

const authorizeAdOwner = async (req, res, next) => {
  try {
    const ad = await Ad.findByPk(req.params.id);
    
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    console.log('Ad owner ID:', ad.seller_id);
    console.log('Requesting user ID:', req.user.userId);
    console.log('Comparison:', ad.seller_id === req.user.userId);

    if (ad.seller_id !== req.user.userId) { 
      return res.status(403).json({ error: 'Unauthorized' });
    }

    req.ad = ad;
    next();
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(500).json({ error: 'Server error during authorization' });
  }
};

exports.updateAd = [authorizeAdOwner, async (req, res) => {
  try {
    const updatedAd = await req.ad.update(req.body);
    res.json(updatedAd);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ error: 'Update failed' });
  }
}];

exports.deleteAd = [authorizeAdOwner, async (req, res) => {
  try {
    await req.ad.destroy();
    res.status(204).end();
  } catch (error) {
    console.error('Delete error:', error);
    res.status(400).json({ error: 'Delete failed' });
  }
}];