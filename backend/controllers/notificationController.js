//notificationController.js
const { Notification } = require('../models');
const { success, error } = require('../utils/apiResponse');

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.userId },
      order: [['created_at', 'DESC']]
    });
    success(res, 200, notifications);
  } catch (err) {
    error(res, 500, 'Failed to fetch notifications', err);
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { 
        id: req.params.id,
        user_id: req.user.userId 
      }
    });

    if (!notification) {
      return error(res, 404, 'Notification not found');
    }

    await notification.update({ is_read: true });
    success(res, 200, notification);
  } catch (err) {
    error(res, 500, 'Failed to update notification', err);
  }
};