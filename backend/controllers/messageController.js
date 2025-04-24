const { Message, User, Ad } = require('../models');
const { success, error } = require('../utils/apiResponse');
const { Op } = require('sequelize');

exports.sendMessage = async (req, res) => {
  try {
    if (!req.body.receiver_id || !req.body.ad_id || !req.body.content) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['receiver_id', 'ad_id', 'content']
      });
    }

    const message = await Message.create({
      sender_id: req.user.userId,
      receiver_id: req.body.receiver_id,
      ad_id: req.body.ad_id,
      content: req.body.content.substring(0, 1000)
    });

    const result = await Message.findByPk(message.id, {
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
        },
        {
          model: Ad,
          as: 'ad',
          attributes: ['id', 'title'],
          include: [{
            model: User,
            as: 'seller',
            attributes: ['id', 'username']
          }]
        }
      ]
    });

    const response = {
      ...result.get({ plain: true }),
      is_read: false
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Message creation failed:', error);
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        error: 'Invalid receiver_id or ad_id',
        details: 'The specified user or ad does not exist'
      });
    }

    res.status(500).json({
      error: 'Failed to send message',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: req.user.userId },
          { receiver_id: req.user.userId }
        ]
      },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username'] },
        { model: User, as: 'receiver', attributes: ['id', 'username'] },
        { model: Ad, as:'ad', attributes: ['id', 'title'] }
      ],
      order: [['created_at', 'DESC']]
    });

    const responseData = conversations.map(conv => ({
      ...conv.toJSON(),
      is_read: conv.is_read || false
    }));

    success(res, 200, responseData);
  } catch (err) {
    error(res, 500, 'Failed to fetch conversations', err);
  }
};