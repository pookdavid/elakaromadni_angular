//Notification.js
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'notifications',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    Notification.belongsTo(models.Ad, {
      foreignKey: 'ad_id',
      as: 'ad'
    });
  };

  return Notification;
};