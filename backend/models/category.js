//category.js
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    tableName: 'categories',
    timestamps: false, // Disable if your table doesn't have these columns
    underscored: true
  });

  Category.associate = (models) => {
    Category.hasMany(models.Ad, {
      foreignKey: 'category_id',
      as: 'ads'
    });
  };

  return Category;
};