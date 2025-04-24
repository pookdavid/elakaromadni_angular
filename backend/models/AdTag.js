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
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
    paranoid: false,
    autoIncrement: false
  });

  AdTag.removeAttribute('id');

  return AdTag;
};