const { Message, User, Ad } = require('../models');
const { success, error } = require('../utils/apiResponse');

exports.sendMessage = async (req, res) => {
  try {
    const message = await Message.create({
      sender_id: req.user.userId,
      receiver_id: req.body.receiver_id,
      ad_id: req.body.ad_id,
      content: req.body.content,
      is_read: false
    });

    const populatedMessage = await Message.findByPk(message.id, {
      include: [
        { model: User, as: 'Sender', attributes: ['id', 'username'] },
        { model: User, as: 'Receiver', attributes: ['id', 'username'] },
        { model: Ad, attributes: ['id', 'title'] }
      ]
    });

    success(res, 201, populatedMessage);
  } catch (err) {
    error(res, 500, 'Failed to send message', err);
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
        { model: User, as: 'Sender', attributes: ['id', 'username'] },
        { model: User, as: 'Receiver', attributes: ['id', 'username'] },
        { model: Ad, attributes: ['id', 'title'] }
      ],
      order: [['created_at', 'DESC']]
    });

    success(res, 200, conversations);
  } catch (err) {
    error(res, 500, 'Failed to fetch conversations', err);
  }
};