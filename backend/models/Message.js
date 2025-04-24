const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ad_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'messages',
    underscored: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
  });

  Message.associate = (models) => {
    Message.belongsTo(models.Ad, {
      foreignKey: 'ad_id',
      as: 'ad'
    });
    Message.belongsTo(models.User, {
      foreignKey: 'sender_id',
      as: 'sender'
    });
    Message.belongsTo(models.User, {
      foreignKey: 'receiver_id',
      as: 'receiver'
    });
  };

  return Message;
};