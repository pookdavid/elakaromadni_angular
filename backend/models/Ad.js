const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Ad = sequelize.define('Ad', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: { msg: 'Title is required' },
        notEmpty: { msg: 'Title cannot be empty' },
        len: [3, 255]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: { msg: 'Price is required' },
        min: 0.01
      }
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'categories',
        key: 'id'
      }
    }
  }, {
    tableName: 'ads',
    underscored: true,
    indexes: [
      {
        name: 'unique_ad_composite',
        unique: true,
        fields: ['title', 'price', 'description', 'seller_id']
      }
    ]
  });

  Ad.associate = (models) => {
    Ad.belongsTo(models.User, {
      foreignKey: 'seller_id',
      as: 'seller'
    });
    Ad.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category'
    });
    Ad.hasOne(models.CarSpec, {
      foreignKey: 'ad_id',
      as: 'specs'
    });
    Ad.belongsToMany(models.Tag, {
      through: models.AdTag,
      foreignKey: 'ad_id',
      otherKey: 'tag_id',
      as: 'tags'
    });
    Ad.hasMany(models.Review, {
      foreignKey: 'ad_id',
      as: 'reviews'
    });
    Ad.hasMany(models.Message, {
      foreignKey: 'ad_id',
      as: 'messages'
    });
    Ad.hasMany(models.SavedAd,{
      foreignKey: 'ad_id',
      as: 'saved_ads'
    });
  };

  return Ad;
};