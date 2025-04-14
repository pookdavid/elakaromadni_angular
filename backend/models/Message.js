module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    content: DataTypes.TEXT,
    is_read: DataTypes.BOOLEAN
  });

  Message.associate = models => {
    Message.belongsTo(models.User, { as: 'sender', foreignKey: 'sender_id' });
    Message.belongsTo(models.User, { as: 'receiver', foreignKey: 'receiver_id' });
    Message.belongsTo(models.Ad, { foreignKey: 'ad_id' });
  };

  return Message;
};