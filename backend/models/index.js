const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const models = {};

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file !== 'index.js' &&
      !file.includes('.test.js') &&
      (file.endsWith('.js') || file.endsWith('.cjs'))
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    models[model.name] = model;
  });

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    
    console.log('Database connection established successfully');
  } catch (error) {
    console.error('Database connection error:', error);
  }
})();

module.exports = {
  ...models,
  sequelize,
  Sequelize
};