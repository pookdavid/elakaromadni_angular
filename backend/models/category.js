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
    timestamps: false,
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