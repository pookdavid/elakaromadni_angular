const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Tag = sequelize.define('Tag', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    }
  }, {
    tableName: 'tags',
    timestamps: false,
    underscored: true
  });

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Ad, {
      through: models.AdTag,
      foreignKey: 'tag_id',
      otherKey: 'ad_id',
      as: 'ads',
      onDelete: 'CASCADE'
    });
  };

  return Tag;
};