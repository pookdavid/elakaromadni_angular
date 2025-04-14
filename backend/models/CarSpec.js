module.exports = (sequelize, DataTypes) => {
  const CarSpec = sequelize.define('CarSpec', {
    ad_id: DataTypes.INTEGER,
    brand: DataTypes.STRING,
    model: DataTypes.STRING,
    year: DataTypes.INTEGER,
    mileage: DataTypes.INTEGER,
    fuel_type: DataTypes.STRING,
    transmission: DataTypes.STRING,
    color: DataTypes.STRING,
    doors: DataTypes.INTEGER
  });

  CarSpec.associate = models => {
    CarSpec.belongsTo(models.Ad, {
      foreignKey: 'ad_id',
      as: 'ad'
    });
  };

  return CarSpec;
};