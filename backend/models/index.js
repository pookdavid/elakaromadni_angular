//index.js
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const models = {};

// Load core models first
const coreModels = ['User', 'Category', 'Tag'];
coreModels.forEach(modelName => {
  const model = require(`./${modelName}`)(sequelize, Sequelize.DataTypes);
  models[model.name] = model;
});

// Load other models
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== 'index.js' &&
      !coreModels.includes(file.replace('.js', ''))
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    models[model.name] = model;
  });

// Load junction model
const AdTag = require('./AdTag')(sequelize, Sequelize.DataTypes);
models[AdTag.name] = AdTag;

// Run associations
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = {
  ...models,
  sequelize,
  Sequelize
};