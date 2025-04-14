const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Ad = sequelize.define('Ad', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
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
        min: 0
      }
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'ads',
    underscored: true,
    timestamps: false,
    freezeTableName: true
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
      through: 'ad_tags',
      foreignKey: 'ad_id',
      as: 'tags'
    });
  };

  return Ad;
};