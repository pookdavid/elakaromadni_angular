const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CarSpec = sequelize.define('CarSpec', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    year: DataTypes.INTEGER,
    mileage: DataTypes.INTEGER,
    fuel_type: DataTypes.STRING,
    transmission: DataTypes.STRING,
    color: DataTypes.STRING,
    doors: DataTypes.INTEGER,
    ad_id: DataTypes.INTEGER,
    engine_size: DataTypes.STRING,
    body_type: DataTypes.STRING
  }, {
    tableName: 'car_specs',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  CarSpec.associate = (models) => {
    CarSpec.belongsTo(models.Ad, { foreignKey: 'ad_id', as: 'ad' });
  };

  return CarSpec;
};