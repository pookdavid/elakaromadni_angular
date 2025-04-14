module.exports = (sequelize, DataTypes) => {
  const SavedAd = sequelize.define('SavedAd', {}, {
    tableName: 'saved_ads',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  SavedAd.associate = (models) => {
    SavedAd.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    SavedAd.belongsTo(models.Ad, {
      foreignKey: 'ad_id',
      as: 'ad'
    });
  };

  return SavedAd;
};