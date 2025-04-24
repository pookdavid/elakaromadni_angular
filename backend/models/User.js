//User.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
    },
    username: {
      type: DataTypes.STRING, 
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash'
    },
    role: {
      type: DataTypes.ENUM('user', 'seller', 'admin'),
      defaultValue: 'user'
    }
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  User.associate = (models) => {
    User.hasMany(models.Ad, {
      foreignKey: 'seller_id',
      as: 'ads'
    });

    User.hasMany(models.Message, {
      foreignKey: 'sender_id',
      as: 'sentMessages'
    });

    User.hasMany(models.Message, {
      foreignKey: 'receiver_id',
      as: 'receivedMessages'
    });

    User.hasMany(models.Review, {
      foreignKey: 'user_id',
      as: 'reviews'
    });

    User.hasMany(models.Notification, {
      foreignKey: 'user_id',
      as: 'notifications'
    });

    User.hasMany(models.Payment, {
      foreignKey: 'user_id',
      as: 'payments'
    });

    User.hasMany(models.SavedAd, {
      foreignKey: 'user_id',
      as: 'saved_ads'
    });

    User.hasMany(models.QuestionAnswer, {
      foreignKey: 'user_id',
      as: 'questionsAnswers'
    });
  };

  return User;
};