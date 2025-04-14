module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
      rating: DataTypes.INTEGER,
      comment: DataTypes.TEXT
    });
  
    Review.associate = models => {
      Review.belongsTo(models.User);
      Review.belongsTo(models.Ad);
    };
  
    return Review;
  };