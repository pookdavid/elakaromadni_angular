// models/AdTag.js
module.exports = (sequelize, DataTypes) => {
  const AdTag = sequelize.define('AdTag', {
    ad_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    tag_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    }
  }, {
    tableName: 'ad_tags',
    timestamps: false,
    underscored: true,
    // Disable all automatic fields
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
    paranoid: false,
    // Disable auto-increment
    autoIncrement: false
  });

  // Remove any default ID field
  AdTag.removeAttribute('id');

  return AdTag;
};