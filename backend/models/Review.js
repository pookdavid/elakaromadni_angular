module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rating: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    ad_id: DataTypes.INTEGER,
    created_at: {  // Explicitly define
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'reviews',
    underscored: true,
    timestamps: false,  // Disable automatic timestamps
    createdAt: 'created_at', // Use existing column
    updatedAt: false    // No updated_at column
  });

  Review.associate = (models) => {
    Review.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    Review.belongsTo(models.Ad, {
      foreignKey: 'ad_id',
      as: 'ad'
    });
  };

  return Review;
};